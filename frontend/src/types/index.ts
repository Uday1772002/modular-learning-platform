export interface User {
  id: string;
  email: string;
  role: "admin" | "learner";
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface Question {
  id: string;
  type: "mcq" | "fillInBlank" | "text" | "audio";
  question: string;
  options?: string[];
  correctAnswer: string;
  media?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  questions: Question[];
  order: number;
}

export interface Unit {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
  order: number;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  units: Unit[];
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  sections: Section[];
  createdBy: User;
  enrolledUsers: string[];
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface QuestionAttempt {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  score: number;
}

export interface ChapterProgress {
  chapterId: string;
  completed: boolean;
  attempts: QuestionAttempt[];
  lastAccessed: string;
}

export interface UnitProgress {
  unitId: string;
  chapters: ChapterProgress[];
  completed: boolean;
}

export interface SectionProgress {
  sectionId: string;
  units: UnitProgress[];
  completed: boolean;
}

export interface UserProgress {
  id: string;
  user: string;
  course: Course;
  sections: SectionProgress[];
  overallProgress: number;
  lastAccessed: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface Progress {
  _id: string;
  user: string;
  course: string;
  completedChapters: string[];
  lastAccessed: string;
  createdAt: string;
  updatedAt: string;
}
