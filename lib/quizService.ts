import { QuizData } from "@/types/quiz";
import fallbackQuizData from "@/data/quizData.json";

const API_URL =
  "https://manual-case-study.herokuapp.com/questionnaires/972423.json";

export async function fetchQuizData(): Promise<QuizData> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as QuizData;
    return data;
  } catch (error: unknown) {
    console.error("Failed to fetch quiz data:", error);
    return fallbackQuizData as QuizData; // Return fallback data instead of throwing
  }
}
