import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // 1. 기본 연결 테스트
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (connectionError) {
      console.error('데이터베이스 연결 테스트 실패:', connectionError);
      return NextResponse.json(
        { 
          success: false, 
          error: `연결 실패: ${connectionError.message}`,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
        },
        { status: 500 }
      );
    }

    // 2. users 테이블 존재 확인
    const { data: usersTableTest, error: usersTableError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const usersTableExists = !usersTableError;

    // 3. 기존 테이블 목록 조회
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      usersTableExists,
      usersTableError: usersTableError?.message,
      tablesFound: tables?.length || 0,
      existingTables: tables?.map(t => t.table_name) || []
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
