import {
  AuthResponse,
  Course,
  User,
  UserProgress,
  QuestionAttempt,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new HttpError(
      response.status,
      data.message || "Something went wrong"
    );
  }

  return data;
}

export const api = {
  // Auth
  async register(
    email: string,
    password: string,
    role?: "admin" | "learner"
  ): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser(): Promise<User> {
    return fetchApi<User>("/auth/me");
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    return fetchApi<Course[]>("/courses");
  },

  async getCourse(id: string): Promise<Course> {
    return fetchApi<Course>(`/courses/${id}`);
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    return fetchApi<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
  },

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    return fetchApi<Course>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    });
  },

  async deleteCourse(id: string): Promise<void> {
    return fetchApi<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  async enrollInCourse(id: string): Promise<void> {
    return fetchApi<void>(`/courses/${id}/enroll`, {
      method: "POST",
    });
  },

  // Progress
  async getProgress(): Promise<UserProgress[]> {
    return fetchApi<UserProgress[]>("/progress");
  },

  async getCourseProgress(courseId: string): Promise<UserProgress> {
    return fetchApi<UserProgress>(`/progress/${courseId}`);
  },

  async saveChapterProgress(
    courseId: string,
    chapterId: string,
    attempts: QuestionAttempt[],
    completed: boolean
  ): Promise<UserProgress> {
    return fetchApi<UserProgress>(
      `/progress/${courseId}/chapter/${chapterId}`,
      {
        method: "POST",
        body: JSON.stringify({ attempts, completed }),
      }
    );
  },
};
