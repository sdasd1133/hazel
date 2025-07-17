import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

export interface MainProduct {
  id: string  // UUID 타입으로 수정
  name: string
  description?: string
  price: number
  sale_price?: number
  stock_quantity: number
  category_id?: number | null
  sku?: string
  images: string[]
  tags?: string[]
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock'
  featured: boolean
  created_at: string
  updated_at: string
  colors?: string[]  // 추가: 상품 색상 정보
  sizes?: string[]   // 추가: 상품 사이즈 정보
  category?: {
    id: number
    name: string
    slug: string
  }
  categories?: {  // Supabase 조인 결과용
    id: number
    name: string
    slug: string
  }
}

// 색상과 사이즈 정보를 tags에서 추출하는 헬퍼 함수들
const extractColorsFromTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return []
  
  return tags
    .filter(tag => tag.startsWith('color:'))
    .map(tag => tag.replace('color:', ''))
}

const extractSizesFromTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return []
  
  return tags
    .filter(tag => tag.startsWith('size:'))
    .map(tag => tag.replace('size:', ''))
}

const extractShoeSizesFromTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return []
  
  return tags
    .filter(tag => tag.startsWith('shoesize:'))
    .map(tag => tag.replace('shoesize:', ''))
}

const extractPantsSizesFromTags = (tags: string[] | undefined): string[] => {
  if (!tags || !Array.isArray(tags)) return []
  
  return tags
    .filter(tag => tag.startsWith('pantssize:'))
    .map(tag => tag.replace('pantssize:', ''))
}

// 상품에 색상과 사이즈 정보를 추가하는 함수 (tags에서 추출)
const enrichProductWithOptions = async (product: MainProduct): Promise<MainProduct> => {
  const colors = extractColorsFromTags(product.tags)
  const regularSizes = extractSizesFromTags(product.tags)
  const shoeSizes = extractShoeSizesFromTags(product.tags)
  const pantsSizes = extractPantsSizesFromTags(product.tags)
  
  // 일반 사이즈, 신발 사이즈, 바지 사이즈를 합쳐서 sizes 배열에 저장
  const sizes = [...regularSizes, ...shoeSizes, ...pantsSizes]

  console.log('🎨 색상/사이즈 정보 추출:', {
    productId: product.id,
    productName: product.name,
    tags: product.tags,
    extractedColors: colors,
    extractedRegularSizes: regularSizes,
    extractedShoeSizes: shoeSizes,
    extractedPantsSizes: pantsSizes,
    finalSizes: sizes
  })

  return {
    ...product,
    colors,
    sizes
  }
}

// 여러 상품에 색상과 사이즈 정보를 추가하는 함수
const enrichProductsWithOptions = async (products: MainProduct[]): Promise<MainProduct[]> => {
  return Promise.all(products.map(product => enrichProductWithOptions(product)))
}

// 메인사이트용 상품 서비스
export const mainProductService = {
  // 모든 활성 상품 조회
  async getActiveProducts(): Promise<MainProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        // 모든 상품을 가져오도록 상태 필터 제거
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Products fetch error:', error)
        throw new Error(`상품 조회 실패: ${error.message}`)
      }

      // 색상과 사이즈 정보를 추가하여 반환
      return await enrichProductsWithOptions(data as MainProduct[])
    } catch (error) {
      console.error('Get active products error:', error)
      throw error
    }
  },

  // 카테고리별 상품 조회 (카테고리 ID 기준)
  async getProductsByCategory(categoryId: number): Promise<MainProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('status', 'active')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Products by category fetch error:', error)
        throw new Error(`카테고리별 상품 조회 실패: ${error.message}`)
      }

      return data as MainProduct[]
    } catch (error) {
      console.error('Get products by category error:', error)
      throw error
    }
  },

  // 카테고리별 상품 조회 (카테고리명 기준) - 메인사이트용 (완전 재작성)
  async getProductsByCategoryName(categoryName: string): Promise<MainProduct[]> {
    try {
      // 1단계: 모든 상품을 먼저 가져와서 확인
      const { data: allProducts, error: allError } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .order('created_at', { ascending: false })

      if (allError) {
        console.error('전체 상품 조회 오류:', allError);
        throw new Error(`전체 상품 조회 실패: ${allError.message}`)
      }
      
      // 전체 상품 데이터 로그 출력 (디버깅)
      console.log('🔍 전체 상품 데이터 확인:', allProducts?.map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        category_from_join: p.categories,
        raw_category: p.category
      })));
      
      // 2단계: 카테고리명을 ID로 매핑 (실제 DB 구조에 맞게 수정)
      const categoryNameToIdMapping: Record<string, number> = {
        '여성의류': 2,     // 실제 DB ID: 2
        '남성의류': 3,     // 실제 DB ID: 3
        '스포츠의류': 7,   // 실제 DB ID: 7
        '모자': 9,         // 실제 DB ID: 9
        '가방': 5,         // 실제 DB ID: 5
        '신발': 6,         // 실제 DB ID: 6
        '시계': 8,         // 실제 DB ID: 8
        '벨트': 10,        // 실제 DB ID: 10
        '악세사리': 20     // 실제 DB ID: 20
      };
      
      const targetCategoryId = categoryNameToIdMapping[categoryName];
      
      // 디버깅을 위한 로그
      console.log(`🔍 카테고리 매핑 확인:`, {
        요청카테고리: categoryName,
        매핑된ID: targetCategoryId,
        전체매핑: categoryNameToIdMapping
      });
      
      if (!targetCategoryId) {
        console.log(`❌ 카테고리 '${categoryName}'에 해당하는 ID를 찾을 수 없습니다.`);
        return [];
      }
      
      // 3단계: 해당 카테고리 상품 필터링 (category_id로만 비교)
      const filteredProducts = allProducts?.filter(product => {
        const matches = product.category_id === targetCategoryId;
        return matches;
      }) || [];
      
      // 디버깅을 위한 로그
      console.log(`🔍 카테고리 '${categoryName}' (ID: ${targetCategoryId}) 필터링 결과:`, {
        총상품수: allProducts?.length || 0,
        필터링된상품수: filteredProducts.length,
        필터링된상품목록: filteredProducts.map(p => ({ 
          id: p.id, 
          name: p.name, 
          category_id: p.category_id,
          category_name: p.categories?.name
        }))
      });
      
      // 색상과 사이즈 정보를 추가하여 반환
      return await enrichProductsWithOptions(filteredProducts as MainProduct[])
    } catch (error) {
      console.error('Get products by category name error:', error)
      throw error
    }
  },

  // 특정 상품 조회
  async getProduct(id: string): Promise<MainProduct | null> {
    try {
      console.log('Fetching product with ID:', id);
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('id', id)
        // 모든 상품을 가져오도록 상태 필터 제거
        .single()

      if (error) {
        console.error('Product fetch error:', error);
        if (error.code === 'PGRST116') {
          console.log('Product not found with ID:', id);
          return null // 상품이 없음
        }
        throw new Error(`상품 조회 실패: ${error.message}`)
      }

      console.log('Fetched product:', data);
      // 색상과 사이즈 정보를 추가하여 반환
      return await enrichProductWithOptions(data as MainProduct)
    } catch (error) {
      console.error('Get product error:', error)
      throw error
    }
  },

  // 추천 상품 조회 (featured)
  async getFeaturedProducts(limit: number = 8): Promise<MainProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Featured products fetch error:', error)
        throw new Error(`추천 상품 조회 실패: ${error.message}`)
      }

      return data as MainProduct[]
    } catch (error) {
      console.error('Get featured products error:', error)
      throw error
    }
  },

  // 상품 검색
  async searchProducts(query: string): Promise<MainProduct[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .eq('status', 'active')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Products search error:', error)
        throw new Error(`상품 검색 실패: ${error.message}`)
      }

      return data as MainProduct[]
    } catch (error) {
      console.error('Search products error:', error)
      throw error
    }
  }
}

