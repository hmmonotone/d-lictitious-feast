import { MenuItem, BlogPost } from '@/types';
import menuData from '@/data/menu.json';
import blogPostsData from '@/data/blog/posts.json';

export function getMenuItems(): MenuItem[] {
  return menuData as MenuItem[];
}

export function getFeaturedItems(): MenuItem[] {
  const items = getMenuItems();
  return items.filter(item => item.isBestseller).slice(0, 6);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return getMenuItems().find(item => item.id === id);
}

export function getBlogPosts(): BlogPost[] {
  return (blogPostsData as BlogPost[]).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find(post => post.slug === slug);
}

export async function getBlogContent(slug: string): Promise<string> {
  try {
    const content = await import(`@/data/blog/${slug}.md?raw`);
    return content.default;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return '';
  }
}
