// 제품 타입 정의
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  tags?: string[]; // 상품 태그 (사이즈/색상 정보 포함)
  isFeatured?: boolean;
  inStock: boolean;
}

// 카테고리 타입 정의
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // 상위 카테고리 ID
}

// 상위 카테고리 타입 정의
export interface ParentCategory {
  id: string;
  name: string;
  description?: string;
}

// 장바구니 아이템 타입 정의
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

// 로그인 인증 타입 정의
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  lastVisitedPage?: string | null;
}
