import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { Check, X, Loader2, RefreshCw } from 'lucide-react'; // Using lucide-react for icons

// Utility function to safely parse the Firebase config from a global string
const getFirebaseConfig = () => {
  if (typeof __firebase_config !== 'undefined') {
    try {
      return JSON.parse(__firebase_config);
    } catch (e) {
      console.error("Error parsing __firebase_config:", e);
      return null;
    }
  }
  return null;
};

// Application Data and Setup
const firebaseConfig = getFirebaseConfig();
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const FLASHCARD_COLLECTION = 'flashcards';

// Mock data (Fallback)
const MOCK_FLASHCARDS = [
  { id: 'm1', front: 'What is the capital of France?', back: 'Paris' },
  { id: 'm2', front: 'What planet is known as the Red Planet?', back: 'Mars' },
  { id: 'm3', front: 'What is H₂O commonly known as?', back: 'Water' },
];

/**
 * Custom hook for Firebase initialization and authentication.
 * Manages the auth state and Firebase service instances.
 */
const useFirebase = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    if (!firebaseConfig) {
      console.warn("Firebase config is missing. App will use mock data only.");
      setIsAuthReady(true);
      return;
    }

    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const firebaseAuth = getAuth(app);

    setDb(firestore);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Sign in anonymously if no token is available or user is not logged in
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        } catch (error) {
          console.error("Firebase Auth Error:", error);
          // Fallback to anonymous ID if sign-in fails
          setUserId(crypto.randomUUID());
        }
      }
      // Set ready status after the initial auth check/sign-in attempt
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  return { db, userId, isAuthReady };
};


// --- Core Components ---

/**
 * The main Quiz component logic.
 */
