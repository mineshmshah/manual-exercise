import { render, fireEvent } from "@testing-library/react";
import { QuizOption } from "../QuizOption";

describe("QuizOption", () => {
  const baseOption = {
    display: "Test Option",
    value: "test",
    isRejection: false,
  };

  it("renders text option correctly", () => {
    const { getByText } = render(
      <QuizOption
        option={baseOption}
        onSelect={jest.fn()}
        isSelected={false}
      />,
    );
    expect(getByText("Test Option")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = jest.fn();
    const { getByRole } = render(
      <QuizOption option={baseOption} onSelect={onSelect} isSelected={false} />,
    );
    fireEvent.click(getByRole("radio"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("applies selected styling when isSelected is true", () => {
    const { getByRole } = render(
      <QuizOption option={baseOption} onSelect={jest.fn()} isSelected={true} />,
    );
    expect(getByRole("radio")).toHaveClass("border-blue-500");
  });

  it("renders image option correctly", () => {
    const imageOption = {
      display: '<img src="/test.png" alt="Test Image" />',
      value: "img",
      isRejection: false,
    };
    const { getByAltText } = render(
      <QuizOption
        option={imageOption}
        onSelect={jest.fn()}
        isSelected={false}
      />,
    );
    expect(getByAltText("Test Image")).toBeInTheDocument();
  });
});
