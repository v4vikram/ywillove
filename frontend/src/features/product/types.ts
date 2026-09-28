// MySQL BIGINT and DECIMAL come back from the API as strings, not numbers.
export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  color: string;
  price: string;
  supplierSku: string;
  trackInventory: boolean;
  stock: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  basePrice: string;
  categoryId: number;
  images: string[];
  isActive: boolean;
  category?: Category;
  variants?: ProductVariant[];
};

export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProductFilters = {
  category?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
  page?: string;
};
