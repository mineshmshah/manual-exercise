import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { QuizProvider } from "@/contexts/QuizContext";
import type { HeroSectionData } from "@/types/heroSection";
import type { ContentBlockData } from "@/types/contentBlock";

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

// Helper function to render Home with QuizProvider
function renderHomeWithProvider() {
  return render(
    <QuizProvider>
      <Home />
    </QuizProvider>,
  );
}

describe("Home Page Integration", () => {
  it("renders the main page structure", () => {
    renderHomeWithProvider();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
    expect(screen.getByTestId("footer-section")).toBeInTheDocument();
  });

  it("passes correct data to HeroSection component", () => {
    renderHomeWithProvider();

    const heroSection = screen.getByTestId("hero-section");
    expect(heroSection).toBeInTheDocument();

    // Check if hero content is rendered (data from heroSection.json)
    expect(screen.getByText("Be good to yourself")).toBeInTheDocument();
    expect(screen.getByText(/working around the clock/i)).toBeInTheDocument();
    expect(screen.getByText("Take the Quiz")).toBeInTheDocument();
  });

  it("passes correct data to MultiRowContent component", () => {
    renderHomeWithProvider();

    const multiRowSection = screen.getByTestId("multi-row-content");
    expect(multiRowSection).toBeInTheDocument();

    // Check if the title is passed correctly
    expect(screen.getByText("What can we help with")).toBeInTheDocument();

    // Check if content blocks are rendered (data from contentBlocks.json)
    const contentBlocks = screen.getAllByTestId("content-block");
    expect(contentBlocks.length).toBeGreaterThan(0);
  });

  it("imports and uses JSON data correctly", () => {
    renderHomeWithProvider();

    // This test verifies that the JSON data is being imported and used
    // If the components render with the expected content, the imports are working
    expect(screen.getByText("Be good to yourself")).toBeInTheDocument();
    expect(screen.getByText("What can we help with")).toBeInTheDocument();
  });

  it("applies type assertions correctly", () => {
    // This test ensures that the type assertions in the component work
    // If the page renders without TypeScript errors, the assertions are correct
    renderHomeWithProvider();

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("multi-row-content")).toBeInTheDocument();
  });

  it("renders components in correct order", () => {
    renderHomeWithProvider();

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
    expect(() => renderHomeWithProvider()).not.toThrow();
  });
});
