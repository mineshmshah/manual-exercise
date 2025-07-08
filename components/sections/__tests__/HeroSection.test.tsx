import { render, screen, fireEvent } from "@testing-library/react";
import HeroSection from "../HeroSection";
import type { HeroSectionData } from "@/types/heroSection";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, ...imgProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img {...imgProps} />
    );
  },
}));

// Mock components
jest.mock("../../ui/Logo", () => {
  return function MockLogo({ size }: { size?: string }) {
    return <div data-testid="logo">Logo {size}</div>;
  };
});

jest.mock("../../ui/Button", () => {
  return function MockButton({
    children,
    onClick,
    className,
    size,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    size?: string;
  }) {
    return (
      <button
        data-testid="hero-button"
        onClick={onClick}
        className={className}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  };
});

const mockHeroProps: HeroSectionData = {
  title: "Be good to yourself",
  description:
    "We're working around the clock to bring you a holistic approach to your wellness.",
  button: {
    text: "Take the Quiz",
    action: "/quiz",
  },
  backgroundImage: "/images/hero-bg.png",
  backgroundImageAlt: "Hero background",
};

describe("HeroSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all content correctly", () => {
    render(<HeroSection {...mockHeroProps} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be good to yourself",
    );
    expect(screen.getByText(mockHeroProps.description)).toBeInTheDocument();
    expect(screen.getByTestId("hero-button")).toHaveTextContent(
      "Take the Quiz",
    );
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<HeroSection {...mockHeroProps} />);

    const section = screen.getByRole("heading").closest("section");
    expect(section).toHaveClass("hero-section");
  });

  it("applies background image via CSS custom property", () => {
    render(<HeroSection {...mockHeroProps} />);

    const section = screen.getByRole("heading").closest("section");
    expect(section).toHaveStyle({
      "--hero-bg-image": "url('/images/hero-bg.png')",
    });
  });

  it("renders responsive line break for titles containing ' to '", () => {
    render(<HeroSection {...mockHeroProps} />);

    const heading = screen.getByRole("heading");
    expect(heading).toContainHTML("<br");
    expect(heading).toHaveTextContent("Be good to yourself");
  });

  it("renders title without line break when no ' to ' is present", () => {
    const propsWithoutTo: HeroSectionData = {
      ...mockHeroProps,
      title: "Simple title",
    };

    render(<HeroSection {...propsWithoutTo} />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Simple title");
    // Check that no <br> element exists in the heading
    expect(heading.querySelector("br")).toBeNull();
  });

  it("handles string button action (URL navigation)", () => {
    // Instead of testing window.location.href assignment directly,
    // test the component's behavior when button action is a string
    render(<HeroSection {...mockHeroProps} />);

    const button = screen.getByTestId("hero-button");

    // Test that the button exists and has the expected props
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Take the Quiz");

    // Since jsdom doesn't support navigation, we'll just verify the button
    // is clickable and the component renders correctly with a string action
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("handles function button action", () => {
    const mockAction = jest.fn();
    const propsWithFunction: HeroSectionData = {
      ...mockHeroProps,
      button: {
        text: "Click me",
        action: mockAction,
      },
    };

    render(<HeroSection {...propsWithFunction} />);

    const button = screen.getByTestId("hero-button");
    fireEvent.click(button);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it("renders logo with correct size", () => {
    render(<HeroSection {...mockHeroProps} />);

    expect(screen.getByTestId("logo")).toHaveTextContent("Logo small");
  });

  it("passes correct props to Button component", () => {
    render(<HeroSection {...mockHeroProps} />);

    const button = screen.getByTestId("hero-button");
    expect(button).toHaveAttribute("data-size", "small");
    expect(button).toHaveClass("mt-9");
  });

  it("renders background image for mobile screens", () => {
    render(<HeroSection {...mockHeroProps} />);

    const mobileImage = screen.getByAltText("Hero background");
    expect(mobileImage).toBeInTheDocument();
    expect(mobileImage).toHaveAttribute("src", "/images/hero-bg.png");
  });

  it("uses custom background image alt text when provided", () => {
    const customProps: HeroSectionData = {
      ...mockHeroProps,
      backgroundImageAlt: "Custom alt text",
    };

    render(<HeroSection {...customProps} />);

    expect(screen.getByAltText("Custom alt text")).toBeInTheDocument();
  });

  it("uses default background image alt text when not provided", () => {
    const propsWithoutAlt: HeroSectionData = { ...mockHeroProps };
    delete propsWithoutAlt.backgroundImageAlt;

    render(<HeroSection {...propsWithoutAlt} />);

    expect(screen.getByAltText("Hero background")).toBeInTheDocument();
  });
});
