import React, { createContext, useState, useEffect } from "react";
import db from "./firebase"; // Firebase Firestore instance'ı
const { collection, getDocs } = require("firebase/firestore"); //import ile yaparken sorun oluyor.
export const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      //console.log("Fetching courses...");
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      //console.log("Courses snapshot:", coursesSnapshot);

      if (coursesSnapshot.empty) {
        //console.log("No courses found");
        setCourses([]);
        return;
      }

      const coursesList = await Promise.all(
        coursesSnapshot.docs.map(async (courseDoc) => {
          const courseId = courseDoc.id;
          //console.log("Processing course:", courseId);

          const lessonsCollection = collection(
            db,
            `courses/${courseId}/lessons`
          );
          const lessonSnapshot = await getDocs(lessonsCollection);
          //console.log(`Lessons for course ${courseId}:`, lessonSnapshot);

          const lessonsList = await Promise.all(
            lessonSnapshot.docs.map(async (lessonDoc) => {
              const lessonId = lessonDoc.id;
             // console.log(
             //   `Processing lesson ${lessonId} for course ${courseId}`
             // );

              const topicsCollection = collection(
                db,
                `courses/${courseId}/lessons/${lessonId}/topics`
              );
              const topicsSnapshot = await getDocs(topicsCollection);

              const topicsList = topicsSnapshot.docs.map((topicDoc) => ({
                id: topicDoc.id,
                ...topicDoc.data(),
              }));

              const quizCollection = collection(
                db,
                `courses/${courseId}/lessons/${lessonId}/quiz`
              );
              const quizSnapshot = await getDocs(quizCollection);

              const quizList = quizSnapshot.docs.map((quizDoc) => ({
                id: quizDoc.id,
                ...quizDoc.data(),
              }));

              return {
                id: lessonId,
                ...lessonDoc.data(),
                topics: topicsList,
                quiz: quizList,
              };
            })
          );

          return {
            id: courseId,
            ...courseDoc.data(),
            lessons: lessonsList,
          };
        })
      );

      //console.log("Fetched courses:", coursesList);
      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses }}>
      {children}
    </CoursesContext.Provider>
  );
};
