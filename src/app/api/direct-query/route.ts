import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('=== 직접 SQL 쿼리로 상품 확인 ===')

    // 1. 모든 상품의 raw 데이터 확인
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('상품 조회 오류:', allError)
      return NextResponse.json({ success: false, error: allError.message })
    }

    // 2. 모든 카테고리 raw 데이터 확인
    const { data: allCategories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('id')

    if (catError) {
      console.error('카테고리 조회 오류:', catError)
      return NextResponse.json({ success: false, error: catError.message })
    }

    // 3. 특정 카테고리 ID로 상품 직접 조회
    const { data: category4Products, error: cat4Error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 4)

    const { data: category5Products, error: cat5Error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', 5)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        totalProducts: allProducts?.length || 0,
        totalCategories: allCategories?.length || 0,
        
        // 모든 상품 정보
        allProducts: allProducts?.map(p => ({
          id: p.id,
          name: p.name,
          category_id: p.category_id,
          status: p.status,
          created_at: p.created_at
        })) || [],
        
        // 모든 카테고리 정보
        allCategories: allCategories || [],
        
        // 카테고리별 상품 수
        categoryProductCounts: {
          category_4: category4Products?.length || 0,
          category_5: category5Products?.length || 0
        },
        
        // 카테고리 4 상품들 (악세사리)
        category4Products: category4Products?.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status
        })) || [],
        
        // 카테고리 5 상품들 (모자)
        category5Products: category5Products?.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status
        })) || []
      }
    })

  } catch (error) {
    console.error('직접 쿼리 API 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    })
  }
}
