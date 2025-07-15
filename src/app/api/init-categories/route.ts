import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('카테고리 테이블 초기화 시작...')

    // 메인 사이트와 동일한 순서로 카테고리 정의
    const categories = [
      { id: 1, name: '남성의류', slug: 'men-clothing' },
      { id: 2, name: '여성의류', slug: 'women-clothing' },
      { id: 3, name: '스포츠의류', slug: 'sports-clothing' },
      { id: 4, name: '악세사리', slug: 'accessories' },
      { id: 5, name: '모자', slug: 'hats' },
      { id: 6, name: '가방', slug: 'bags' },
      { id: 7, name: '신발', slug: 'shoes' },
      { id: 8, name: '시계', slug: 'watches' },
      { id: 9, name: '벨트', slug: 'belts' },
      { id: 10, name: '깔맞춤', slug: 'coordinated-sets' },
      { id: 11, name: '중고명품', slug: 'used-luxury' }
    ]

    // 기존 카테고리 삭제 (있다면)
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', 0) // 모든 레코드 삭제

    if (deleteError) {
      console.error('기존 카테고리 삭제 오류:', deleteError)
    }

    // 새 카테고리 삽입
    const { data, error } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (error) {
      console.error('카테고리 삽입 오류:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    console.log('카테고리 초기화 완료:', data?.length, '개 카테고리 생성')

    return NextResponse.json({
      success: true,
      message: '카테고리 초기화 완료',
      data: data,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('카테고리 초기화 API 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
