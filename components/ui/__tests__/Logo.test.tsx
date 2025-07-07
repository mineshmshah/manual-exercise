import { render, screen } from "@testing-library/react";
import Logo from "../Logo";

describe("Logo", () => {
  it("renders logo image with correct alt text", () => {
    render(<Logo />);
    const logo = screen.getByRole("img", { name: "Manual Logo" });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo/Symbol.svg");
  });

  it("applies correct size classes and dimensions", () => {
    const { rerender } = render(<Logo size="small" />);
    let logo = screen.getByRole("img");
    expect(logo).toHaveClass("h-10", "w-10");
    expect(logo).toHaveAttribute("width", "40");
    expect(logo).toHaveAttribute("height", "40");

    rerender(<Logo size="medium" />);
    logo = screen.getByRole("img");
    expect(logo).toHaveClass("h-18", "w-18");
    expect(logo).toHaveAttribute("width", "75");
    expect(logo).toHaveAttribute("height", "75");

    rerender(<Logo size="large" />);
    logo = screen.getByRole("img");
    expect(logo).toHaveClass("h-24", "w-24");
    expect(logo).toHaveAttribute("width", "96");
    expect(logo).toHaveAttribute("height", "96");
  });

  it("applies custom className", () => {
    render(<Logo className="custom-logo-class" />);
    expect(screen.getByRole("img")).toHaveClass("custom-logo-class");
  });

  it("uses medium size by default", () => {
    render(<Logo />);
    const logo = screen.getByRole("img");
    expect(logo).toHaveClass("h-18", "w-18");
    expect(logo).toHaveAttribute("width", "75");
    expect(logo).toHaveAttribute("height", "75");
  });
});
