import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the main content", () => {
    render(<Home />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });

  it("renders the Manual logos", () => {
    render(<Home />);

    const logos = screen.getAllByAltText("Manual Logo");

    expect(logos).toHaveLength(2); // One in hero, one in footer
    expect(logos[0]).toBeInTheDocument();
    expect(logos[1]).toBeInTheDocument();
  });

  it("renders the hero heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /be good to yourself/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the hero description", () => {
    render(<Home />);

    const description = screen.getByText(/working around the clock/i);

    expect(description).toBeInTheDocument();
  });

  it("renders the CTA button", () => {
    render(<Home />);

    const ctaButton = screen.getByRole("button", { name: /take the quiz/i });

    expect(ctaButton).toBeInTheDocument();
  });

  it("renders the hero background image", () => {
    render(<Home />);

    const heroImage = screen.getByAltText("Hero background");

    expect(heroImage).toBeInTheDocument();
  });
});
