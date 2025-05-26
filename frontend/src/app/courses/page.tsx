"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Course } from "../../types";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses().then((data) => {
      console.log("Fetched courses:", data);
      setCourses(data.slice(0, 2)); // Show only 2 courses
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              {/* Nested Structure */}
              <div>
                {course.sections.map((section) => (
                  <div key={section.id} className="mb-4">
                    <h3 className="font-bold text-blue-700">
                      Section: {section.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {section.description}
                    </p>
                    {section.units.map((unit) => (
                      <div key={unit.id} className="ml-4 mb-2">
                        <h4 className="font-semibold text-blue-500">
                          Unit: {unit.title}
                        </h4>
                        {unit.chapters.map((chapter) => (
                          <div key={chapter.id} className="ml-4 mb-1">
                            <h5 className="font-medium text-blue-400">
                              Chapter: {chapter.title}
                            </h5>
                            <div className="ml-4">
                              {chapter.questions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="mb-2 p-2 border rounded bg-gray-50"
                                >
                                  <div className="font-semibold">
                                    Q{idx + 1}: {q.question}
                                  </div>
                                  {q.type === "mcq" && (
                                    <ul className="list-disc ml-6">
                                      {q.options?.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                      ))}
                                    </ul>
                                  )}
                                  {q.type === "fillInBlank" && (
                                    <div className="italic text-gray-600">
                                      [Fill in the blank]
                                    </div>
                                  )}
                                  {q.type === "text" && (
                                    <div className="italic text-gray-600">
                                      [Text answer]
                                    </div>
                                  )}
                                  {q.type === "audio" && (
                                    <div className="italic text-gray-600">
                                      [Audio answer]
                                    </div>
                                  )}
                                  <div className="text-xs text-green-700">
                                    Correct: {q.correctAnswer}
                                  </div>
                                  {q.media && (
                                    <div>
                                      <span className="text-xs text-gray-500">
                                        Media:{" "}
                                      </span>
                                      {q.media.endsWith(".mp3") ||
                                      q.media.endsWith(".wav") ? (
                                        <audio controls src={q.media} />
                                      ) : (
                                        <img
                                          src={q.media}
                                          alt="media"
                                          className="max-w-xs mt-1"
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <Link
                href={`/courses/${course._id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Course
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
