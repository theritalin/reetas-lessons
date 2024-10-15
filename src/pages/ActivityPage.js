import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom"; // URL'deki parametreler ve yönlendirme için
import { Progress } from "@chakra-ui/react";
import { CoursesContext } from "../CoursesContext"; // CoursesContext'ten courses alıyoruz
import { ChevronLeft, Book, Home } from "lucide-react"; // Gerekli simgeleri import et

export default function ActivityPage() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0); // Aktivite ilerlemesini tutar
  const [activityData, setActivityData] = useState(null); // Aktivite verilerini tutar
  const { courseId, lessonId, topicId } = useParams(); // URL parametrelerini al
  const { courses } = useContext(CoursesContext); // courses verisini context'ten al
  const [topicData, setTopicData] = useState(null); // Aktivite verilerini tutar
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false); // Doğru cevabı tutar
  const [showCongrats, setShowCongrats] = useState(false); // Son aktivitede gösterilecek mesaj
  const navigate = useNavigate(); // Sayfa yönlendirmesi için

  useEffect(() => {
    if (courses.length > 0) {
      // courseId ve lessonId'ye göre dersi bul
      const course = courses.find((course) => course.id === courseId);

      if (course) {
        const lesson = course.lessons.find((lesson) => lesson.id === lessonId);

        if (lesson) {
          const topic = lesson.topics.find((topic) => topic.id === topicId);

          if (topic && topic.activities) {
            setTopicData(topic.activities);
          }
        }
      }
    }
  }, [courseId, lessonId, topicId, courses]);

  useEffect(() => {
    if (
      topicData &&
      topicData.length > 0 &&
      currentActivityIndex < topicData.length
    ) {
      const currentActivity = topicData[currentActivityIndex];
      setActivityData(currentActivity);
    }
  }, [topicData, currentActivityIndex]);

  const handleNextActivity = () => {
    setSelectedAnswer(null); // Yeni aktiviteye geçerken seçili cevabı sıfırla
    setIsCorrectAnswer(false);

    if (topicData && currentActivityIndex < topicData.length - 1) {
      setCurrentActivityIndex((prevIndex) => prevIndex + 1); // Sonraki aktiviteye geç
    } else {
      // Son aktivite bittiğinde tebrik mesajı göster ve bir süre sonra yönlendir
      setShowCongrats(true);
      setTimeout(() => {
        navigate(`/topics/${courseId}/${lessonId}`); // Topics sayfasına yönlendir
      }, 3000); // 3 saniye bekledikten sonra yönlendirme
    }
  };

  if (!activityData) {
    return <div>Loading...</div>; // Veri yüklenene kadar yükleme göstergesi
  }

  const handleAnswerCheck = (option) => {
    const isCorrect = activityData.questions[0].answer === option; // Doğru cevabı kontrol et
    setSelectedAnswer(option); // Seçilen cevabı işaretle
    setIsCorrectAnswer(isCorrect); // Doğru olup olmadığını belirle
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to={`/topics/${courseId}/${lessonId}`}
                className="flex items-center text-lg font-bold text-white-600"
              >
                <ChevronLeft className="mr-2" />
              </Link>
            </div>
            <span className="text-white font-bold"></span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2">
          <Progress
            value={((currentActivityIndex + 1) / topicData.length) * 100} // İlerlemeyi yüzdelik göster
            className="h-2 bg-gray-200"
            indicatorClassName="bg-green-500"
          />
        </div>

        {/* Soru */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {activityData?.questions?.[0]?.question || "No question available"}
          </h2>
          {/* Karakter ve konuşma balonu */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <img
                src={
                  activityData?.Image || "/placeholder.svg?height=120&width=120"
                }
                alt="Image"
                className="w-30 h-30"
              />
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
                <p className="text-gray-800 font-semibold">
                  {activityData?.characterSpeech || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Cevap seçenekleri */}
          <div className="space-y-4">
            {activityData?.questions?.[0]?.options.map((option) => (
              <button
                key={option}
                className={`w-full p-4 text-left text-lg font-medium rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? isCorrectAnswer // Cevap doğruysa
                      ? "bg-green-500 text-white" // Doğru cevap yeşil olur
                      : "bg-red-500 text-white" // Yanlış cevap kırmızı olur
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200" // Seçilmemiş butonlar
                }`}
                onClick={() => handleAnswerCheck(option)}
              >
                {option}
              </button>
            )) || <div>No answers available</div>}
          </div>
        </div>

        {/* Devam butonu */}
        <div className="px-6 pb-6">
          <button
            className={`w-full py-3 rounded-lg text-center text-lg font-bold transition-colors ${
              isCorrectAnswer
                ? "bg-green-500 text-white hover:bg-green-600" // Doğruysa aktif ve yeşil
                : "bg-gray-300 text-gray-500 cursor-not-allowed" // Yanlışsa pasif ve gri
            }`}
            onClick={handleNextActivity}
            disabled={!isCorrectAnswer} // Doğru cevap seçilmeden buton pasif olsun
          >
            Continue
          </button>
        </div>

        {/* Son aktivite tamamlandığında gösterilecek mesaj */}
        {showCongrats && (
          <div className="p-6 bg-green-100 text-green-800 font-bold text-center rounded-lg">
            Congrats! You can go to the next topic.
          </div>
        )}
      </div>
    </div>
  );
}
