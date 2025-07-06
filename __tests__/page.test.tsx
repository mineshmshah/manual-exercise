import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the main content", () => {
    render(<Home />);

    const main = screen.getByRole("main");

    expect(main).toBeInTheDocument();
  });

  it("renders the Next.js logo", () => {
    render(<Home />);

    const logo = screen.getByAltText("Next.js logo");

    expect(logo).toBeInTheDocument();
  });

  it("renders the getting started text", () => {
    render(<Home />);

    const gettingStartedText = screen.getByText(/get started by editing/i);

    expect(gettingStartedText).toBeInTheDocument();
  });

  it("renders the deploy link", () => {
    render(<Home />);

    const deployLink = screen.getByRole("link", { name: /deploy now/i });

    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com"),
    );
  });

  it("renders the docs link", () => {
    render(<Home />);

    const docsLink = screen.getByRole("link", { name: /read our docs/i });

    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs"),
    );
  });
});
