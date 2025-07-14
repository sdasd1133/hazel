import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 간단한 연결 테스트
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (error) {
      console.error('데이터베이스 연결 테스트 실패:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: `연결 실패: ${error.message}`,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      tablesFound: data?.length || 0
    });
  } catch (error) {
    console.error('연결 테스트 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
      },
      { status: 500 }
    );
  }
}
