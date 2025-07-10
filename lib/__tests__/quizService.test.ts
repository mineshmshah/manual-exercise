import { fetchQuizData } from "@/lib/quizService";
import { QuizData } from "@/types/quiz";
import fallbackQuizData from "@/data/quizData.json";

// Mock the global fetch function
global.fetch = jest.fn();

describe("quizService", () => {
  // Reset the mocks after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should successfully fetch quiz data from API", async () => {
    // Mock successful API response
    const mockQuizData: QuizData = {
      questions: [
        {
          question: "Test Question",
          type: "ChoiceType",
          options: [
            {
              display: "Test Option",
              value: "test",
              isRejection: false,
            },
          ],
        },
      ],
    };

    // Setup the mock fetch to return the mock data
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockQuizData),
    });

    // Call the function
    const result = await fetchQuizData();

    // Assertions
    expect(global.fetch).toHaveBeenCalledWith(
      "https://manual-case-study.herokuapp.com/questionnaires/972423.json",
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
    expect(result).toEqual(mockQuizData);
  });

  it("should return fallback data when API request fails", async () => {
    // Mock failed API response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    // Call the function
    const result = await fetchQuizData();

    // Assertions
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual(fallbackQuizData);
  });

  it("should return fallback data when fetch throws an error", async () => {
    // Mock a network error
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    // Call the function
    const result = await fetchQuizData();

    // Assertions
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual(fallbackQuizData);
  });
});
