import { render, screen } from "@testing-library/react";
import HeroSection from "../HeroSection";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
  getImageProps: jest.fn(() => ({
    props: {
      srcSet: "/images/hero-bg.png 1x, /images/hero-bg.png 2x",
    },
  })),
}));

// Mock components
jest.mock("../../ui/Logo", () => {
  return function MockLogo({
    size,
    className,
  }: {
    size?: string;
    className?: string;
  }) {
    return (
      <div data-testid="logo" className={className}>
        Logo {size}
      </div>
    );
  };
});

jest.mock("../../ui/Button", () => {
  return function MockButton({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  };
});

describe("HeroSection", () => {
  it("renders main heading", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Be good/)).toBeInTheDocument();
    expect(screen.getByText(/to yourself/)).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<HeroSection />);
    const description = screen.getByText(/working around the clock/i);
    expect(description).toBeInTheDocument();
  });

  it("renders logo component", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders CTA button", () => {
    render(<HeroSection />);
    expect(
      screen.getByRole("button", { name: "TAKE THE QUIZ" }),
    ).toBeInTheDocument();
  });

  it("has correct responsive classes", () => {
    render(<HeroSection />);
    const section = document.querySelector("section");
    expect(section).toHaveClass("w-full", "md:max-h-[750px]");
  });

  it("shows mobile image on small screens", () => {
    render(<HeroSection />);
    const mobileImage = screen.getByAltText("Hero background");
    expect(mobileImage).toHaveClass("h-auto", "min-h-[300px]");
    // Check that the parent div has md:hidden class
    const imageContainer = mobileImage.closest("div");
    expect(imageContainer).toHaveClass("md:hidden");
  });
});
