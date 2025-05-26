"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import { Course, Progress } from "../../types";
import Link from "next/link";
import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, progressData] = await Promise.all([
          api.getCourses(),
          api.getProgress(),
        ]);
        setCourses(coursesData);

        // Transform progress data into a Record
        const progressRecord = progressData.reduce((acc, curr) => {
          const courseId =
            typeof curr.course === "string" ? curr.course : curr.course._id;
          acc[courseId] = {
            _id: curr.id,
            user: curr.user,
            course: courseId,
            completedChapters: curr.sections.flatMap((section) =>
              section.units.flatMap((unit) =>
                unit.chapters
                  .filter((chapter) => chapter.completed)
                  .map((chapter) => chapter.chapterId)
              )
            ),
            lastAccessed: curr.lastAccessed,
            createdAt: curr.createdAt,
            updatedAt: curr.updatedAt,
          };
          return acc;
        }, {} as Record<string, Progress>);

        setProgress(progressRecord);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.email}
            </h1>
            <p className="mt-2 text-gray-600">
              Track your learning progress and continue your courses
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                No courses enrolled yet
              </h3>
              <p className="mt-2 text-gray-600">
                Browse our course catalog to start learning
              </p>
              <div className="mt-6">
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const courseProgress = progress[course._id];
                const completedChapters =
                  courseProgress?.completedChapters?.length || 0;
                const progressPercentage = Math.round(
                  (completedChapters / course.chapters.length) * 100
                );

                return (
                  <div
                    key={course._id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {course.description}
                      </p>
                      <div className="mt-4">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {progressPercentage}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div
                              style={{ width: `${progressPercentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link
                          href={`/courses/${course._id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Continue Learning
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
