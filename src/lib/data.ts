import { MenuItem, MenuCategory } from '@/types';
import { menuItems, categories } from '@/data/menu';

export function getMenuItems(): MenuItem[] {
  return menuItems;
}

export function getCategories(): MenuCategory[] {
  return categories;
}

export function getFeaturedItems(): MenuItem[] {
  const items = getMenuItems();
  return items.filter(item => item.isBestseller).slice(0, 6);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return getMenuItems().find(item => item.id === id);
}

export function getMenuItemsByCategory(categoryHandle: string): MenuItem[] {
  return getMenuItems().filter(item => item.category === categoryHandle);
}
