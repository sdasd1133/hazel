import { supabase } from '@/lib/supabase'

export interface Product {
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
  weight?: number
  dimensions?: { width?: number; height?: number; depth?: number }
  featured: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  sale_price?: number
  stock_quantity: number
  category_id?: number | null
  sku?: string
  images?: string[]
  tags?: string[]
  status?: 'active' | 'inactive' | 'draft' | 'out_of_stock'
  weight?: number
  dimensions?: { width?: number; height?: number; depth?: number }
  featured?: boolean
  meta_title?: string
  meta_description?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number
}

// 클라이언트 사이드 상품 서비스
export const productClient = {
  // 모든 상품 조회
  async getProducts(filters?: {
    category_id?: number
    status?: string
    featured?: boolean
    limit?: number
    offset?: number
  }) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(id, name, slug)
        `)
        .order('created_at', { ascending: false })

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }
      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Products fetch error:', error);
        throw new Error(`상품 조회 실패: ${error.message}`);
      }
      
      console.log('Products fetched successfully:', data?.length || 0, 'items');
      return data as (Product & { categories?: { id: number; name: string; slug: string } })[]
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // 단일 상품 조회
  async getProduct(id: number) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Product & { categories?: { id: number; name: string; slug: string } }
  },

  // 상품 생성
  async createProduct(productData: CreateProductData) {
    console.log('Creating product with data:', productData);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
          images: productData.images || [],
          tags: productData.tags || [],
          status: productData.status || 'draft',
          featured: productData.featured || false,
          stock_quantity: productData.stock_quantity || 0
        })
        .select()
        .single()

      if (error) {
        console.error('Product creation error:', error);
        throw new Error(`상품 생성 실패: ${error.message}`);
      }
      
      console.log('Product created successfully:', data);
      return data as Product
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // 상품 수정
  async updateProduct(productData: UpdateProductData) {
    console.log('Updating product with data:', productData);
    
    const { id, ...updateData } = productData
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Product update error:', error);
        throw new Error(`상품 수정 실패: ${error.message}`);
      }
      
      console.log('Product updated successfully:', data);
      return data as Product
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // 상품 삭제
  async deleteProduct(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // 재고 업데이트
  async updateStock(id: number, quantity: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        stock_quantity: quantity,
        status: quantity > 0 ? 'active' : 'out_of_stock',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  }
}
