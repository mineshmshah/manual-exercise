"use client";

import Image from "next/image";
import { QuizOptionType as QuizOptionType } from "@/types/quiz";

interface QuizOptionProps {
  option: QuizOptionType;
  onSelect: () => void;
  isSelected?: boolean;
  index?: number;
  total?: number;
}

export function QuizOption({
  option,
  onSelect,
  isSelected = false,
  index,
  total,
}: QuizOptionProps) {
  // Function to parse image from HTML string
  // This avoids using dangerouslySetInnerHTML directly
  // It also allows use of Next JS Image component
  const parseImageFromHTML = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const img = doc.querySelector("img");

    if (!img) return null;

    return {
      src: img.src,
      alt: img.alt || "",
    };
  };

  const renderContent = () => {
    if (option.display.includes("<img")) {
      const imageData = parseImageFromHTML(option.display);

      if (imageData) {
        return (
          <div className="flex flex-col items-center justify-center">
            <Image
              src={imageData.src}
              alt={imageData.alt}
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-full max-w-xs"
            />
            <p className="p-2 font-bold text-(--color-father) capitalize">
              {imageData.alt}
            </p>
          </div>
        );
      }
      return null;
    }

    return <span>{option.display}</span>;
  };

  return (
    <button
      onClick={onSelect}
      role="radio"
      aria-checked={isSelected}
      data-position={index !== undefined ? index + 1 : undefined}
      data-total={total}
      className={`mb-4 w-full rounded-lg border p-4 text-left transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {renderContent()}
    </button>
  );
}
