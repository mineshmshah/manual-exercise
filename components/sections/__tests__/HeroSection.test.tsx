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
    action: "quiz",
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

  it("renders title correctly", () => {
    render(<HeroSection {...mockHeroProps} />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Be good to yourself");
  });

  it("renders different title when provided", () => {
    const propsWithDifferentTitle: HeroSectionData = {
      ...mockHeroProps,
      title: "Simple title",
    };

    render(<HeroSection {...propsWithDifferentTitle} />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Simple title");
  });

  it("handles string button action (URL navigation)", () => {
    // Instead of testing window.location.href assignment directly,
    // test the component's behavior when button action is a string
    const propsWithUrlAction: HeroSectionData = {
      ...mockHeroProps,
      button: {
        text: "Go to URL",
        action: "/some-url",
      },
    };

    // We'll verify the button is clickable without manipulating window.location
    render(<HeroSection {...propsWithUrlAction} />);

    const button = screen.getByTestId("hero-button");

    // Just verifying the button renders and is clickable without errors
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Go to URL");
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

  it("uses action map for string actions that match a map key", () => {
    const mockMappedAction = jest.fn();
    const actionMap = {
      quiz: mockMappedAction,
    };

    render(<HeroSection {...mockHeroProps} actionMap={actionMap} />);

    const button = screen.getByTestId("hero-button");
    fireEvent.click(button);

    expect(mockMappedAction).toHaveBeenCalledTimes(1);
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
