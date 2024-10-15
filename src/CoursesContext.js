import React, { createContext, useState, useEffect } from "react";
import db from "./firebase"; // Firebase Firestore instance'ı
const { collection, getDocs } = require("firebase/firestore"); //import ile yaparken sorun oluyor.
export const CoursesContext = createContext();

export const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = await Promise.all(
        coursesSnapshot.docs.map(async (courseDoc) => {
          const courseId = courseDoc.id;

          const lessonsCollection = collection(
            db,
            `courses/${courseId}/lessons`
          );
          const lessonSnapshot = await getDocs(lessonsCollection);
          console.log(`Lesson: ${lessonSnapshot}`);
          const lessonsList = await Promise.all(
            lessonSnapshot.docs.map(async (lessonDoc) => {
              const lessonId = lessonDoc.id;

              const quizCollection = collection(
                db,
                `courses/${courseId}/lessons/${lessonId}/quiz`
              );
              const quizSnapshot = await getDocs(quizCollection);

              const quizList = quizSnapshot.docs.map((quizDoc) => ({
                id: quizDoc.id,
                ...quizDoc.data(),
              }));

              const topicsCollection = collection(
                db,
                `courses/${courseId}/lessons/${lessonId}/topics`
              );
              const topicsSnapshot = await getDocs(topicsCollection);

              const topicsList = await Promise.all(
                topicsSnapshot.docs.map(async (topicDoc) => {
                  const topicId = topicDoc.id;

                  const activitiesCollection = collection(
                    db,
                    `courses/${courseId}/lessons/${lessonId}/topics/${topicId}/activities`
                  );
                  const activitiesSnapshot = await getDocs(
                    activitiesCollection
                  );

                  const activitiesList = activitiesSnapshot.docs.map(
                    (activityDoc) => ({
                      id: activityDoc.id,
                      ...activityDoc.data(),
                    })
                  );

                  return {
                    id: topicId,
                    ...topicDoc.data(),
                    activities: activitiesList,
                  };
                })
              );

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

      setCourses(coursesList);
      console.log(`hepsi: ${courses}`);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses }}>
      {children}
    </CoursesContext.Provider>
  );
};
