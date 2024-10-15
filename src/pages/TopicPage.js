import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";
import { CoursesContext } from "../CoursesContext";

export default function TopicPage() {
  const { courseId, lessonId } = useParams(); // URL parametrelerini al
  const [topics, setTopics] = useState([]);
  const { courses } = useContext(CoursesContext);

  useEffect(() => {
    // Ensure courses is not empty
    if (courses && courses.length > 0) {
      const course = courses.find((course) => course.id === courseId);

      if (course) {
        const lesson = course.lessons.find((lesson) => lesson.id === lessonId);

        if (lesson) {
          setTopics(lesson.topics || []); // Set topics if they exist
        } else {
          console.log("Lesson not found with lessonId:", lessonId); // Log if lesson is not found
        }
      } else {
        console.log("Course not found with courseId:", courseId); // Log if course is not found
      }
    } else {
      console.log("Courses array is empty or undefined."); // Log if courses is empty or undefined
    }
  }, [courseId, lessonId, courses]);

  // courseId, lessonId veya courses değiştiğinde yeniden çalışır

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Home Link Eklendi */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            to="/lessons"
            className="flex items-center text-lg font-bold text-indigo-600"
          >
            <ChevronLeft className="mr-2" /> Lessons
          </Link>
          <Link
            to="/"
            className="flex items-center text-lg font-bold text-indigo-600"
          >
            <Home className="mr-2" /> Home
          </Link>
        </div>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Topics</h1>
            <p className="text-gray-600">Select a topic to start learning</p>
          </div>
        </header>
        <div className="space-y-8">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-4"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {topic.topicName}
                  </h3>
                  <p className="text-sm text-gray-600">{topic.content}</p>
                </div>
                {/* Yönlendirme */}
                <Link
                  to={`/activities/${courseId}/${lessonId}/${topic.id}`}
                  className="w-full bg-indigo-500 text-white py-3 flex items-center justify-center transition-colors duration-300 hover:bg-indigo-600"
                >
                  <span className="mr-2">Go to Activities</span>
                  <ChevronRight size={20} />
                </Link>
              </div>
            ))
          ) : (
            <p>No topics available for this lesson.</p>
          )}
        </div>
      </div>
    </div>
  );
}
