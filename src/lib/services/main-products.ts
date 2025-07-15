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

      console.log('Fetched products from DB:', data?.length || 0)
      console.log('Raw DB data:', data)
      return data as MainProduct[]
    } catch (error) {
      console.error('Get active products error:', error)
      throw error
    }
  },

  // 카테고리별 상품 조회
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
    // category_id만 있는 경우 매핑 테이블 사용
    const categoryMapping: Record<number, string> = {
      1: '여성의류',
      2: '남성의류',
      3: '스포츠의류',
      4: '가방',
      5: '신발',
      6: '시계',
      7: '모자',
      8: '벨트',
      9: '악세사리',
      10: '깔맞춤',
      11: '중고명품'
    };
    categoryName = categoryMapping[mainProduct.category_id] || '미분류';
  }
  
  console.log(`상품 "${mainProduct.name}" 카테고리 변환:`, {
    categoryId: mainProduct.category_id,
    categoryObject: mainProduct.category,
    finalCategoryName: categoryName
  });
  
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
    console.log('getAllProducts 호출됨')
    const mainProducts = await mainProductService.getActiveProducts()
    console.log('DB에서 가져온 상품 수:', mainProducts.length)
    console.log('DB 상품 데이터:', mainProducts)
    
    const products = convertMainProductsToProducts(mainProducts)
    console.log('변환된 상품 데이터:', products)
    
    return products
  } catch (error) {
    console.error('getAllProducts 오류:', error)
    return []
  }
}

// 여러 MainProduct를 Product 배열로 변환
export const convertMainProductsToProducts = (mainProducts: MainProduct[]): Product[] => {
  return mainProducts.map(convertMainProductToProduct)
}
