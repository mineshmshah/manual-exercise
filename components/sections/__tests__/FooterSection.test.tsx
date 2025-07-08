import { render, screen } from "@testing-library/react";
import FooterSection from "../FooterSection";

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
}));

// Mock components
jest.mock("../../ui/Logo", () => {
  return function MockLogo({ size }: { size?: string }) {
    return <div data-testid="footer-logo">Logo {size}</div>;
  };
});

jest.mock("../../ui/FooterLinkList", () => {
  return function MockFooterLinkList({
    title,
    links,
  }: {
    title: string;
    links: { name: string; href: string }[];
  }) {
    return (
      <div data-testid={`footer-links-${title.toLowerCase()}`}>
        <h3>{title}</h3>
        {links.map((link, index) => (
          <div key={index}>{link.name}</div>
        ))}
      </div>
    );
  };
});

describe("FooterSection", () => {
  it("renders footer logo", () => {
    render(<FooterSection />);
    expect(screen.getByTestId("footer-logo")).toBeInTheDocument();
  });

  it("renders all navigation sections", () => {
    render(<FooterSection />);

    expect(screen.getByTestId("footer-links-product")).toBeInTheDocument();
    expect(screen.getByTestId("footer-links-company")).toBeInTheDocument();
    expect(screen.getByTestId("footer-links-info")).toBeInTheDocument();
  });

  it("renders social media section", () => {
    render(<FooterSection />);
    expect(screen.getByText("Follow us")).toBeInTheDocument();
  });

  it("renders social media icons", () => {
    render(<FooterSection />);

    expect(screen.getByAltText("Facebook")).toBeInTheDocument();
    expect(screen.getByAltText("Twitter")).toBeInTheDocument();
    expect(screen.getByAltText("Google")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<FooterSection />);
    expect(
      screen.getByText(/© 2021 Manual. All rights reserved/),
    ).toBeInTheDocument();
  });

  it("has proper footer semantic structure", () => {
    render(<FooterSection />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("has responsive classes", () => {
    const { container } = render(<FooterSection />);
    const footer = container.querySelector("footer");

    expect(footer).toHaveClass(
      "w-full",
      "bg-(--color-grandfather-lightest)",
      "p-8",
      "lg:px-[138px]",
      "lg:py-16",
    );
  });
});
