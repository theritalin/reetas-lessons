import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Progress } from "@chakra-ui/react";
import { CoursesContext } from "../CoursesContext"; // Get quiz questions from context
import { WalletContext } from "../WalletContext"; // Context for interacting with the blockchain
import { ChevronLeft } from "lucide-react"; // Icons for navigation

export default function QuizPage() {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store user's answers
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [showCongrats, setShowCongrats] = useState(false); // Congratulation message
  const [score, setScore] = useState(0); // Track user's score
  const { courseId, lessonId, quizId } = useParams(); // Get params from URL
  const { courses } = useContext(CoursesContext); // Get courses from context
  const { account, contract } = useContext(WalletContext); // Wallet and contract from blockchain context
  const [quizData, setQuizData] = useState(null); // Store quiz questions
  const navigate = useNavigate(); // Navigation handler
  const [order, setOrder] = useState(0);
  useEffect(() => {
    if (courses.length > 0) {
      const course = courses.find((course) => course.id === courseId);
      if (course) {
        const lesson = course.lessons.find((lesson) => lesson.id === lessonId);
        if (lesson) {
          const quiz = lesson.quiz;
          setOrder(lesson.lessonOrder);

          if (quiz && lesson.quiz) {
            setQuizData(lesson.quiz);
          }
        }
      }
    }
  }, [courseId, lessonId, courses, order]);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    const correctAnswersCount = quizData.filter(
      (question) => question.answer === selectedAnswers[question.id]
    ).length;
    const totalQuestions = quizData.length;
    console.log(`Toplam Puan: ${(correctAnswersCount / totalQuestions) * 100}`);
    return (correctAnswersCount / totalQuestions) * 100;
  };

  const handleSubmitQuiz = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);

    if (finalScore >= 1) {
      try {
        if (!contract || !account) {
          throw new Error("Wallet not connected or contract not available");
        }

        const tx = await contract.completeLesson(order);
        await tx.wait();
        // Update total progress on the blockchain
        const tx2 = await contract.updateProgress(finalScore);
        await tx2.wait;
        setShowCongrats(true);

        setTimeout(() => {
          navigate(`/lessons`); // Redirect after quiz is done
        }, 3000);
      } catch (error) {
        console.error("Error updating the blockchain:", error);
      }
    } else {
      alert("You scored less than 70%. Try again.");
      setTimeout(() => {
        navigate(`/lessons`); // Redirect after quiz is done
      }, 3000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmitQuiz(); // Submit the quiz when all questions are answered
    }
  };

  if (!quizData) {
    return <div>Loading quiz...</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-blue-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-500 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to={`/lessons`} className="text-white font-bold text-lg">
              <ChevronLeft className="mr-2" /> Back to Lesson
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2">
          <Progress
            value={((currentQuestionIndex + 1) / quizData.length) * 100}
            className="h-2 bg-gray-200"
            indicatorClassName="bg-indigo-500"
          />
        </div>

        {/* Question */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Question {currentQuestionIndex + 1}: {currentQuestion.question}
          </h2>

          {/* Render based on question type */}
          <textarea
            placeholder="Write your answer"
            className="w-full p-4 border rounded-lg"
            value={selectedAnswers[currentQuestion.id] || ""}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
          />
        </div>

        {/* Continue Button */}
        <div className="px-6 pb-6">
          <button
            className={`w-full py-3 rounded-lg text-center text-lg font-bold transition-colors ${
              selectedAnswers[currentQuestion.id] // Enable button only if answered
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Continue
          </button>
        </div>

        {/* Congrats Message */}
        {showCongrats && (
          <div className="p-6 bg-green-100 text-green-800 font-bold text-center rounded-lg">
            Congrats! You've completed the quiz with a score of {score}%.
          </div>
        )}
      </div>
    </div>
  );
}