const FlashcardQuizApp = () => {
  const { db, userId, isAuthReady } = useFirebase();
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { cardId: 'user answer text' }
  const [quizResults, setQuizResults] = useState(null); // { isScored: boolean, pointsEarned: number, maxPoint: number }

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;

  // 1. Data Fetching (Real-time listener for flashcards)
  useEffect(() => {
    if (!isAuthReady) return;

    if (!db) {
      // Use mock data if Firebase is not configured
      console.log("Using mock flashcard data.");
      setFlashcards(MOCK_FLASHCARDS);
      setIsLoading(false);
      return;
    }

    // Reference to the public collection: /artifacts/{appId}/public/data/flashcards
    const q = collection(db, 'artifacts', appId, 'public', 'data', FLASHCARD_COLLECTION);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardList = [];
      snapshot.forEach((doc) => {
        cardList.push({ id: doc.id, ...doc.data() });
      });
      if (cardList.length === 0) {
        console.warn("No flashcards found in Firestore. Using mock data.");
        setFlashcards(MOCK_FLASHCARDS);
      } else {
        setFlashcards(cardList);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore Flashcard Fetch Error:", error);
      // Fallback to mock data on error
      setFlashcards(MOCK_FLASHCARDS);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, isAuthReady]);

  // 2. Quiz Navigation and State Handlers
  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setCurrentCardIndex(0);
    setUserAnswers({});
    setQuizResults(null);
  };

  const handleAnswerChange = (e) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentCard.id]: e.target.value,
    }));
  };

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  // 3. Scoring Logic (Fixed to avoid 'const' reassignment error)
  const scoreFlashcards = useCallback(() => {
    if (flashcards.length === 0) return null;

    let pointsEarned = 0;
    const maxPoint = flashcards.length;

    flashcards.forEach(card => {
      const userAnswer = (userAnswers[card.id] || '').trim().toLowerCase();
      const correctAnswer = (card.back || '').trim().toLowerCase();

      // Simple scoring: full match required
      if (userAnswer === correctAnswer && userAnswer.length > 0) {
        pointsEarned += 1;
      }
    });

    const isScored = true;
    const isCorrect = pointsEarned === maxPoint; // Correctly derived here

    setQuizResults({
      isScored,
      pointsEarned,
      maxPoint,
      isCorrect,
    });

    // Optionally save the result to Firestore
    if (db && userId) {
      const resultData = {
        userId,
        pointsEarned,
        maxPoint,
        timestamp: new Date().toISOString(),
        answers: userAnswers,
        isCorrect,
      };
      // Save result in a private collection: /artifacts/{appId}/users/{userId}/quiz_results/{docId}
      const docRef = doc(db, 'artifacts', appId, 'users', userId, 'quiz_results', `result-${Date.now()}`);
      setDoc(docRef, resultData).catch(e => console.error("Error saving quiz result:", e));
    }

  }, [flashcards, userAnswers, db, userId]);

  // 4. Component Rendering

  if (isLoading || !isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="ml-2 text-indigo-700">Loading Quiz Data...</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <p className="text-xl text-red-600 font-semibold mb-4">No Flashcards Available</p>
          <p className="text-gray-700">Please add flashcards to the database to start the quiz.</p>
          <p className="mt-2 text-sm text-gray-500">
            Current User ID (for database): <span className="font-mono text-xs select-all">{userId || 'N/A'}</span>
          </p>
        </div>
      </div>
    );
  }

  // --- Quiz Results View ---
  if (quizResults) {
    const { pointsEarned, maxPoint, isCorrect } = quizResults;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl transition-all duration-300">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-800">Quiz Results</h1>

          <div className={`p-4 rounded-xl text-center mb-6 transition-colors duration-300 ${isCorrect ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`}>
            <div className="text-6xl mb-2">
              {isCorrect ? '🎉' : '🤔'}
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              Score: {pointsEarned} / {maxPoint}
            </p>
            <p className={`text-lg font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Perfect score! Great job!' : 'Keep practicing!'}
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">Review Answers</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {flashcards.map((card, index) => {
              const userAnswer = (userAnswers[card.id] || '').trim();
              const correctAnswer = (card.back || '').trim();
              const isAnswerCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
              const CardIcon = isAnswerCorrect ? Check : X;

              return (
                <div key={card.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 flex items-start">
                  <CardIcon className={`w-5 h-5 mt-1 mr-3 ${isAnswerCorrect ? 'text-green-500' : 'text-red-500'}`} />
                  <div className="flex-grow">
                    <p className="font-semibold text-indigo-600">Q{index + 1}: {card.front}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium text-gray-500">Your Answer:</span> <span className={isAnswerCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium italic'}>"{userAnswer || 'No answer'}"</span>
                    </p>
                    {!isAnswerCorrect && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-500">Correct Answer:</span> <span className="font-semibold text-gray-900">"{correctAnswer}"</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full mt-8 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition duration-300 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Start New Quiz
          </button>
        </div>
        <p className="mt-4 text-sm text-indigo-900 opacity-70">
          User ID: <span className="font-mono text-xs select-all">{userId || 'N/A'}</span>
        </p>
      </div>
    );
  }


  // --- Quiz Not Started / Start Screen ---
  if (!isQuizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl text-center">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-4">Flashcard Quiz</h1>
          <p className="text-gray-600 mb-6">Test your knowledge with {totalCards} flashcards.</p>
          <button
            onClick={handleStartQuiz}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-150"
          >
            Start Quiz
          </button>
          <p className="mt-4 text-sm text-indigo-900 opacity-70">
            User ID: <span className="font-mono text-xs select-all">{userId || 'N/A'}</span>
          </p>
        </div>
      </div>
    );
  }

  // --- Active Quiz View (Card Display) ---
  const progressPercent = ((currentCardIndex + 1) / totalCards) * 100;
  const isLastCard = currentCardIndex === totalCards - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4">
      <div className="w-full max-w-xl bg-white p-6 md:p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-indigo-800 mb-4">
          Quiz Progress
        </h1>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-indigo-600 mb-1">
            <span>Card {currentCardIndex + 1} of {totalCards}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard Display */}
        <div className="bg-indigo-100 p-6 rounded-xl border-4 border-indigo-300 h-48 flex flex-col justify-center items-center shadow-inner mb-6 transition-all duration-300">
          <p className="text-xl md:text-2xl font-semibold text-indigo-900 text-center">
            {currentCard.front}
          </p>
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <label htmlFor="answerInput" className="block text-lg font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <input
            id="answerInput"
            type="text"
            value={userAnswers[currentCard.id] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-150"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-3">
          <button
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="flex items-center justify-center w-1/3 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl disabled:opacity-50 transition duration-150"
          >
            Previous
          </button>

          {!isLastCard ? (
            <button
              onClick={handleNext}
              disabled={currentCardIndex === totalCards - 1}
              className="flex items-center justify-center w-2/3 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition duration-150"
            >
              Next Card
            </button>
          ) : (
            <button
              onClick={scoreFlashcards}
              className="flex items-center justify-center w-2/3 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.01] transition duration-150"
            >
              Finish & See Score
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardQuizApp;