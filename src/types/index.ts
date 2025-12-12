export interface MenuItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  tags: string[];
  spicyLevel: number;
  isVeg: boolean;
  isBestseller: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  author: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image?: string;
}
