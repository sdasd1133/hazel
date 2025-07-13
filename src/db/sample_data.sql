-- 샘플 상품 데이터 삽입
-- 카테고리 추가 (기존 카테고리에 추가)
INSERT INTO categories (name, slug, parent_id, description) VALUES
('니트', 'knit', 2, '따뜻한 니트 제품'),
('티셔츠', 'tshirt', 2, '편안한 티셔츠'),
('후드티', 'hoodie', 2, '캐주얼 후드티'),
('바지', 'pants', 2, '다양한 스타일의 바지'),
('스커트', 'skirts', 2, '여성용 스커트'),
('셔츠', 'shirts', 3, '남성용 셔츠'),
('정장', 'suits', 3, '남성용 정장');

-- 샘플 상품 데이터
INSERT INTO products (name, description, price, sale_price, stock_quantity, category_id, sku, images, tags, status, featured) VALUES
-- 여성 의류
('오버사이즈 캐시미어 니트', '부드러운 캐시미어 소재로 제작된 오버사이즈 니트입니다. 따뜻하고 편안한 착용감을 제공합니다.', 89000, 71200, 15, 8, 'KNT001', '["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500"]', '{"니트", "캐시미어", "오버사이즈", "겨울"}', 'active', true),

('베이직 코튼 티셔츠', '100% 순면 소재의 베이직 티셔츠입니다. 다양한 스타일링에 활용하기 좋습니다.', 25000, NULL, 50, 9, 'TSH001', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]', '{"티셔츠", "코튼", "베이직"}', 'active', false),

('크롭 후드티', '트렌디한 크롭 길이의 후드티입니다. 캐주얼하면서도 스타일리시한 룩을 연출할 수 있습니다.', 45000, 36000, 30, 10, 'HOD001', '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500"]', '{"후드티", "크롭", "캐주얼"}', 'active', true),

('하이웨스트 와이드 팬츠', '편안한 착용감의 하이웨스트 와이드 팬츠입니다. 다리가 길어 보이는 효과가 있습니다.', 65000, 52000, 25, 11, 'PNT001', '["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500"]', '{"바지", "와이드", "하이웨스트"}', 'active', false),

('플리츠 미니 스커트', '우아한 플리츠 디테일의 미니 스커트입니다. 여성스러운 실루엣을 완성합니다.', 38000, NULL, 20, 12, 'SKT001', '["https://images.unsplash.com/photo-1583496661160-fb5886a13d84?w=500"]', '{"스커트", "플리츠", "미니"}', 'active', false),

-- 남성 의류
('클래식 드레스 셔츠', '비즈니스 미팅이나 정식 행사에 적합한 클래식 드레스 셔츠입니다.', 55000, NULL, 35, 13, 'SHT001', '["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"]', '{"셔츠", "드레스", "비즈니스"}', 'active', false),

('슬림핏 정장 세트', '세련된 슬림핏 정장 세트입니다. 재킷과 바지가 함께 구성되어 있습니다.', 450000, 360000, 10, 14, 'SUT001', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"]', '{"정장", "슬림핏", "세트"}', 'active', true),

-- 액세서리
('미니멀 크로스백', '심플하고 실용적인 미니멀 디자인의 크로스백입니다.', 85000, 68000, 40, 5, 'BAG001', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"]', '{"가방", "크로스백", "미니멀"}', 'active', true),

('레더 스니커즈', '편안하고 스타일리시한 레더 스니커즈입니다. 캐주얼 룩에 완벽한 아이템입니다.', 120000, 96000, 30, 6, 'SHO001', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"]', '{"신발", "스니커즈", "레더"}', 'active', false),

-- 추가 상품들
('울 블렌드 코트', '고급스러운 울 블렌드 소재의 롱코트입니다. 겨울철 필수 아이템입니다.', 280000, 224000, 12, 2, 'COT001', '["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500"]', '{"코트", "울", "겨울", "아우터"}', 'active', true);

-- 입금 계좌 정보 추가
INSERT INTO bank_accounts (bank_name, account_number, account_holder, is_default, is_active) VALUES
('국민은행', '123456-78-901234', 'GL굿럭패션', true, true),
('신한은행', '567890-12-345678', 'GL굿럭패션', false, true),
('우리은행', '901234-56-789012', 'GL굿럭패션', false, true);
