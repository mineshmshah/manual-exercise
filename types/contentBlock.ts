/**
 * Core content block data structure for JSON/database storage
 * Contains all the content properties without runtime-specific props
 */
export interface ContentBlockData {
  /** Unique identifier for the content block */
  id: string;
  /** Main title text */
  title: string;
  /** Descriptive text content */
  description: string;
  /** Category text content */
  category: string;
  /** Image source path */
  imageSrc: string;
  /** Image alt text for accessibility */
  imageAlt: string;
}

/**
 * Full content block props for React component
 * Extends the core data with runtime properties
 */
export interface ContentBlockProps extends Omit<ContentBlockData, "id"> {
  /** Block index for numbering (0-based, will display as index+1) */
  index: number;
  /** Whether to reverse layout on desktop (image left vs right) */
  reverse?: boolean;
}
