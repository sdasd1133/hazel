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

// 샘플 상품 데이터
export const products: Product[] = [
  {
    id: "1",
    name: "클래식 티셔츠",
    price: 29000,
    category: "남성의류",
    description: "부드러운 면 소재로 만든 클래식한 디자인의 베이직 티셔츠입니다. 어떤 스타일에도 잘 어울리며 편안한 착용감을 제공합니다.",
    images: ["/placeholder-product.jpg", "/placeholder-product.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["검정", "흰색", "회색"],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "2",
    name: "오버사이즈 맨투맨",
    price: 45000,
    category: "여성의류",
    description: "트렌디한 오버사이즈 핏의 맨투맨 스웨터입니다. 부드러운 면 혼방 소재로 제작되어 편안하게 착용할 수 있습니다.",
    images: ["/placeholder-product.jpg", "/placeholder-product.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["검정", "베이지", "네이비"],
    inStock: true,
  },
  {
    id: "3",
    name: "슬림핏 데님 팬츠",
    price: 59000,
    category: "남성의류",
    description: "편안하면서도 세련된 슬림핏 데님 팬츠입니다. 고품질 면 소재로 제작되어 내구성이 좋고 스트레치가 있어 활동하기 편합니다.",
    images: ["/placeholder-product.jpg", "/placeholder-product.jpg"],
    sizes: ["28", "30", "32", "34"],
    colors: ["중청", "연청", "흑청"],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "4",
    name: "스탠다드 후드 집업",
    price: 69000,
    category: "스포츠의류",
    description: "부드러운 안감과 보온성이 우수한 후드 집업입니다. 캐주얼한 스타일링에 최적화되어 있습니다.",
    images: ["https://picsum.photos/400/400?random=7", "https://picsum.photos/400/400?random=8"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["검정", "회색", "버건디"],
    inStock: true,
  },
  {
    id: "5",
    name: "베이직 니트 스웨터",
    price: 48000,
    category: "여성의류",
    description: "부드러운 터치감의 베이직 니트 스웨터입니다. 심플한 디자인으로 다양한 코디에 활용하기 좋습니다.",
    images: ["https://picsum.photos/400/400?random=9", "https://picsum.photos/400/400?random=10"],
    sizes: ["S", "M", "L"],
    colors: ["크림", "네이비", "라이트 그레이"],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "6",
    name: "와이드 핏 슬랙스",
    price: 52000,
    category: "여성의류",
    description: "트렌디한 와이드 핏의 슬랙스입니다. 고급스러운 원단으로 제작되어 캐주얼부터 세미 포멀까지 다양한 스타일링이 가능합니다.",
    images: ["https://picsum.photos/400/400?random=11", "https://picsum.photos/400/400?random=12"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["검정", "베이지", "차콜"],
    inStock: true,
  },
  // 악세사리 - 가방
  {
    id: "7",
    name: "크로스바디 미니백",
    price: 68000,
    category: "가방",
    description: "심플하면서도 세련된 디자인의 미니 크로스바디 백입니다. 내구성 좋은 가죽 소재로 제작되어 일상 사용에 적합합니다.",
    images: ["https://picsum.photos/400/400?random=13", "https://picsum.photos/400/400?random=14"],
    sizes: ["FREE"],
    colors: ["블랙", "브라운", "크림"],
    isFeatured: true,
    inStock: true,
  },
  // 악세사리 - 신발
  {
    id: "8",
    name: "클래식 스니커즈",
    price: 89000,
    category: "신발",
    description: "모든 옷에 잘 어울리는 클래식한 디자인의 스니커즈입니다. 쿠셔닝이 우수하여 장시간 착용해도 편안합니다.",
    images: ["https://picsum.photos/400/400?random=15", "https://picsum.photos/400/400?random=16"],
    sizes: ["250", "260", "270", "280"],
    colors: ["화이트", "블랙", "그레이"],
    inStock: true,
  },
  // 악세사리 - 시계
  {
    id: "9",
    name: "미니멀 디자인 워치",
    price: 120000,
    category: "시계",
    description: "심플하고 미니멀한 디자인의 고급 워치입니다. 어떤 스타일에도 잘 어울리며 내구성이 뛰어납니다.",
    images: ["https://picsum.photos/400/400?random=17", "https://picsum.photos/400/400?random=18"],
    sizes: ["FREE"],
    colors: ["실버", "골드", "로즈골드"],
    isFeatured: true,
    inStock: true,
  },
  // 악세사리 - 모자
  {
    id: "10",
    name: "베이직 볼캡",
    price: 35000,
    category: "모자",
    description: "심플한 디자인의 볼캡으로 데일리 룩에 포인트를 줄 수 있는 아이템입니다. 조절 가능한 스트랩으로 편안한 착용감을 제공합니다.",
    images: ["https://picsum.photos/400/400?random=19", "https://picsum.photos/400/400?random=20"],
    sizes: ["FREE"],
    colors: ["블랙", "네이비", "베이지"],
    inStock: true,
  },
  // 악세사리 - 벨트
  {
    id: "11",
    name: "프리미엄 레더 벨트",
    price: 58000,
    category: "벨트",
    description: "고품질 가죽으로 제작된 클래식 디자인의 벨트입니다. 견고한 버클과 내구성 좋은 소재로 오랫동안 사용할 수 있습니다.",
    images: ["https://picsum.photos/400/400?random=21", "https://picsum.photos/400/400?random=22"],
    sizes: ["S", "M", "L"],
    colors: ["블랙", "다크브라운", "탄"],
    inStock: true,
  },
  // 아이템 - 악세사리
  {
    id: "12",
    name: "실버 목걸이 세트",
    price: 42000,
    category: "악세사리",
    description: "세련된 디자인의 실버 목걸이 세트입니다. 다양한 스타일링에 활용하기 좋은 베이직한 디자인입니다.",
    images: ["https://picsum.photos/400/400?random=23", "https://picsum.photos/400/400?random=24"],
    sizes: ["Free"],
    colors: ["실버"],
    isFeatured: true,
    inStock: true,
  },
  // 베스트 추천 - 깔맞춤
  {
    id: "13",
    name: "베이직 티셔츠 & 데님 세트",
    price: 79000,
    category: "깔맞춤",
    description: "남녀 모두에게 어울리는 베이직한 티셔츠와 데님 팬츠의 세트 상품입니다. 다양한 스타일링에 활용할 수 있습니다.",
    images: ["https://picsum.photos/400/400?random=25", "https://picsum.photos/400/400?random=26"],
    sizes: ["S", "M", "L"],
    colors: ["블랙/블루", "화이트/블랙"],
    isFeatured: true,
    inStock: true,
  },
  // 베스트 추천 - 중고명품
  {
    id: "14",
    name: "프리미엄 브랜드 핸드백",
    price: 850000,
    category: "중고명품",
    description: "명품 브랜드의 프리미엄 핸드백입니다. 상태가 매우 좋으며 정품 인증서가 포함되어 있습니다.",
    images: ["https://picsum.photos/400/400?random=27", "https://picsum.photos/400/400?random=28"],
    sizes: ["FREE"],
    colors: ["블랙", "브라운"],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "15",
    name: "럭셔리 시계",
    price: 1200000,
    category: "중고명품",
    description: "스위스 명품 시계 브랜드의 럭셔리 시계입니다. 완벽한 컨디션으로 보증서와 박스가 포함되어 있습니다.",
    images: ["https://picsum.photos/400/400?random=29", "https://picsum.photos/400/400?random=30"],
    sizes: ["FREE"],
    colors: ["실버", "골드"],
    isFeatured: true,
    inStock: true,
  },
  {
    id: "16",
    name: "명품 드레스",
    price: 450000,
    category: "중고명품",
    description: "유명 디자이너의 명품 드레스입니다. 한 번만 착용한 거의 새 상품으로, 특별한 날에 완벽한 스타일을 연출할 수 있습니다.",
    images: ["https://picsum.photos/400/400?random=31", "https://picsum.photos/400/400?random=32"],
    sizes: ["S", "M"],
    colors: ["블랙", "네이비"],
    isFeatured: true,
    inStock: true,
  },
];

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

// 모든 카테고리 가져오기
export const getCategories = () => {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].map(name => ({
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

// 상위 카테고리에 해당하는 모든 상품 가져오기
export const getProductsByParentCategory = (parentId: string) => {
  const categoriesInParent = getCategoriesByParent(parentId).map(cat => cat.name);
  return products.filter(product => categoriesInParent.includes(product.category));
};
