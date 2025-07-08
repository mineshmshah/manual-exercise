/**
 * Hero section data structure
 */
export interface HeroSectionData {
  /** Main hero title */
  title: string;
  /** Supporting description text */
  description: string;
  /** Button configuration */
  button: {
    /** Button text */
    text: string;
    /** Button click handler or href */
    action?: string | (() => void);
  };
  /** Background image source */
  backgroundImage?: string;
  /** Background image alt text */
  backgroundImageAlt?: string;
}
