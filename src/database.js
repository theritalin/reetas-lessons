const db = require("./firebase");
const { collection, getDocs, doc, setDoc } = require("firebase/firestore");

async function addCourseWithLessons() {
  try {
    // Kurs dokümanını oluştur
    const courseRef = doc(db, "courses", "courseId2");
    await setDoc(courseRef, {
      courseName: "Intermediate English",
      description: "A course for beginners learning basic English.",
    });

    // Ders 1'i ekle
    const lessonRef = doc(db, "courses/courseId1/lessons", "lessonId2");
    await setDoc(lessonRef, {
      lessonName: "Verbs in English",
      lessonOrder: 2,
    });

    // Konu 1'i ekle (Ders 1 içinde)
    const topicRef1 = doc(
      db,
      "courses/courseId2/lessons/lessonId2/topics",
      "topicId1"
    );
    await setDoc(topicRef1, {
      topicName: "regular",
      content: "Learn how to say regular verbs.",
    });

    // Konu 2'yi ekle (Ders 1 içinde)
    const topicRef2 = doc(
      db,
      "courses/courseId2/lessons/lessonId2/topics",
      "topicId2"
    );
    await setDoc(topicRef2, {
      topicName: "irregular verbs",
      content: "Learn how to say irregular verbs in English.",
    });

    console.log("Dersler ve konular başarıyla yüklendi!");
  } catch (error) {
    console.error("Hata:", error);
  }
}

async function readCourses() {
  try {
    const coursesCollection = collection(db, "courses"); // courses koleksiyonu
    const coursesSnapshot = await getDocs(coursesCollection);

    const coursesList = await Promise.all(
      coursesSnapshot.docs.map(async (courseDoc) => {
        const courseId = courseDoc.id;
        const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
        const lessonSnapshot = await getDocs(lessonsCollection);

        const lessonsList = lessonSnapshot.docs.map((lessonDoc) => ({
          id: lessonDoc.id,
          ...lessonDoc.data(),
        }));

        return {
          id: courseId,
          ...courseDoc.data(),
          lessons: lessonsList,
        };
      })
    );

    console.log(coursesList); // Fetch edilen kursları göster
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
}

async function addActivitiesToAll() {
  try {
    // Fetch all courses from the 'courses' collection
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    // Iterate over each course
    for (const courseDoc of coursesSnapshot.docs) {
      const courseId = courseDoc.id;

      // Fetch all lessons for the current course
      const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
      const lessonsSnapshot = await getDocs(lessonsCollection);

      // Iterate over each lesson
      for (const lessonDoc of lessonsSnapshot.docs) {
        const lessonId = lessonDoc.id;

        // Fetch all topics for the current lesson
        const topicsCollection = collection(
          db,
          `courses/${courseId}/lessons/${lessonId}/topics`
        );
        const topicsSnapshot = await getDocs(topicsCollection);

        // Iterate over each topic
        for (const topicDoc of topicsSnapshot.docs) {
          const topicId = topicDoc.id;

          // Dynamically add activities to the current topic
          await addActivitiesToTopic(courseId, lessonId, topicId);
        }
      }
    }

    console.log(
      "Aktiviteler tüm kurslara, derslere ve konulara başarıyla eklendi!"
    );
  } catch (error) {
    console.error("Hata:", error);
  }
}

// Function to add example activities to a specific topic
async function addActivitiesToTopic(courseId, lessonId, topicId) {
  try {
    // Example activity 1 for the topic
    const activityRef1 = doc(
      db,
      `courses/${courseId}/lessons/${lessonId}/topics/${topicId}/activities`,
      "activityId1"
    );
    await setDoc(activityRef1, {
      activityName: "Example Quiz for " + topicId,
      activityType: "quiz",
      questions: [
        {
          question: `What is an example question for ${topicId} activityId1?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          answer: "Option 1",
        },
      ],
    });

    // Example activity 2 for the topic
    const activityRef2 = doc(
      db,
      `courses/${courseId}/lessons/${lessonId}/topics/${topicId}/activities`,
      "activityId2"
    );
    await setDoc(activityRef2, {
      activityName: "Example Quiz for " + topicId,
      activityType: "quiz",
      questions: [
        {
          question: `What is an example question for ${topicId} activityId2?`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          answer: "Option 1",
        },
      ],
    });

    console.log(
      `Aktiviteler ${courseId} > ${lessonId} > ${topicId} başarıyla eklendi!`
    );
  } catch (error) {
    console.error("Aktivite ekleme hatası:", error);
  }
}

async function addQuizForLesson() {
  try {
    const coursesCollection = collection(db, "courses");
    const coursesSnapshot = await getDocs(coursesCollection);

    for (const courseDoc of coursesSnapshot.docs) {
      const courseId = courseDoc.id;

      const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
      const lessonsSnapshot = await getDocs(lessonsCollection);

      for (const lessonDoc of lessonsSnapshot.docs) {
        const lessonId = lessonDoc.id;

        const quizCollectionRef = collection(
          db,
          `courses/${courseId}/lessons/${lessonId}/quiz`
        );

        // 20 soruluk örnek sınav soruları
        const quizQuestions = [
          { question: "What is the capital of France?", answer: "Paris" },
          { question: "What is 5 + 7?", answer: "12" },
          { question: "Who wrote '1984'?", answer: "George Orwell" },
          { question: "What is the chemical symbol for water?", answer: "H2O" },
          {
            question: "What is the speed of light?",
            answer: "299,792,458 m/s",
          },
          {
            question: "Who painted the Mona Lisa?",
            answer: "Leonardo da Vinci",
          },
          {
            question: "What is the largest planet in our solar system?",
            answer: "Jupiter",
          },
          { question: "What is the square root of 64?", answer: "8" },
          { question: "In which year did the Titanic sink?", answer: "1912" },
          { question: "What is the smallest prime number?", answer: "2" },
          { question: "What is the capital of Japan?", answer: "Tokyo" },
          {
            question: "What is the main ingredient in guacamole?",
            answer: "Avocado",
          },
          {
            question: "Who discovered penicillin?",
            answer: "Alexander Fleming",
          },
          {
            question: "What is the hardest natural substance on Earth?",
            answer: "Diamond",
          },
          {
            question: "What is the name of the longest river in the world?",
            answer: "Nile",
          },
          {
            question: "What is the largest organ in the human body?",
            answer: "Skin",
          },
          {
            question: "Who invented the telephone?",
            answer: "Alexander Graham Bell",
          },
          { question: "What is the capital of Australia?", answer: "Canberra" },
          {
            question: "Which element has the atomic number 1?",
            answer: "Hydrogen",
          },
          {
            question: "What is the main language spoken in Brazil?",
            answer: "Portuguese",
          },
        ];

        // Her soruyu quiz koleksiyonuna ekle
        for (let question of quizQuestions) {
          const questionDocRef = doc(quizCollectionRef); // Create a new document reference
          await setDoc(questionDocRef, question); // Use the document reference for setDoc
        }

        console.log("Quiz successfully added for lessonId:", lessonId);
      }
    }
  } catch (error) {
    console.error("Error adding quiz: ", error);
  }
}

addQuizForLesson();
