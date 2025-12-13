export interface MenuItem {
  id: string;
  productId: string;
  handle: string;
  name: string;
  category: string;
  description: string;
  posCode: string;
  salesPrice: number;
  markupPrice?: number;
  foodType: 'veg' | 'non-veg' | 'egg';
  isRecommended: boolean;
  isPackagedGood: boolean;
  isBestseller?: boolean;
}

export interface MenuCategory {
  handle: string;
  name: string;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  author: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
}
