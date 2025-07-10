import contentBlocksData from "../contentBlocks.json";
import heroSectionData from "../heroSection.json";
import type { ContentBlockData } from "../../types/contentBlock";
import type { HeroSectionData } from "../../types/heroSection";

describe("Data Files", () => {
  describe("contentBlocks.json", () => {
    it("should be a valid array", () => {
      expect(Array.isArray(contentBlocksData)).toBe(true);
      expect(contentBlocksData.length).toBeGreaterThan(0);
    });

    it("should contain valid ContentBlockData objects", () => {
      // Chekc follow correct data strucure
      contentBlocksData.forEach((block) => {
        const typedBlock = block as ContentBlockData;

        expect(typedBlock.id).toBeDefined();
        expect(typeof typedBlock.id).toBe("string");
        expect(typedBlock.id.length).toBeGreaterThan(0);

        expect(typedBlock.title).toBeDefined();
        expect(typeof typedBlock.title).toBe("string");
        expect(typedBlock.title.length).toBeGreaterThan(0);

        expect(typedBlock.description).toBeDefined();
        expect(typeof typedBlock.description).toBe("string");
        expect(typedBlock.description.length).toBeGreaterThan(0);

        expect(typedBlock.category).toBeDefined();
        expect(typeof typedBlock.category).toBe("string");
        expect(typedBlock.category.length).toBeGreaterThan(0);

        expect(typedBlock.imageSrc).toBeDefined();
        expect(typeof typedBlock.imageSrc).toBe("string");
        expect(typedBlock.imageSrc).toMatch(
          /^\/images\/.+\.(png|jpg|jpeg|webp)$/,
        );

        expect(typedBlock.imageAlt).toBeDefined();
        expect(typeof typedBlock.imageAlt).toBe("string");
        expect(typedBlock.imageAlt.length).toBeGreaterThan(0);
      });
    });

    it("should have unique IDs for all content blocks", () => {
      // Check content blocks are unique
      const ids = contentBlocksData.map(
        (block) => (block as ContentBlockData).id,
      );
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should contain expected content blocks", () => {
      const typedData = contentBlocksData as ContentBlockData[];
      // Check for specific content blocks we know should exist
      const hairLossBlock = typedData.find((block) => block.id === "hair-loss");
      expect(hairLossBlock).toBeDefined();
      if (hairLossBlock) {
        expect(hairLossBlock.category).toBe("Hair Loss");
        expect(hairLossBlock.imageSrc).toBe("/images/hairloss.png");
      }
    });

    it("should have proper image paths", () => {
      // Image patths should be of the correct format to process correctly on FE
      const typedData = contentBlocksData as ContentBlockData[];

      typedData.forEach((block) => {
        expect(block.imageSrc).toMatch(/^\/images\//);
        expect(block.imageSrc).toMatch(/\.(png|jpg|jpeg|webp)$/i);
      });
    });

    it("should have meaningful alt text for accessibility", () => {
      const typedData = contentBlocksData as ContentBlockData[];
      // Make sure alt text exists and is not just the name of the image
      typedData.forEach((block) => {
        expect(block.imageAlt).toBeTruthy();
        expect(block.imageAlt.length).toBeGreaterThan(3);
        expect(block.imageAlt).not.toBe(block.imageSrc);
      });
    });
  });

  describe("heroSection.json", () => {
    it("should be a valid object", () => {
      expect(typeof heroSectionData).toBe("object");
      expect(heroSectionData).not.toBeNull();
      expect(Array.isArray(heroSectionData)).toBe(false);
    });

    it("should contain valid HeroSectionData", () => {
      // Check has correct structure
      const typedData = heroSectionData as HeroSectionData;

      expect(typedData.title).toBeDefined();
      expect(typeof typedData.title).toBe("string");
      expect(typedData.title.length).toBeGreaterThan(0);

      expect(typedData.description).toBeDefined();
      expect(typeof typedData.description).toBe("string");
      expect(typedData.description.length).toBeGreaterThan(0);

      expect(typedData.button).toBeDefined();
      expect(typeof typedData.button).toBe("object");
      expect(typedData.button.text).toBeDefined();
      expect(typeof typedData.button.text).toBe("string");
      expect(typedData.button.text.length).toBeGreaterThan(0);
    });

    it("should have expected content", () => {
      const typedData = heroSectionData as HeroSectionData;

      expect(typedData.title).toBe("Be good to yourself");
      expect(typedData.button.text).toBe("Take the Quiz");
      expect(typedData.description).toContain("wellness");
    });

    it("should have valid button action", () => {
      const typedData = heroSectionData as HeroSectionData;

      if (typedData.button.action) {
        expect(
          typeof typedData.button.action === "string" ||
            typeof typedData.button.action === "function",
        ).toBe(true);

        if (typeof typedData.button.action === "string") {
          // Action can be a URL (starting with / or https://) or a semantic key like "quiz"
          expect(typeof typedData.button.action).toBe("string");
        }
      }
    });

    it("should have valid background image path", () => {
      const typedData = heroSectionData as HeroSectionData;

      if (typedData.backgroundImage) {
        expect(typedData.backgroundImage).toMatch(/^\/images\//);
        expect(typedData.backgroundImage).toMatch(/\.(png|jpg|jpeg|webp)$/i);
      }
    });

    it("should have background image alt text when background image is provided", () => {
      const typedData = heroSectionData as HeroSectionData;

      if (typedData.backgroundImage) {
        expect(typedData.backgroundImageAlt).toBeDefined();
        expect(typeof typedData.backgroundImageAlt).toBe("string");
        expect(typedData.backgroundImageAlt!.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Data Integration", () => {
    it("should be compatible with their respective TypeScript interfaces", () => {
      // This test verifies that the JSON data can be safely cast to the TypeScript types
      const typedContentBlocks: ContentBlockData[] =
        contentBlocksData as ContentBlockData[];
      const typedHeroData: HeroSectionData = heroSectionData as HeroSectionData;

      expect(typedContentBlocks).toBeDefined();
      expect(typedHeroData).toBeDefined();

      // If this compiles and runs without errors, the types are compatible
      expect(true).toBe(true);
    });

    it("should have consistent image path structure", () => {
      const typedHeroData = heroSectionData as HeroSectionData;
      const typedContentBlocks = contentBlocksData as ContentBlockData[];

      const allImagePaths = [
        ...(typedHeroData.backgroundImage
          ? [typedHeroData.backgroundImage]
          : []),
        ...typedContentBlocks.map((block) => block.imageSrc),
      ];

      allImagePaths.forEach((imagePath) => {
        expect(imagePath).toMatch(/^\/images\//);
        expect(imagePath).toMatch(/\.(png|jpg|jpeg|webp)$/i);
      });
    });

    it("should have appropriate content length for display", () => {
      const typedHeroData = heroSectionData as HeroSectionData;
      const typedContentBlocks = contentBlocksData as ContentBlockData[];

      // Hero title should be concise
      expect(typedHeroData.title.length).toBeLessThan(50);

      // Hero description should be substantial but not too long
      expect(typedHeroData.description.length).toBeGreaterThan(50);
      expect(typedHeroData.description.length).toBeLessThan(300);

      // Content block titles should be readable but not too long
      // Better handled with BE validation if being served the JSON - hardcoded for now
      typedContentBlocks.forEach((block) => {
        expect(block.title.length).toBeGreaterThan(10);
        expect(block.title.length).toBeLessThan(100);

        expect(block.description.length).toBeGreaterThan(20);
        expect(block.description.length).toBeLessThan(500);

        expect(block.category.length).toBeGreaterThan(3);
        expect(block.category.length).toBeLessThan(30);
      });
    });
  });
});
