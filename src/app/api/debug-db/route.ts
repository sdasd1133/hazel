import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 모든 상품 조회 (카테고리 정보 포함)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .order('created_at', { ascending: false })

    if (productsError) {
      console.error('Products fetch error:', productsError)
      return NextResponse.json({ 
        success: false, 
        error: productsError.message 
      }, { status: 500 })
    }

    // 모든 카테고리 조회
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (categoriesError) {
      console.error('Categories fetch error:', categoriesError)
      return NextResponse.json({ 
        success: false, 
        error: categoriesError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        products: products || [],
        categories: categories || [],
        productsCount: products?.length || 0,
        categoriesCount: categories?.length || 0,
        // 카테고리별 상품 수 통계
        categoryStats: categories?.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          productCount: products?.filter(p => p.category_id === cat.id).length || 0
        })) || [],
        // 상품별 카테고리 정보
        productDetails: products?.map(p => ({
          id: p.id,
          name: p.name,
          category_id: p.category_id,
          category_name: p.categories?.name || '없음',
          status: p.status
        })) || []
      }
    })

  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
