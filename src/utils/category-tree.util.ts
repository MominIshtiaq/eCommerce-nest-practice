import { Category } from 'src/category/entities/category.entity';

export interface CategoryTree {
  id: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  deletedAt: Date | null;
  parent: number | null;
  children: CategoryTree[];
}

export function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const map = new Map<number, CategoryTree>();
  const roots: CategoryTree[] = [];

  // normalize
  for (const cat of categories) {
    map.set(cat.id, {
      id: cat.id,
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
      isActive: cat.isActive,
      deletedAt: cat.deletedAt,
      parent: cat.parent?.id ?? null,
      children: [],
    });
  }

  // build tree
  for (const cat of categories) {
    const current = map.get(cat.id);
    if (!current) continue;

    if (cat.parent?.id) {
      const parent = map.get(cat.parent.id);
      parent?.children.push(current);
    } else {
      roots.push(current);
    }
  }

  return roots;
}
