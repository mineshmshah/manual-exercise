import { render, screen } from "@testing-library/react";
import ContentBlock from "../ContentBlock";
import type { ContentBlockProps } from "../../../types/contentBlock";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fill, ...imgProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...imgProps} data-testid="content-image" alt={props.alt} />
    );
  },
}));

const mockProps: ContentBlockProps = {
  title: "Test Title",
  description: "Test Description",
  category: "Test Category",
  imageSrc: "/test.jpg",
  imageAlt: "Test Alt",
  index: 0,
  reverse: false,
};

describe("ContentBlock", () => {
  it("renders basic content", () => {
    render(<ContentBlock {...mockProps} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Title",
    );
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
    expect(screen.getByTestId("content-image")).toBeInTheDocument();
  });

  it("displays correct index with leading zero", () => {
    render(<ContentBlock {...mockProps} index={0} />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("applies reverse class when reverse is true", () => {
    render(<ContentBlock {...mockProps} reverse={true} />);
    const container = screen.getByRole("heading").closest(".content-block");
    expect(container).toHaveClass("content-block--reverse");
  });

  it("applies normal layout when reverse is false", () => {
    render(<ContentBlock {...mockProps} reverse={false} />);
    const container = screen.getByRole("heading").closest(".content-block");
    expect(container).toHaveClass("content-block");
    expect(container).not.toHaveClass("content-block--reverse");
  });
});
