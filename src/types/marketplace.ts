export type CategoryType = 'Clothing' | 'Furniture' | 'Gaming' | 'Electronics' | 'Books';
export type ConditionType = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: CategoryType;
  condition: ConditionType;
  location: string;
  timeAgo: string;
  sellerName: string;
  sellerRating: number;
  image: string;
  isFavorite?: boolean;
}

export interface CategorySummary {
  name: CategoryType;
  tagline: string;
  itemCount: number;
  icon: string;
}