// MainProduct를 Product로 변환하는 함수
export const convertMainProductToProduct = (mainProduct: MainProduct): Product => {
  // 카테고리 이름 결정 로직 개선
  let categoryName = '미분류';
  
  if (mainProduct.categories?.name) {
    // DB 조인에서 가져온 카테고리 이름 사용 (우선순위)
    categoryName = mainProduct.categories.name;
  } else if (mainProduct.category?.name) {
    // DB에서 가져온 카테고리 이름 사용
    categoryName = mainProduct.category.name;
  } else if (mainProduct.category_id) {
    // category_id만 있는 경우 실제 DB 구조에 맞게 매핑
    const categoryMapping: Record<number, string> = {
      2: '여성의류',     // 실제 DB ID: 2
      3: '남성의류',     // 실제 DB ID: 3
      7: '스포츠의류',   // 실제 DB ID: 7
      5: '가방',         // 실제 DB ID: 5
      6: '신발',         // 실제 DB ID: 6
      8: '시계',         // 실제 DB ID: 8
      9: '모자',         // 실제 DB ID: 9
      10: '벨트',        // 실제 DB ID: 10
      20: '악세사리'     // 실제 DB ID: 20
    };
    categoryName = categoryMapping[mainProduct.category_id] || '미분류';
  }
  
  return {
    id: mainProduct.id,  // 이미 string 타입이므로 toString() 불필요
    name: mainProduct.name,
    price: mainProduct.sale_price || mainProduct.price,
    category: categoryName,
    description: mainProduct.description || '',
    images: mainProduct.images.length > 0 ? mainProduct.images : ['/placeholder-product.jpg'],
    sizes: mainProduct.sizes || [], // DB에서 가져온 사이즈 정보 사용
    colors: mainProduct.colors || [], // DB에서 가져온 색상 정보 사용
    tags: mainProduct.tags || [], // DB에서 가져온 태그 정보 사용
    isFeatured: mainProduct.featured,
    inStock: mainProduct.stock_quantity > 0 && mainProduct.status === 'active'
  }
}

// 메인사이트에서 사용할 전체 상품 조회 함수
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const mainProducts = await mainProductService.getActiveProducts()
    const products = convertMainProductsToProducts(mainProducts)
    return products
  } catch (error) {
    console.error('getAllProducts 오류:', error)
    return []
  }
}

// 카테고리별 상품 조회 함수 (메인사이트용)
export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
  try {
    const mainProducts = await mainProductService.getProductsByCategoryName(categoryName)
    const products = convertMainProductsToProducts(mainProducts)
    return products
  } catch (error) {
    console.error('getProductsByCategory 오류:', error)
    return []
  }
}

// 여러 MainProduct를 Product 배열로 변환
export const convertMainProductsToProducts = (mainProducts: MainProduct[]): Product[] => {
  return mainProducts.map(convertMainProductToProduct)
}
