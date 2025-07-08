import ContentBlock from "../ui/ContentBlock";
import { ContentBlockData } from "@/types/contentBlock";

interface MultiRowContentProps {
  title: string;
  contentBlocks: ContentBlockData[];
}

export default function MultiRowContent({
  title,
  contentBlocks,
}: MultiRowContentProps) {
  return (
    <div className="multi-row-content">
      <h1 className="multi-row-content__title">{title}</h1>
      <div className="flex flex-col gap-5 lg:gap-11">
        {contentBlocks.map((block, index) => (
          <ContentBlock
            key={block.id}
            index={index}
            title={block.title}
            description={block.description}
            category={block.category}
            imageSrc={block.imageSrc}
            imageAlt={block.imageAlt}
            reverse={index % 2 === 1} // Alternate layout: even indexes normal, odd indexes reversed
          />
        ))}
      </div>
    </div>
  );
}
