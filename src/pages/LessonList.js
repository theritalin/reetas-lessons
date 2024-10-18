import React, { useContext, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Zap, Star } from "lucide-react";
import { Progress } from "@chakra-ui/react";
import { ethers } from "ethers";
import { Link } from "react-router-dom"; // Yeni eklenen kısım
import { WalletContext } from "../WalletContext";
import { CoursesContext } from "../CoursesContext";

export default function LessonList() {
  const { account, contract } = useContext(WalletContext);
  const { courses } = useContext(CoursesContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const initialize = async () => {
    //  console.log(`Courses: ${courses}`);
      if (contract && account) {
        await checkUserRegistration();
      }
    };

    initialize();
  }, [contract, account]);

  const checkUserRegistration = async () => {
    if (contract && account) {
      try {
        const userInfo1 = await contract.getUserInfo(account);
        if (!userInfo1 || userInfo1.name === "") {
          // Burada userInfo1 kontrolü yapılıyor
          setUserInfo(null); // Kullanıcı kaydolmamış
        } else {
          setUserInfo(userInfo1); // Kullanıcı kayıtlı
        }
      } catch (error) {
        setUserInfo(null);
        console.error("Error fetching user info:", error);
      }
    }
  };

  const hasPurchasedCourse = (courseId) => {
    if (!userInfo || !userInfo[4]) return false; // userInfo ve userInfo[4] kontrolü
    return (
      Array.isArray(userInfo[4]) &&
      userInfo[4].map(String).includes(String(courseId))
    );
  };

  const hasCompletedLesson = (lessonOrder) => {
    if (!userInfo || !userInfo[5]) return false; // userInfo ve userInfo[4] kontrolü
    ///console.log(`order: ${lessonOrder}`);
   // console.log(`user: ${userInfo}`);
   // console.log(`user: ${userInfo[5]}`);

    return (
      Array.isArray(userInfo[5]) &&
      userInfo[5].map(String).includes(String(lessonOrder))
    );
  };
  const purchaseCourse = async (name, courseId) => {
    try {
      if (!contract || !account) {
        throw new Error("Wallet not connected or contract not available");
      }

      const tx = await contract.makePurchase(name, courseId, {
        value: ethers.parseEther("0.1"),
      });

      await tx.wait();

      console.log("Course purchased successfully:", tx);
    } catch (error) {
      console.error("Error purchasing course:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Home Link Eklendi */}
        <Link
          to="/"
          className="flex items-center text-lg font-bold text-indigo-600 mb-4"
        >
          <ChevronLeft className="mr-2" /> {/* Simgeyi ekle */}
          Home
        </Link>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
            <p className="text-gray-600">Master your language skills</p>
          </div>
          <div className="flex items-center space-x-4"></div>
        </header>

        <div className="space-y-8">
          {courses.map((course) => (
            <div key={course.id} className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {course.courseName}
              </h2>
              {hasPurchasedCourse(course.order) ? (
                course.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={` ${
                      hasCompletedLesson(lesson.lessonOrder)
                        ? "bg-green-500 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-4"
                        : "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-4" // Add green background if completed
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {lesson.lessonName}
                        </h3>
                        {hasCompletedLesson(lesson.lessonOrder) ? (
                          <span className="text-sm text-gray-500"></span>
                        ) : (
                          <span>
                            <Link
                              to={`/quiz/${course.id}/${lesson.id}`}
                              className="w-full  text-black py-3 flex
                             items-center justify-center transition-colors duration-300
                             hover:bg-indigo-600"
                            >
                              <span className="mr-2">Take Quiz</span>
                              <ChevronRight size={20} />
                            </Link>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Progress
                          value={lesson.progress}
                          className="flex-grow mr-4"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {lesson.progress}%
                        </span>
                      </div>
                    </div>
                    {/* Yönlendirme */}
                    <Link
                      to={`/topics/${course.id}/${lesson.id}`}
                      className="w-full bg-indigo-500 text-white py-3 flex
                      items-center justify-center transition-colors duration-300
                      hover:bg-indigo-600"
                    >
                      <span className="mr-2">Go to Topics</span>
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                ))
              ) : (
                <button
                  onClick={() =>
                    purchaseCourse(course.courseName, course.order)
                  }
                  className="w-full bg-red-500 text-white py-3 flex items-center justify-center transition-colors duration-300 hover:bg-red-600"
                >
                  <span className="mr-2">Purchase Course</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

//profilepage düzenle
//shoot
