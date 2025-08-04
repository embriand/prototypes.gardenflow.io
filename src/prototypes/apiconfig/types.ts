// TypeScript types for API Configuration prototype

export interface ApiConfigProps {
  // Define your component props here
}

export interface IApiConfig {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  authType: "none" | "basic" | "token";
  username?: string;
  password?: string;
  apiKey?: string;
  isActive: boolean;
}

export interface IProductItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
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