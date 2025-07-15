import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('=== 카테고리 테이블 완전 재초기화 시작 ===')

    // 1단계: 기존 카테고리 완전 삭제
    console.log('1. 기존 카테고리 삭제 중...')
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .gte('id', 0) // 모든 레코드 삭제

    if (deleteError) {
      console.error('기존 카테고리 삭제 오류:', deleteError)
    } else {
      console.log('기존 카테고리 삭제 완료')
    }

    // 2단계: 시퀀스 리셋 (PostgreSQL)
    console.log('2. ID 시퀀스 리셋 중...')
    try {
      await supabase.rpc('reset_categories_sequence')
    } catch (seqError) {
      console.log('시퀀스 리셋 함수가 없습니다. 수동으로 ID 설정합니다.')
    }

    // 3단계: 메인 사이트와 완전히 동일한 순서로 카테고리 정의
    const categories = [
      { id: 1, name: '남성의류', slug: 'men-clothing', sort_order: 1 },
      { id: 2, name: '여성의류', slug: 'women-clothing', sort_order: 2 },
      { id: 3, name: '스포츠의류', slug: 'sports-clothing', sort_order: 3 },
      { id: 4, name: '악세사리', slug: 'accessories', sort_order: 4 },
      { id: 5, name: '모자', slug: 'hats', sort_order: 5 },
      { id: 6, name: '가방', slug: 'bags', sort_order: 6 },
      { id: 7, name: '신발', slug: 'shoes', sort_order: 7 },
      { id: 8, name: '시계', slug: 'watches', sort_order: 8 },
      { id: 9, name: '벨트', slug: 'belts', sort_order: 9 },
      { id: 10, name: '깔맞춤', slug: 'coordinated-sets', sort_order: 10 },
      { id: 11, name: '중고명품', slug: 'used-luxury', sort_order: 11 }
    ]

    console.log('3. 새 카테고리 삽입 중...')
    console.log('삽입할 카테고리:', categories)

    // 개별적으로 삽입하여 ID 강제 설정
    const insertedCategories = []
    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()

      if (error) {
        console.error(`카테고리 "${category.name}" 삽입 오류:`, error)
        // ID 충돌 시 upsert 시도
        const { data: upsertData, error: upsertError } = await supabase
          .from('categories')
          .upsert(category, { onConflict: 'id' })
          .select()
          .single()
        
        if (upsertError) {
          console.error(`카테고리 "${category.name}" upsert 오류:`, upsertError)
        } else {
          insertedCategories.push(upsertData)
          console.log(`카테고리 "${category.name}" upsert 성공`)
        }
      } else {
        insertedCategories.push(data)
        console.log(`카테고리 "${category.name}" 삽입 성공`)
      }
    }

    // 4단계: 결과 확인
    const { data: finalCategories, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .order('id')

    if (checkError) {
      console.error('최종 확인 오류:', checkError)
    } else {
      console.log('최종 카테고리 목록:', finalCategories)
    }

    console.log('=== 카테고리 테이블 재초기화 완료 ===')

    return NextResponse.json({
      success: true,
      message: '카테고리 테이블 완전 재초기화 완료',
      data: {
        insertedCount: insertedCategories.length,
        insertedCategories,
        finalCategories
      }
    })

  } catch (error) {
    console.error('카테고리 재초기화 API 오류:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
