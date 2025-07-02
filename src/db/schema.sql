-- 사용자 테이블 생성
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default now(),
  is_admin boolean default false
);

-- 상위 카테고리 테이블 생성
create table parent_categories (
  id text primary key,
  name text not null,
  description text
);

-- 카테고리 테이블 생성
create table categories (
  id text primary key,
  name text not null,
  description text,
  parent_id text references parent_categories(id)
);

-- 제품 테이블 생성
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price integer not null,
  category text references categories(id),
  description text,
  is_featured boolean default false,
  in_stock boolean default true,
  created_at timestamp with time zone default now()
);

-- 제품 이미지 테이블 생성
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  display_order integer default 0
);

-- 제품 사이즈 테이블 생성
create table product_sizes (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  size text not null
);

-- 제품 색상 테이블 생성
create table product_colors (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  color text not null
);

-- 장바구니 테이블 생성
create table carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 장바구니 아이템 테이블 생성
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid references carts(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity integer not null default 1,
  selected_size text,
  selected_color text,
  created_at timestamp with time zone default now(),
  unique(cart_id, product_id, selected_size, selected_color)
);
