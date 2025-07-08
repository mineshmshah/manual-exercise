import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ContentBlockProps } from "@/types/contentBlock";

export default function ContentBlock({
  title,
  description,
  category,
  imageSrc,
  imageAlt,
  index,
  reverse = false,
}: ContentBlockProps) {
  return (
    <div className={cn("content-block", reverse && "content-block--reverse")}>
      <div className="content-block__image">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="object-cover object-center"
          fill
        />
      </div>
      <div
        className={`content-block__text ${reverse ? "content-block__text--reverse" : "content-block__text--normal"}`}
      >
        {" "}
        {/* Number div - behind text */}
        <div
          className={`content-block__number ${reverse ? "content-block__number--reverse" : "content-block__number--normal"}`}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className="relative z-10">
          <p className="mb-2.5 text-[10px] font-bold tracking-wide text-(--color-grandfather-dark) uppercase">
            {category}
          </p>
          <h2 className="mb-5.5 text-[28px] font-normal -tracking-[0.03em] text-(--color-father)">
            {title}
          </h2>
          <p className="mb-4 text-base text-[18px] text-(--color-father)">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
