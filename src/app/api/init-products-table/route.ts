import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. products 테이블 존재 확인
    const { data: productsCheck, error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    // 2. categories 테이블 존재 확인
    const { data: categoriesCheck, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    const tablesExist = {
      products: !productsError,
      categories: !categoriesError
    };

    const createTablesSQL = `
-- HAZEL 쇼핑몰 products 및 categories 테이블 생성

-- 카테고리 테이블 먼저 생성 (products가 참조하므로)
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 테이블 생성
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  category_id INTEGER REFERENCES categories(id),
  sku VARCHAR(100) UNIQUE,
  images JSONB DEFAULT '[]',
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft', 'out_of_stock')),
  weight DECIMAL(8,2),
  dimensions JSONB,
  featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(200),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 기본 카테고리 데이터 삽입
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
('가방', 'bags', '다양한 스타일의 가방', 1),
('남성의류', 'men-clothing', '남성 의류 컬렉션', 2),
('여성의류', 'women-clothing', '여성 의류 컬렉션', 3),
('신발', 'shoes', '신발 컬렉션', 4),
('액세서리', 'accessories', '패션 액세서리', 5),
('벨트', 'belts', '벨트 컬렉션', 6),
('모자', 'hats', '모자 컬렉션', 7),
('시계', 'watches', '시계 컬렉션', 8),
('코디세트', 'coordinated-sets', '코디네이트 세트', 9),
('스포츠의류', 'sports-clothing', '스포츠웨어', 10),
('중고명품', 'used-luxury', '중고 명품', 11)
ON CONFLICT (slug) DO NOTHING;

-- 테스트용 상품 데이터 삽입
INSERT INTO public.products (name, description, price, sale_price, stock_quantity, category_id, sku, images, status, featured) VALUES
('클래식 토트백', '고급 가죽으로 제작된 클래식 토트백', 150000, 120000, 10, 1, 'BAG001', '["https://via.placeholder.com/400x400?text=Tote+Bag"]', 'active', true),
('캐주얼 셔츠', '편안한 착용감의 캐주얼 셔츠', 49000, NULL, 25, 2, 'SHIRT001', '["https://via.placeholder.com/400x400?text=Shirt"]', 'active', false),
('원피스', '우아한 디자인의 원피스', 89000, 75000, 15, 3, 'DRESS001', '["https://via.placeholder.com/400x400?text=Dress"]', 'active', true),
('운동화', '편안한 운동화', 79000, NULL, 30, 4, 'SHOES001', '["https://via.placeholder.com/400x400?text=Sneakers"]', 'active', false)
ON CONFLICT (sku) DO NOTHING;
    `;

    if (tablesExist.products && tablesExist.categories) {
      return NextResponse.json({
        success: true,
        message: 'products와 categories 테이블이 이미 존재합니다.',
        tablesExist
      });
    }

    return NextResponse.json({
      success: false,
      message: '테이블이 존재하지 않습니다. 아래 SQL을 Supabase Dashboard에서 실행해주세요.',
      sql: createTablesSQL,
      tablesExist,
      instructions: [
        '1. https://supabase.com 에 로그인',
        '2. 해당 프로젝트 선택',
        '3. 좌측 메뉴에서 "SQL Editor" 클릭',
        '4. "New query" 버튼 클릭',
        '5. 위의 SQL 코드를 전체 복사하여 붙여넣기',
        '6. "Run" 버튼 클릭하여 실행',
        '7. 성공하면 상품 등록 테스트'
      ]
    });
  } catch (error) {
    console.error('테이블 확인 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        message: 'Supabase 연결을 확인해주세요.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // POST와 동일한 로직으로 상태 확인
  return POST(request);
}
