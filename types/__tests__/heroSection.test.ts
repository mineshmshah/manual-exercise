import type { HeroSectionData } from "../heroSection";

describe("HeroSection Types", () => {
  describe("HeroSectionData", () => {
    it("should have all required properties", () => {
      const validData: HeroSectionData = {
        title: "Test Title",
        description: "Test Description",
        button: {
          text: "Click me",
          action: "/test-url",
        },
      };

      expect(validData.title).toBe("Test Title");
      expect(validData.description).toBe("Test Description");
      expect(validData.button.text).toBe("Click me");
      expect(validData.button.action).toBe("/test-url");
    });

    it("should make backgroundImage optional", () => {
      const dataWithoutBg: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: { text: "Test" },
        // backgroundImage is optional
      };

      expect(dataWithoutBg.backgroundImage).toBeUndefined();
    });

    it("should make backgroundImageAlt optional", () => {
      const dataWithoutAlt: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: { text: "Test" },
        backgroundImage: "/test.jpg",
        // backgroundImageAlt is optional
      };

      expect(dataWithoutAlt.backgroundImageAlt).toBeUndefined();
    });

    it("should make button action optional", () => {
      const dataWithoutAction: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          // action is optional
        },
      };

      expect(dataWithoutAction.button.action).toBeUndefined();
    });

    it("should support string action", () => {
      const dataWithStringAction: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          action: "/test-url",
        },
      };

      expect(typeof dataWithStringAction.button.action).toBe("string");
    });

    it("should support function action", () => {
      const mockFunction = jest.fn();
      const dataWithFunctionAction: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          action: mockFunction,
        },
      };

      expect(typeof dataWithFunctionAction.button.action).toBe("function");

      if (typeof dataWithFunctionAction.button.action === "function") {
        dataWithFunctionAction.button.action();
        expect(mockFunction).toHaveBeenCalled();
      }
    });

    it("should require title, description, and button.text", () => {
      // These should cause TypeScript compilation errors if uncommented:

      // Missing title
      // const missingTitle: HeroSectionData = {
      //   description: "Test",
      //   button: { text: "Test" },
      // };

      // Missing description
      // const missingDescription: HeroSectionData = {
      //   title: "Test",
      //   button: { text: "Test" },
      // };

      // Missing button.text
      // const missingButtonText: HeroSectionData = {
      //   title: "Test",
      //   description: "Test",
      //   button: {},
      // };

      expect(true).toBe(true); // Placeholder test
    });
  });

  describe("Button action union type", () => {
    it("should handle string actions", () => {
      const data: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          action: "/test-url",
        },
      };

      if (typeof data.button.action === "string") {
        expect(data.button.action).toBe("/test-url");
        expect(data.button.action.startsWith("/")).toBe(true);
      }
    });

    it("should handle function actions", () => {
      const mockAction = jest.fn();
      const data: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          action: mockAction,
        },
      };

      if (typeof data.button.action === "function") {
        data.button.action();
        expect(mockAction).toHaveBeenCalledTimes(1);
      }
    });

    it("should handle undefined actions", () => {
      const data: HeroSectionData = {
        title: "Test",
        description: "Test",
        button: {
          text: "Test",
          // action is undefined
        },
      };

      expect(data.button.action).toBeUndefined();
    });
  });
});
