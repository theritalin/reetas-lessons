import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { WalletProvider } from "./WalletContext"; // cüzdan bağlamı için
import Homepage from "./HomePage"; // src/Homepage.js
import LessonList from "./pages/LessonList"; // src/pages/LessonList.js
import TopicPage from "./pages/TopicPage"; // src/pages/TopicPage.js
import { CoursesProvider } from "./CoursesContext"; // Context import
import ActivityPage from "./pages/ActivityPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
ReactDOM.render(
  <CoursesProvider>
    <ChakraProvider>
      <WalletProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/lessons" element={<LessonList />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quiz/:courseId/:lessonId" element={<QuizPage />} />
            <Route path="/topics/:courseId/:lessonId" element={<TopicPage />} />
            <Route
              path="/activities/:courseId/:lessonId/:topicId"
              element={<ActivityPage />}
            />
            {/* Dinamik parametre */}
          </Routes>
        </Router>
      </WalletProvider>
    </ChakraProvider>
  </CoursesProvider>,
  document.getElementById("root")
);
