import { render, screen } from "@testing-library/react";
import MultiRowContent from "../MultiRowContent";
import type { ContentBlockData } from "@/types/contentBlock";

// Mock ContentBlock component
jest.mock("../../ui/ContentBlock", () => {
  return function MockContentBlock({
    title,
    description,
    category,
    imageSrc,
    imageAlt,
    index,
    reverse,
  }: {
    title: string;
    description: string;
    category: string;
    imageSrc: string;
    imageAlt: string;
    index: number;
    reverse?: boolean;
  }) {
    return (
      <div
        data-testid="content-block"
        data-index={index}
        data-reverse={reverse}
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <span>{category}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={imageAlt} />
      </div>
    );
  };
});

const mockContentBlocks: ContentBlockData[] = [
  {
    id: "hair-loss",
    title: "Hair loss needn't be irreversible. We can help!",
    description:
      "We're working around the clock to bring you a holistic approach to your wellness.",
    category: "Hair Loss",
    imageSrc: "/images/hairloss.png",
    imageAlt: "Hair Loss Treatment",
  },
  {
    id: "erectile-dysfunction",
    title: "Erectile dysfunction is a treatable condition",
    description:
      "Don't let ED affect your confidence. Our treatments are discreet and effective.",
    category: "Erectile Dysfunction",
    imageSrc: "/images/ed.png",
    imageAlt: "ED Treatment",
  },
  {
    id: "weight-management",
    title: "Achieve your ideal weight with personalized plans",
    description:
      "Our weight management programs are tailored to your lifestyle and goals.",
    category: "Weight Management",
    imageSrc: "/images/weight.png",
    imageAlt: "Weight Management",
  },
];

describe("MultiRowContent", () => {
  it("renders the title correctly", () => {
    render(
      <MultiRowContent
        title="What can we help with"
        contentBlocks={mockContentBlocks}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "What can we help with",
    );
  });

  it("renders all content blocks", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    const contentBlocks = screen.getAllByTestId("content-block");
    expect(contentBlocks).toHaveLength(3);
  });

  it("passes correct props to each ContentBlock", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    // Check all content blocks
    const contentBlocks = screen.getAllByTestId("content-block");
    expect(contentBlocks).toHaveLength(3);

    // Check first content block
    const firstBlock = contentBlocks[0];
    expect(firstBlock).toHaveAttribute("data-index", "0");
    expect(firstBlock).toHaveAttribute("data-reverse", "false");
    expect(
      screen.getByText("Hair loss needn't be irreversible. We can help!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Hair Loss")).toBeInTheDocument();

    // Check that alternating reverse logic works
    expect(contentBlocks[0]).toHaveAttribute("data-reverse", "false"); // even index
    expect(contentBlocks[1]).toHaveAttribute("data-reverse", "true"); // odd index
    expect(contentBlocks[2]).toHaveAttribute("data-reverse", "false"); // even index
  });

  it("applies correct CSS classes", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    const title = screen.getByRole("heading", { level: 1 });
    const container = title.closest("div");
    expect(container).toHaveClass("multi-row-content");
  });

  it("applies correct title CSS classes", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("multi-row-content__title");
  });

  it("renders empty state when no content blocks provided", () => {
    render(<MultiRowContent title="Test Title" contentBlocks={[]} />);

    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.queryByTestId("content-block")).not.toBeInTheDocument();
  });

  it("handles single content block correctly", () => {
    const singleBlock = [mockContentBlocks[0]];

    render(
      <MultiRowContent title="Single Block" contentBlocks={singleBlock} />,
    );

    const contentBlocks = screen.getAllByTestId("content-block");
    expect(contentBlocks).toHaveLength(1);
    expect(contentBlocks[0]).toHaveAttribute("data-reverse", "false");
  });

  it("passes correct index to each ContentBlock", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    const contentBlocks = screen.getAllByTestId("content-block");

    contentBlocks.forEach((block, index) => {
      expect(block).toHaveAttribute("data-index", index.toString());
    });
  });

  it("renders all required content for each block", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    mockContentBlocks.forEach((block) => {
      expect(screen.getByText(block.title)).toBeInTheDocument();
      expect(screen.getByText(block.description)).toBeInTheDocument();
      expect(screen.getByText(block.category)).toBeInTheDocument();
      expect(screen.getByAltText(block.imageAlt)).toBeInTheDocument();
    });
  });

  it("maintains correct structure with flex gap classes", () => {
    render(
      <MultiRowContent title="Test Title" contentBlocks={mockContentBlocks} />,
    );

    // Check that the content blocks container has the correct classes
    const blocksContainer =
      screen.getAllByTestId("content-block")[0].parentElement;
    expect(blocksContainer).toHaveClass(
      "flex",
      "flex-col",
      "gap-5",
      "lg:gap-11",
    );
  });
});
