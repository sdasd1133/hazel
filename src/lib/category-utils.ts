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
  // 하위 카테고리 추가
  "남성 상의": "/category/men-clothing/tops",
  "남성 하의": "/category/men-clothing/bottoms",
  "여성 상의": "/category/women-clothing/tops",
  "여성 하의": "/category/women-clothing/bottoms",
};

// URL에서 카테고리명 추출
export const getCategoryFromUrl = (url: string): string | null => {
  const mapping = Object.entries(categoryUrlMapping).find(([, path]) => path === url);
  return mapping ? mapping[0] : null;
};

// 카테고리명에서 URL 생성
export const getUrlFromCategory = (categoryName: string): string => {
  const url = categoryUrlMapping[categoryName] || `/products?category=${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  return url;
};
