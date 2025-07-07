import { render, screen } from "@testing-library/react";
import FooterLinkList from "../FooterLinkList";

describe("FooterLinkList", () => {
  const mockLinks = [
    { name: "Link 1", href: "/link1" },
    { name: "Link 2", href: "/link2" },
    { name: "Link 3", href: "/link3" },
  ];

  it("renders title correctly", () => {
    render(<FooterLinkList title="Test Title" links={mockLinks} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders all links with correct text", () => {
    render(<FooterLinkList title="Test Title" links={mockLinks} />);

    mockLinks.forEach((link) => {
      expect(screen.getByText(link.name)).toBeInTheDocument();
    });
  });

  it("renders all links with correct href attributes", () => {
    render(<FooterLinkList title="Test Title" links={mockLinks} />);

    mockLinks.forEach((link) => {
      const linkElement = screen.getByRole("link", { name: link.name });
      expect(linkElement).toHaveAttribute("href", link.href);
    });
  });

  it("applies custom className", () => {
    const { container } = render(
      <FooterLinkList
        title="Test Title"
        links={mockLinks}
        className="custom-class"
      />,
    );

    const linkListElement = container.querySelector(".custom-class");
    expect(linkListElement).toBeInTheDocument();
  });

  it("renders correct number of links", () => {
    render(<FooterLinkList title="Test Title" links={mockLinks} />);

    const linkElements = screen.getAllByRole("link");
    expect(linkElements).toHaveLength(mockLinks.length);
  });

  it("has proper semantic structure", () => {
    render(<FooterLinkList title="Product" links={mockLinks} />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toBeInTheDocument();

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });

  it("has proper text styling for title", () => {
    render(<FooterLinkList title="Product" links={mockLinks} />);

    const titleElement = screen.getByText("Product");
    expect(titleElement).toHaveClass(
      "text-[10px]",
      "font-bold",
      "uppercase",
      "tracking-wider",
    );
  });

  it("has proper text styling for links", () => {
    render(
      <FooterLinkList
        title="Test Title"
        links={[{ name: "Test Link", href: "/test" }]}
      />,
    );

    const linkElement = screen.getByText("Test Link");
    expect(linkElement).toHaveClass(
      "text-base",
      "font-normal",
      "leading-loose",
    );
  });
});
