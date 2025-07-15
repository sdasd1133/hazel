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
        categoriesCount: categories?.length || 0
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
