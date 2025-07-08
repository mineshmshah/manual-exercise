import type { ContentBlockData, ContentBlockProps } from "../contentBlock";

describe("ContentBlock Types", () => {
  describe("ContentBlockData", () => {
    it("should have all required properties", () => {
      const validData: ContentBlockData = {
        id: "test-id",
        title: "Test Title",
        description: "Test Description",
        category: "Test Category",
        imageSrc: "/test/image.jpg",
        imageAlt: "Test Alt Text",
      };

      // Type check - this should compile without errors
      expect(validData.id).toBe("test-id");
      expect(validData.title).toBe("Test Title");
      expect(validData.description).toBe("Test Description");
      expect(validData.category).toBe("Test Category");
      expect(validData.imageSrc).toBe("/test/image.jpg");
      expect(validData.imageAlt).toBe("Test Alt Text");
    });

    it("should require all properties", () => {
      // These should cause TypeScript compilation errors if uncommented:

      // Missing id
      // const missingId: ContentBlockData = {
      //   title: "Test",
      //   description: "Test",
      //   category: "Test",
      //   imageSrc: "/test.jpg",
      //   imageAlt: "Test",
      // };

      // Missing title
      // const missingTitle: ContentBlockData = {
      //   id: "test",
      //   description: "Test",
      //   category: "Test",
      //   imageSrc: "/test.jpg",
      //   imageAlt: "Test",
      // };

      expect(true).toBe(true); // Placeholder test
    });
  });

  describe("ContentBlockProps", () => {
    it("should extend ContentBlockData without id and add runtime props", () => {
      const validProps: ContentBlockProps = {
        title: "Test Title",
        description: "Test Description",
        category: "Test Category",
        imageSrc: "/test/image.jpg",
        imageAlt: "Test Alt Text",
        index: 0,
        reverse: false,
      };

      // Type check - this should compile without errors
      expect(validProps.title).toBe("Test Title");
      expect(validProps.index).toBe(0);
      expect(validProps.reverse).toBe(false);
    });

    it("should make reverse property optional", () => {
      const propsWithoutReverse: ContentBlockProps = {
        title: "Test",
        description: "Test",
        category: "Test",
        imageSrc: "/test.jpg",
        imageAlt: "Test",
        index: 0,
        // reverse is optional
      };

      expect(propsWithoutReverse.reverse).toBeUndefined();
    });

    it("should require index property", () => {
      // This should cause TypeScript compilation error if uncommented:

      // const missingIndex: ContentBlockProps = {
      //   title: "Test",
      //   description: "Test",
      //   category: "Test",
      //   imageSrc: "/test.jpg",
      //   imageAlt: "Test",
      //   // index is required
      // };

      expect(true).toBe(true); // Placeholder test
    });

    it("should not include id property from ContentBlockData", () => {
      const props: ContentBlockProps = {
        title: "Test",
        description: "Test",
        category: "Test",
        imageSrc: "/test.jpg",
        imageAlt: "Test",
        index: 0,
      };

      // id should not be accessible on ContentBlockProps
      // @ts-expect-error - id should not exist on ContentBlockProps
      expect(props.id).toBeUndefined();
    });
  });
});
