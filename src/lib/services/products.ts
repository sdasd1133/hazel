import { createClient } from '@/lib/supabase/client'

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  sale_price?: number
  stock_quantity: number
  category_id?: number
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
  category_id?: number
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
    const supabase = createClient()
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

    if (error) throw error
    return data as (Product & { categories?: { id: number; name: string; slug: string } })[]
  },

  // 단일 상품 조회
  async getProduct(id: number) {
    const supabase = createClient()
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
    const supabase = createClient()
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

    if (error) throw error
    return data as Product
  },

  // 상품 수정
  async updateProduct(productData: UpdateProductData) {
    const supabase = createClient()
    const { id, ...updateData } = productData
    
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Product
  },

  // 상품 삭제
  async deleteProduct(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // 재고 업데이트
  async updateStock(id: number, quantity: number) {
    const supabase = createClient()
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
