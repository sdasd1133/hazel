# HAZEL - 트렌디한 의류 쇼핑몰 사이트

## 프로젝트 소개

HAZEL은 최신 트렌드의 의류와 패션 아이템을 제공하는 온라인 쇼핑몰입니다. Next.js와 TypeScript를 이용하여 구현되었으며, Tailwind CSS로 스타일링되어 있습니다.

## 주요 기능

- 👤 **사용자 관리**: 회원가입, 로그인, 승인 시스템
- 📋 **관리자 대시보드**: 사용자 관리, 상품 관리, 주문 관리  
- 🛍️ **상품 카테고리별 탐색**: 의류, 액세서리, 가방 등
- 📱 **상품 상세 정보**: 사이즈, 색상, 가격 정보
- 🛒 **장바구니 기능**: 장바구니 추가, 수량 조절
- 💳 **주문 시스템**: 주문 처리 및 관리
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **데이터베이스**: Supabase (PostgreSQL)
- **상태 관리**: Zustand
- **인증**: Supabase Auth + 승인 시스템
- **아이콘**: Lucide React
- **스타일링**: Tailwind CSS
- **배포**: Netlify

## 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/sdasd1133/hazel.git
cd hazel
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 실제 값으로 업데이트하세요:

```bash
cp .env.example .env.local
```

`.env.local` 파일에서 다음 값들을 설정하세요:

```bash
# Supabase 프로젝트 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 기타 설정
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=HAZEL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 URL과 anon key 복사
3. SQL Editor에서 `src/db/users_table.sql` 파일의 내용을 실행하여 테이블 생성
4. 또는 애플리케이션에서 `/admin/init-db` 페이지 접속하여 자동 초기화

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인할 수 있습니다.

## 사용법

### 관리자 계정

- **이메일**: admin@hazel.com
- **비밀번호**: 아무 값 (테스트 모드)

### 테스트 계정

- **승인된 사용자**: test@hazel.com
- **승인 대기**: pending@hazel.com  
- **승인 거부**: rejected@hazel.com

### 회원가입 플로우

1. `/register` 페이지에서 회원가입
2. 기본적으로 "승인 대기" 상태로 생성
3. 관리자가 `/admin/users` 페이지에서 승인/거부
4. 승인된 사용자만 로그인 가능

## 프로젝트 구조

- `src/app`: 페이지 컴포넌트
- `src/components`: UI 및 레이아웃 컴포넌트
- `src/lib`: 유틸리티 함수 및 상태 관리
- `src/types`: 타입 정의
- `public`: 정적 파일 (이미지 등)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
