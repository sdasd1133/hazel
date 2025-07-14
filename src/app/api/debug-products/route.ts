import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 모든 상품과 카테고리 정보 조회
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Products fetch error:', productsError);
      return NextResponse.json(
        { error: '상품 조회 실패', details: productsError.message },
        { status: 500 }
      );
    }

    // 모든 카테고리 조회
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');

    if (categoriesError) {
      console.error('Categories fetch error:', categoriesError);
      return NextResponse.json(
        { error: '카테고리 조회 실패', details: categoriesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        products: products || [],
        categories: categories || [],
        productsCount: products?.length || 0,
        categoriesCount: categories?.length || 0
      }
    });

  } catch (error) {
    console.error('Debug products error:', error);
    return NextResponse.json(
      { error: '디버깅 조회 실패', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
