import { fetchQuizData } from "@/lib/quizService";
import LandingPage from "@/components/pages/LandingPage";
import { QuizProvider } from "@/contexts/QuizContext";
import { QuizModal } from "@/components/quiz/QuizModal";

// Add error handling to prevent page rendering failure
export default async function Home() {
  // Fetch quiz data on the server with proper error handling
  let quizData;
  try {
    quizData = await fetchQuizData();
  } catch (error) {
    // If fetchQuizData fails despite its internal error handling,
    // we'll still render the page without quiz data.
    // The QuizProvider will use initialQuizState from quizReducer.
    console.error("Failed to fetch quiz data in page component:", error);
    quizData = undefined;
  }

  return (
    <QuizProvider initialQuizData={quizData}>
      <LandingPage />
      <QuizModal />
    </QuizProvider>
  );
}
