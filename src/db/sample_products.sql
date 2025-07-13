-- 샘플 상품 데이터 삽입
-- 이 파일을 Supabase Dashboard의 SQL Editor에서 실행하거나 admin/init-db 페이지를 통해 실행할 수 있습니다.

-- 카테고리별 샘플 상품들
INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_featured) VALUES 

-- 남성의류
('클래식 면 티셔츠', '100% 순면으로 제작된 편안한 기본 티셔츠입니다. 일상복으로 완벽한 선택입니다.', 29000, '남성의류', '/images/products/men-tshirt-1.jpg', 50, true),
('슬림핏 청바지', '모던한 슬림핏으로 제작된 프리미엄 데님 청바지입니다.', 89000, '남성의류', '/images/products/men-jeans-1.jpg', 30, false),
('캐주얼 체크 셔츠', '고급 코튼 소재의 체크 패턴 셔츠로 비즈니스 캐주얼에 적합합니다.', 59000, '남성의류', '/images/products/men-shirt-1.jpg', 25, false),

-- 여성의류
('플로럴 원피스', '우아한 플로럴 패턴의 여름 원피스입니다. 데이트나 파티에 완벽합니다.', 79000, '여성의류', '/images/products/women-dress-1.jpg', 20, true),
('니트 가디건', '부드러운 니트 소재의 가디건으로 사계절 착용 가능합니다.', 69000, '여성의류', '/images/products/women-cardigan-1.jpg', 35, false),
('하이웨스트 스커트', '클래식한 하이웨스트 디자인의 우아한 스커트입니다.', 49000, '여성의류', '/images/products/women-skirt-1.jpg', 28, false),

-- 스포츠의류
('드라이핏 러닝 티셔츠', '땀 흡수가 뛰어난 드라이핏 소재의 러닝 전용 티셔츠입니다.', 39000, '스포츠의류', '/images/products/sports-tshirt-1.jpg', 40, true),
('요가 레깅스', '신축성이 뛰어난 요가 전용 레깅스로 편안한 운동을 도와줍니다.', 59000, '스포츠의류', '/images/products/sports-leggings-1.jpg', 32, false),
('트레이닝 후드집업', '보온성과 스타일을 겸비한 트레이닝 후드 집업입니다.', 89000, '스포츠의류', '/images/products/sports-hoodie-1.jpg', 22, false),

-- 가방
('레더 토트백', '고급 천연 가죽으로 제작된 클래식 토트백입니다.', 159000, '가방', '/images/products/bag-tote-1.jpg', 15, true),
('백팩 15인치', '노트북 수납이 가능한 실용적인 백팩입니다.', 89000, '가방', '/images/products/bag-backpack-1.jpg', 25, false),
('크로스백', '데일리 사용에 완벽한 컴팩트한 크로스백입니다.', 69000, '가방', '/images/products/bag-cross-1.jpg', 30, false),

-- 신발
('스니커즈 화이트', '클래식한 화이트 스니커즈로 어떤 스타일에도 잘 어울립니다.', 129000, '신발', '/images/products/shoes-sneakers-1.jpg', 35, true),
('로퍼 브라운', '비즈니스 룩에 완벽한 고급 가죽 로퍼입니다.', 189000, '신발', '/images/products/shoes-loafer-1.jpg', 18, false),
('부츠 블랙', '가을/겨울용 스타일리시한 앵클 부츠입니다.', 159000, '신발', '/images/products/shoes-boots-1.jpg', 22, false),

-- 시계
('클래식 시계 골드', '우아한 골드 톤의 클래식 손목시계입니다.', 299000, '시계', '/images/products/watch-classic-1.jpg', 12, true),
('스포츠 디지털 시계', '다양한 기능을 갖춘 스포츠용 디지털 시계입니다.', 159000, '시계', '/images/products/watch-sports-1.jpg', 20, false),
('미니멀 시계', '심플하고 모던한 디자인의 미니멀 시계입니다.', 189000, '시계', '/images/products/watch-minimal-1.jpg', 15, false),

-- 모자
('베이직 볼캡', '일상 착용에 완벽한 베이직 볼캡입니다.', 29000, '모자', '/images/products/hat-cap-1.jpg', 50, false),
('버킷햇', '여름 휴가철에 완벽한 스타일리시한 버킷햇입니다.', 39000, '모자', '/images/products/hat-bucket-1.jpg', 35, true),
('비니', '추운 겨울을 따뜻하게 해줄 니트 비니입니다.', 25000, '모자', '/images/products/hat-beanie-1.jpg', 40, false),

-- 벨트
('가죽 벨트 블랙', '고급 가죽으로 제작된 클래식 블랙 벨트입니다.', 69000, '벨트', '/images/products/belt-leather-1.jpg', 25, false),
('캔버스 벨트', '캐주얼한 스타일링에 완벽한 캔버스 벨트입니다.', 39000, '벨트', '/images/products/belt-canvas-1.jpg', 30, false),

-- 악세사리
('실버 목걸이', '우아한 실버 체인 목걸이로 어떤 옷에도 잘 어울립니다.', 89000, '악세사리', '/images/products/accessory-necklace-1.jpg', 20, true),
('골드 귀걸이', '고급스러운 골드 스터드 귀걸이입니다.', 129000, '악세사리', '/images/products/accessory-earring-1.jpg', 15, false),
('팔찌 세트', '데일리 착용에 완벽한 팔찌 3종 세트입니다.', 59000, '악세사리', '/images/products/accessory-bracelet-1.jpg', 25, false),

-- 깔맞춤
('오피스 룩 세트', '블라우스와 스커트가 세트로 구성된 오피스 룩입니다.', 159000, '깔맞춤', '/images/products/coord-office-1.jpg', 10, true),
('캐주얼 투피스', '편안한 상하의 세트로 홈웨어나 데일리 착용에 완벽합니다.', 89000, '깔맞춤', '/images/products/coord-casual-1.jpg', 15, false),

-- 중고명품
('빈티지 가죽 재킷', '1980년대 빈티지 가죽 재킷으로 유니크한 스타일을 연출할 수 있습니다.', 299000, '중고명품', '/images/products/vintage-jacket-1.jpg', 5, true),
('디자이너 핸드백', '유명 브랜드의 빈티지 핸드백으로 희소성이 높습니다.', 599000, '중고명품', '/images/products/vintage-bag-1.jpg', 3, false);

-- 상품 이미지 테이블에도 샘플 데이터 추가 (필요한 경우)
-- 실제 이미지 파일들은 public/images/products/ 폴더에 추가해야 합니다.
