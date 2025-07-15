-- HAZEL 쇼핑몰 카테고리 테이블 안전한 업데이트 (기존 데이터 보존)
-- 기존 데이터를 삭제하지 않고 UPSERT 방식으로 업데이트

-- 1. 상위 카테고리 UPSERT (있으면 업데이트, 없으면 삽입)
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active) VALUES
('의류', 'clothing', '다양한 의류 제품', NULL, 1, true),
('아이템', 'accessories', '다양한 패션 아이템', NULL, 2, true),
('추천', 'best', '인기 있는 추천 제품', NULL, 3, true)
ON CONFLICT (slug) 
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 2. 하위 카테고리 UPSERT
INSERT INTO public.categories (name, slug, description, parent_id, sort_order, is_active) VALUES
-- 의류 카테고리 하위
('남성의류', 'men-clothing', '남성 의류 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 1, true),
('여성의류', 'women-clothing', '여성 의류 컬렉션', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 2, true),
('스포츠의류', 'sports-clothing', '스포츠웨어', 
 (SELECT id FROM public.categories WHERE slug='clothing'), 3, true),

-- 아이템 카테고리 하위  
('악세사리', 'accessory-items', '패션 악세사리', 
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
 (SELECT id FROM public.categories WHERE slug='best'), 2, true)
ON CONFLICT (slug) 
DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  parent_id = EXCLUDED.parent_id,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 3. 기존에 없던 카테고리 비활성화 (선택사항)
-- UPDATE public.categories 
-- SET is_active = false 
-- WHERE slug NOT IN (
--   'clothing', 'accessories', 'best',
--   'men-clothing', 'women-clothing', 'sports-clothing',
--   'accessory-items', 'hats', 'bags', 'shoes', 'watches', 'belts',
--   'coordinated-sets', 'used-luxury'
-- );

-- 4. 카테고리 구조 확인
SELECT 
  c1.id,
  c1.name as category_name,
  c1.slug,
  c2.name as parent_name,
  c1.sort_order,
  c1.is_active,
  c1.created_at,
  c1.updated_at
FROM public.categories c1
LEFT JOIN public.categories c2 ON c1.parent_id = c2.id
ORDER BY c1.parent_id NULLS FIRST, c1.sort_order;
