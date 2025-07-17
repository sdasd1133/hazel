import { Product, ParentCategory } from "@/types";

// 상위 카테고리 정의
export const parentCategories: ParentCategory[] = [
  {
    id: "clothing",
    name: "의류",
    description: "다양한 의류 제품"
  },
  {
    id: "accessories",
    name: "아이템",
    description: "다양한 패션 아이템"
  },
  {
    id: "best",
    name: "추천",
    description: "인기 있는 추천 제품"
  }
];

// 카테고리별 상위 카테고리 매핑
export const categoryToParentMapping: Record<string, string> = {
  "남성의류": "clothing",
  "여성의류": "clothing",
  "스포츠의류": "clothing",
  "악세사리": "accessories",
  "모자": "accessories",
  "가방": "accessories",
  "신발": "accessories",
  "시계": "accessories",
  "벨트": "accessories",
  "깔맞춤": "best",
  "중고명품": "best",
};

// 샘플 상품 데이터 - 모든 데모 상품 제거
export const products: Product[] = [];

// 카테고리별 상품 필터링 함수
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

// 특정 상품 ID로 상품 찾기
export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

// 특징 상품 가져오기
export const getFeaturedProducts = () => {
  return products.filter(product => product.isFeatured);
};

// 모든 카테고리 가져오기 - 데이터베이스 카테고리 포함
export const getCategories = () => {
  // 하드코딩된 카테고리 리스트 (데이터베이스에 맞춰 수정)
  const predefinedCategories = [
    "남성의류",
    "여성의류", 
    "스포츠의류",
    "악세사리",
    "모자",
    "가방",
    "신발",
    "시계",
    "벨트",
    "깔맞춤",
    "중고명품"
  ];
  
  return predefinedCategories.map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    parentId: categoryToParentMapping[name] || null
  }));
};

// 상위 카테고리별 하위 카테고리 가져오기
export const getCategoriesByParent = (parentId: string) => {
  return getCategories().filter(category => category.parentId === parentId);
};

// 상위 카테고리 가져오기
export const getParentCategories = () => {
  return parentCategories;
};

// 상위 카테고리에 해당하는 모든 상품 가져오기 (데이터베이스 상품만)
export const getProductsByParentCategory = (parentId: string) => {
  // 이 함수는 이제 데이터베이스에서 상품을 가져와야 함
  return [];
};
