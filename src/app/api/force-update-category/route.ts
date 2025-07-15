import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { productId, categoryId } = await request.json()
    
    console.log('강제 카테고리 업데이트:', { productId, categoryId })

    // 상품의 카테고리 강제 업데이트
    const { data, error } = await supabase
      .from('products')
      .update({ category_id: categoryId })
      .eq('id', productId)
      .select()

    if (error) {
      console.error('카테고리 업데이트 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      })
    }

    console.log('카테고리 업데이트 완료:', data)

    return NextResponse.json({
      success: true,
      message: '카테고리가 업데이트되었습니다',
      data: data
    })

  } catch (error) {
    console.error('강제 업데이트 API 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    })
  }
}
