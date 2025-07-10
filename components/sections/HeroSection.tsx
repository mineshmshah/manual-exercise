"use client";

import Logo from "@/components/ui/Logo";
import Button from "../ui/Button";
import Image from "next/image";
import type { HeroSectionData } from "@/types/heroSection";

export interface ActionMapType {
  [key: string]: () => void;
}

export default function HeroSection({
  title,
  description,
  button,
  backgroundImage = "/images/hero-bg.png",
  backgroundImageAlt = "Hero background",
  actionMap = {},
}: HeroSectionData & { actionMap?: ActionMapType }) {
  const handleButtonClick = () => {
    if (typeof button.action === "function") {
      button.action();
    } else if (typeof button.action === "string") {
      // Check if the action exists in the actionMap
      if (actionMap[button.action]) {
        actionMap[button.action]();
      } else {
        // Fallback to treating it as a URL
        window.location.href = button.action;
      }
    }
  };

  return (
    <section
      className="hero-section"
      style={
        {
          "--hero-bg-image": `url('${backgroundImage}')`,
        } as React.CSSProperties
      }
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-8 py-8 md:w-1/2 md:items-start md:px-16 xl:px-30">
        {/* Logo at top */}
        <div className="pb-2">
          <Logo size="small" />
        </div>

        <div className="flex-grow" />

        {/* Content */}
        <div className="flex flex-col justify-center py-8 md:items-start md:py-0">
          <h1 className="self-center pb-5 text-center text-5xl text-(--color-father) md:self-start md:text-left lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {title}
          </h1>
          <p className="text-md text-(--color-father) xl:text-lg">
            {description}
          </p>
          <Button size="small" className="mt-9" onClick={handleButtonClick}>
            {button.text}
          </Button>
        </div>
        <div className="flex-grow" />
      </div>

      {/* Image block for small screens only */}
      <div className="flex w-full justify-end md:hidden">
        <div className="relative min-h-[375px] w-full">
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt}
            fill
            className="object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
