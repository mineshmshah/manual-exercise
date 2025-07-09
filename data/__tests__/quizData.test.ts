import quizData from "@/data/quizData.json";
import { QuizData } from "@/types/quiz";

describe("Quiz Data", () => {
  it("should load quiz data", () => {
    const typedQuizData = quizData as QuizData;
    expect(typedQuizData.questions).toHaveLength(3);
  });
});
