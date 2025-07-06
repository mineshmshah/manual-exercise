import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    const result = cn("bg-blue-500", "text-white", "hover:bg-blue-600");
    expect(result).toContain("bg-blue-500");
    expect(result).toContain("text-white");
    expect(result).toContain("hover:bg-blue-600");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", {
      "active-class": isActive,
      "inactive-class": !isActive,
    });
    expect(result).toContain("base-class");
    expect(result).toContain("active-class");
    expect(result).not.toContain("inactive-class");
  });

  it("removes conflicting tailwind classes", () => {
    const result = cn("bg-red-500", "bg-blue-500");
    // Should only have one bg color class
    expect(result).toContain("bg-blue-500");
    expect(result).not.toContain("bg-red-500");
  });
});
