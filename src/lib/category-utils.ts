// 카테고리명과 URL 경로 매핑
export const categoryUrlMapping: Record<string, string> = {
  "남성의류": "/category/men-clothing",
  "여성의류": "/category/women-clothing", 
  "스포츠의류": "/category/sports-clothing",
  "가방": "/category/bags",
  "신발": "/category/shoes",
  "시계": "/category/watches",
  "모자": "/category/hats",
  "벨트": "/category/belts",
  "악세사리": "/category/accessories",
  "깔맞춤": "/category/coordinated-sets",
  "중고명품": "/category/used-luxury",
};

// URL에서 카테고리명 추출
export const getCategoryFromUrl = (url: string): string | null => {
  const mapping = Object.entries(categoryUrlMapping).find(([, path]) => path === url);
  return mapping ? mapping[0] : null;
};

// 카테고리명에서 URL 생성
export const getUrlFromCategory = (categoryName: string): string => {
  return categoryUrlMapping[categoryName] || `/products?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
};
