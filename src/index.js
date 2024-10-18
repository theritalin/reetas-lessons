import "react-app-polyfill/stable";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "./WalletContext";
import Homepage from "./HomePage";
import LessonList from "./pages/LessonList";
import TopicPage from "./pages/TopicPage";
import { CoursesProvider } from "./CoursesContext";
import ActivityPage from "./pages/ActivityPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CoursesProvider>
      <ChakraProvider>
        <WalletProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/lessons" element={<LessonList />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/quiz/:courseId/:lessonId" element={<QuizPage />} />
              <Route
                path="/topics/:courseId/:lessonId"
                element={<TopicPage />}
              />
              <Route
                path="/activities/:courseId/:lessonId/:topicId"
                element={<ActivityPage />}
              />
            </Routes>
          </Router>
        </WalletProvider>
      </ChakraProvider>
    </CoursesProvider>
  </React.StrictMode>
);
