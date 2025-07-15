-- HAZEL 쇼핑몰 카테고리 테이블 안전한 업데이트
-- 기존 데이터와 충돌 없이 메인사이트 구조에 맞춰 업데이트

-- 1. 기존 카테고리 데이터 삭제 (참조 무결성 고려)
-- 먼저 products 테이블의 category_id를 NULL로 변경
UPDATE public.products SET category_id = NULL WHERE category_id IS NOT NULL;

-- 기존 카테고리 데이터 삭제
DELETE FROM public.categories;

-- 2. 상위 카테고리 삽입
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('의류', 'clothing', '다양한 의류 제품', NULL, 1, true),
('아이템', 'accessories', '다양한 패션 아이템', NULL, 2, true),
('추천', 'best', '인기 있는 추천 제품', NULL, 3, true);

-- 3. 하위 카테고리 삽입 (상위 카테고리 ID 참조)
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active) VALUES
-- 의류 카테고리 하위
('남성의류', 'men-clothing', '남성 의류 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 1, true),
('여성의류', 'women-clothing', '여성 의류 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 2, true),
('스포츠의류', 'sports-clothing', '스포츠웨어', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 3, true),

-- 아이템 카테고리 하위  
('악세사리', 'accessory', '패션 악세사리', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 1, true),
('모자', 'hats', '모자 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 2, true),
('가방', 'bags', '다양한 스타일의 가방', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 3, true),
('신발', 'shoes', '신발 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 4, true),
('시계', 'watches', '시계 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 5, true),
('벨트', 'belts', '벨트 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='accessories'), 6, true),

-- 추천 카테고리 하위
('깔맞춤', 'coordinated-sets', '코디네이트 세트', 
 (SELECT id FROM public.categories WHERE slug='best'), 1, true),
('중고명품', 'used-luxury', '중고 명품', 
 (SELECT id FROM public.categories WHERE slug='best'), 2, true);

-- 4. 카테고리 데이터 확인
SELECT 
  c1.id,
  c1.name as category_name,
  c1.slug,
  c2.name as parent_name,
  c1.sort_order,
  c1.is_active
FROM public.categories c1
LEFT JOIN public.categories c2 ON c1.parent_id = c2.id
ORDER BY c1.parent_id NULLS FIRST, c1.sort_order;

-- 5. 기존 상품들의 category_id 업데이트 (예시)
-- 상품이 있다면 카테고리 이름으로 매칭하여 category_id 업데이트
UPDATE public.products 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE name = '가방' 
  LIMIT 1
) 
WHERE name LIKE '%가방%' OR name LIKE '%백%' OR name LIKE '%bag%';

UPDATE public.products 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE name = '남성의류' 
  LIMIT 1
) 
WHERE name LIKE '%셔츠%' OR name LIKE '%남성%';

UPDATE public.products 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE name = '여성의류' 
  LIMIT 1
) 
WHERE name LIKE '%원피스%' OR name LIKE '%여성%';

UPDATE public.products 
SET category_id = (
  SELECT id FROM public.categories 
  WHERE name = '신발' 
  LIMIT 1
) 
WHERE name LIKE '%신발%' OR name LIKE '%운동화%' OR name LIKE '%shoes%';

-- 6. 최종 확인
SELECT 
  p.id,
  p.name as product_name,
  c.name as category_name,
  c2.name as parent_category_name
FROM public.products p
LEFT JOIN public.categories c ON p.category_id = c.id
LEFT JOIN public.categories c2 ON c.parent_id = c2.id
ORDER BY c2.name, c.name, p.name;
