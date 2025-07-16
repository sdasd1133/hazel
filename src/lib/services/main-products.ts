import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

export interface MainProduct {
  id: number
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
  category?: {
    id: number
    name: string
    slug: string
  }
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

      return data as MainProduct[]
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
      
      // 2단계: 카테고리명을 ID로 매핑 (관리자 페이지와 동일한 매핑)
      const categoryNameToIdMapping: Record<string, number> = {
        '남성의류': 1,
        '여성의류': 2,
        '스포츠의류': 3,
        '악세사리': 4,
        '모자': 5,
        '가방': 6,
        '신발': 7,
        '시계': 8,
        '벨트': 9,
        '깔맞춤': 10,
        '중고명품': 11
      };
      
      const targetCategoryId = categoryNameToIdMapping[categoryName];
      
      // 디버깅을 위한 로그
      console.log(`카테고리 매핑 확인:`, {
        요청카테고리: categoryName,
        매핑된ID: targetCategoryId,
        전체매핑: categoryNameToIdMapping
      });
      
      if (!targetCategoryId) {
        console.log(`카테고리 '${categoryName}'에 해당하는 ID를 찾을 수 없습니다.`);
        return [];
      }
      
      // 3단계: 해당 카테고리 상품 필터링 (category_id로만 비교)
      const filteredProducts = allProducts?.filter(product => {
        // category_id로만 직접 비교 (더 정확한 매칭)
        return product.category_id === targetCategoryId;
      }) || [];
      
      // 디버깅을 위한 로그
      console.log(`카테고리 '${categoryName}' (ID: ${targetCategoryId}) 상품 필터링 결과:`, {
        총상품수: allProducts?.length || 0,
        필터링된상품수: filteredProducts.length,
        필터링된상품들: filteredProducts.map(p => ({ id: p.id, name: p.name, category_id: p.category_id }))
      });
      
      return filteredProducts as MainProduct[]
    } catch (error) {
      console.error('Get products by category name error:', error)
      throw error
    }
  },

  // 특정 상품 조회
  async getProduct(id: number): Promise<MainProduct | null> {
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
      return data as MainProduct
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
  
  if (mainProduct.category?.name) {
    // DB에서 가져온 카테고리 이름 사용
    categoryName = mainProduct.category.name;
  } else if (mainProduct.category_id) {
    // category_id만 있는 경우 메인 사이트와 동일한 순서로 매핑
    const categoryMapping: Record<number, string> = {
      1: '남성의류',      // 메인 사이트 순서 1번
      2: '여성의류',      // 메인 사이트 순서 2번  
      3: '스포츠의류',    // 메인 사이트 순서 3번
      4: '악세사리',      // 메인 사이트 순서 4번
      5: '모자',          // 메인 사이트 순서 5번
      6: '가방',          // 메인 사이트 순서 6번
      7: '신발',          // 메인 사이트 순서 7번
      8: '시계',          // 메인 사이트 순서 8번
      9: '벨트',          // 메인 사이트 순서 9번
      10: '깔맞춤',       // 메인 사이트 순서 10번
      11: '중고명품'      // 메인 사이트 순서 11번
    };
    categoryName = categoryMapping[mainProduct.category_id] || '미분류';
  }
  
  return {
    id: mainProduct.id.toString(),
    name: mainProduct.name,
    price: mainProduct.sale_price || mainProduct.price,
    category: categoryName,
    description: mainProduct.description || '',
    images: mainProduct.images.length > 0 ? mainProduct.images : ['/placeholder-product.jpg'],
    sizes: [], // DB에서 sizes 정보가 없으므로 빈 배열
    colors: [], // DB에서 colors 정보가 없으므로 빈 배열
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
