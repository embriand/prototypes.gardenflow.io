// TypeScript types for Landscape prototype

export interface LandscapeProps {
  // Define your component props here
}

export interface Products {
  uuid?: string;
  products_uuid?: string;
  template_uuid?: string;
  title?: string;
  name?: string;
  description?: string;
  notes?: string;
  category?: string;
  category_id?: string;
  category_slug?: string;
  category_display_name?: string;
  category_color?: string;
  category_icon?: string;
  variety?: string;
  properties?: Record<string, string | number | boolean>;
  family?: string;
  familyCode?: string;
  familyShortCode?: string;
  family_uuid?: string;
  color?: string;
  inventory?: number;
  varieties?: string[];
  defaultSowDuration?: number;
  defaultCultureDuration?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  image?: string;
  type?: "flat" | "2d";
}

export interface DraggableItem {
  id: string;
  name: string;
  image: string;
  type: "flat" | "2d";
  category: string;
}

export interface Canvas {
  id: number;
  name: string;
  items: any[];
  background: string | null;
}

export interface BackgroundImage {
  id: string;
  name: string;
  src: string;
}