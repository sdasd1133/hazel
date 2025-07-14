import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // 메인 사이트와 동일한 카테고리 데이터
    const categories = [
      { name: '여성의류', slug: 'women-clothing', sort_order: 1 },
      { name: '남성의류', slug: 'men-clothing', sort_order: 2 },
      { name: '스포츠의류', slug: 'sports-clothing', sort_order: 3 },
      { name: '가방', slug: 'bags', sort_order: 4 },
      { name: '신발', slug: 'shoes', sort_order: 5 },
      { name: '시계', slug: 'watches', sort_order: 6 },
      { name: '모자', slug: 'hats', sort_order: 7 },
      { name: '벨트', slug: 'belts', sort_order: 8 },
      { name: '악세사리', slug: 'accessories', sort_order: 9 },
      { name: '깔맞춤', slug: 'coordinated-sets', sort_order: 10 },
      { name: '중고명품', slug: 'used-luxury', sort_order: 11 }
    ];

    // 기존 카테고리 확인
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('slug');

    if (checkError) {
      console.error('Categories check error:', checkError);
      return NextResponse.json(
        { error: '카테고리 확인 실패', details: checkError.message },
        { status: 500 }
      );
    }

    const existingSlugs = existingCategories?.map(cat => cat.slug) || [];

    // 존재하지 않는 카테고리만 필터링
    const newCategories = categories.filter(cat => !existingSlugs.includes(cat.slug));

    if (newCategories.length === 0) {
      return NextResponse.json({
        success: true,
        message: '모든 카테고리가 이미 존재합니다.',
        existingCount: existingCategories?.length || 0
      });
    }

    // 새 카테고리 삽입
    const { data, error } = await supabase
      .from('categories')
      .insert(newCategories.map(cat => ({
        ...cat,
        is_active: true
      })))
      .select();

    if (error) {
      console.error('Categories insert error:', error);
      return NextResponse.json(
        { error: '카테고리 생성 실패', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: `${newCategories.length}개의 새 카테고리가 생성되었습니다.`,
      createdCount: newCategories.length,
      existingCount: existingSlugs.length
    });

  } catch (error) {
    console.error('Init categories API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
