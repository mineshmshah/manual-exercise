import { render, screen } from "@testing-library/react";
import type { HeroSectionData } from "@/types/heroSection";
import type { ContentBlockData } from "@/types/contentBlock";
import LandingPage from "@/components/pages/LandingPage";

// Mock the components to focus on integration testing
jest.mock("@/components/sections/HeroSection", () => {
  return function MockHeroSection(props: HeroSectionData) {
    return (
      <section data-testid="hero-section">
        <h1>{props.title}</h1>
        <p>{props.description}</p>
        <button>{props.button.text}</button>
      </section>
    );
  };
});

jest.mock("@/components/sections/MultiRowContent", () => {
  return function MockMultiRowContent({
    title,
    contentBlocks,
  }: {
    title: string;
    contentBlocks: ContentBlockData[];
  }) {
    return (
      <section data-testid="multi-row-content">
        <h1>{title}</h1>
        {contentBlocks.map((block: ContentBlockData) => (
          <div key={block.id} data-testid="content-block">
            <h2>{block.title}</h2>
            <p>{block.category}</p>
          </div>
        ))}
      </section>
    );
  };
});

jest.mock("@/components/sections/FooterSection", () => {
  return function MockFooterSection() {
    return <footer data-testid="footer-section">Footer</footer>;
  };
});

// Mock the quiz context hook
jest.mock("@/contexts/QuizContext", () => {
  return {
    useQuiz: () => ({
      openQuiz: jest.fn(),
      state: { isOpen: false },
    }),
    QuizProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="quiz-provider">{children}</div>
    ),
  };
});

// Mock the quiz context for testing
jest.mock("@/data/contentBlocks.json", () => [
  { id: "1", title: "Hair Loss", category: "Hair" },
  { id: "2", title: "Skin Care", category: "Skin" },
]);

jest.mock("@/data/heroSection.json", () => ({
  title: "Be good to yourself",
  description:
    "We're working around the clock to bring you a holistic approach to your wellness.",
  button: {
    text: "Take the Quiz",
    action: "openQuiz",
  },
}));

describe("Page Integration", () => {
  it("renders the main page structure", () => {
    render(<LandingPage />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
    expect(screen.getByTestId("footer-section")).toBeInTheDocument();
  });

  it("passes correct data to HeroSection component", () => {
    render(<LandingPage />);

    const heroSection = screen.getByTestId("hero-section");
    expect(heroSection).toBeInTheDocument();

    // Check if hero content is rendered (data from heroSection.json)
    expect(screen.getByText("Be good to yourself")).toBeInTheDocument();
    expect(screen.getByText(/working around the clock/i)).toBeInTheDocument();
    expect(screen.getByText("Take the Quiz")).toBeInTheDocument();
  });

  it("passes correct data to MultiRowContent component", () => {
    render(<LandingPage />);

    const multiRowSection = screen.getByTestId("multi-row-content");
    expect(multiRowSection).toBeInTheDocument();

    // Check if the title is passed correctly
    expect(screen.getByText("What can we help with")).toBeInTheDocument();

    // Check if content blocks are rendered (data from contentBlocks.json)
    const contentBlocks = screen.getAllByTestId("content-block");
    expect(contentBlocks.length).toBeGreaterThan(0);
  });

  it("imports and uses JSON data correctly", () => {
    render(<LandingPage />);

    // This test verifies that the JSON data is being imported and used
    // If the components render with the expected content, the imports are working
    expect(screen.getByText("Be good to yourself")).toBeInTheDocument();
    expect(screen.getByText("What can we help with")).toBeInTheDocument();
  });

  it("applies type assertions correctly", () => {
    // This test ensures that the type assertions in the component work
    // If the page renders without TypeScript errors, the assertions are correct
    render(<LandingPage />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
  });

  it("renders components in correct order", () => {
    render(<LandingPage />);

    const main = screen.getByRole("main");
    const heroSection = screen.getByTestId("hero-section");
    const multiRowSection = screen.getByTestId("multi-row-content");
    const footerSection = screen.getByTestId("footer-section");

    // Hero should be inside main
    expect(main).toContainElement(heroSection);
    expect(main).toContainElement(multiRowSection);

    // Footer should be outside main
    expect(main).not.toContainElement(footerSection);

    // Check DOM order
    const heroIndex = Array.from(document.body.querySelectorAll("*")).indexOf(
      heroSection,
    );
    const multiRowIndex = Array.from(
      document.body.querySelectorAll("*"),
    ).indexOf(multiRowSection);
    const footerIndex = Array.from(document.body.querySelectorAll("*")).indexOf(
      footerSection,
    );

    expect(heroIndex).toBeLessThan(multiRowIndex);
    expect(multiRowIndex).toBeLessThan(footerIndex);
  });

  it("handles data imports without errors", () => {
    // Test that the page can render without import errors
    expect(() => render(<LandingPage />)).not.toThrow();
  });
});
