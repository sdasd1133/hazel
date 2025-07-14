-- HAZEL 쇼핑몰 products 테이블 생성

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
  dimensions JSONB, -- {width, height, depth}
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
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

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

-- 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 테스트용 상품 데이터 삽입
INSERT INTO public.products (name, description, price, sale_price, stock_quantity, category_id, sku, images, status, featured) VALUES
('클래식 토트백', '고급 가죽으로 제작된 클래식 토트백', 150000, 120000, 10, 1, 'BAG001', '["https://via.placeholder.com/400x400?text=Tote+Bag"]', 'active', true),
('캐주얼 셔츠', '편안한 착용감의 캐주얼 셔츠', 49000, NULL, 25, 2, 'SHIRT001', '["https://via.placeholder.com/400x400?text=Shirt"]', 'active', false),
('원피스', '우아한 디자인의 원피스', 89000, 75000, 15, 3, 'DRESS001', '["https://via.placeholder.com/400x400?text=Dress"]', 'active', true),
('운동화', '편안한 운동화', 79000, NULL, 30, 4, 'SHOES001', '["https://via.placeholder.com/400x400?text=Sneakers"]', 'active', false)
ON CONFLICT (sku) DO NOTHING;
