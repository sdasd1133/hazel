import { Database } from './supabase-types';

// 기존 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  isFeatured?: boolean;
  inStock: boolean;
}

// Supabase에서 사용할 제품 타입
export type SupabaseProduct = Database['public']['Tables']['products']['Row'];
export type SupabaseProductInsert = Database['public']['Tables']['products']['Insert'];
export type SupabaseProductImage = Database['public']['Tables']['product_images']['Row'];
export type SupabaseProductSize = Database['public']['Tables']['product_sizes']['Row'];
export type SupabaseProductColor = Database['public']['Tables']['product_colors']['Row'];

// 카테고리 타입 정의
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // 상위 카테고리 ID
}

// Supabase에서 사용할 카테고리 타입
export type SupabaseCategory = Database['public']['Tables']['categories']['Row'];
export type SupabaseCategoryInsert = Database['public']['Tables']['categories']['Insert'];

// 상위 카테고리 타입 정의
export interface ParentCategory {
  id: string;
  name: string;
  description?: string;
}

// Supabase에서 사용할 상위 카테고리 타입
export type SupabaseParentCategory = Database['public']['Tables']['parent_categories']['Row'];
export type SupabaseParentCategoryInsert = Database['public']['Tables']['parent_categories']['Insert'];

// 장바구니 아이템 타입 정의
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Supabase에서 사용할 장바구니 타입
export type SupabaseCartItem = Database['public']['Tables']['cart_items']['Row'];
export type SupabaseCartItemInsert = Database['public']['Tables']['cart_items']['Insert'];
export type SupabaseCart = Database['public']['Tables']['carts']['Row'];

// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

// Supabase에서 사용할 사용자 타입
export type SupabaseUser = Database['public']['Tables']['users']['Row'];
export type SupabaseUserInsert = Database['public']['Tables']['users']['Insert'];

// 로그인 인증 타입 정의
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastVisitedPage?: string | null;
}
