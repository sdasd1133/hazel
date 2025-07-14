import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 먼저 테이블이 존재하는지 확인
    const { data: tableExists, error: checkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: 'users 테이블이 이미 존재합니다.'
      });
    }

    // 테이블이 없다면 SQL로 생성
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login_at TIMESTAMP WITH TIME ZONE,
        order_count INTEGER DEFAULT 0,
        total_spent DECIMAL(12,2) DEFAULT 0.00,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // SQL을 직접 실행하는 대신 Supabase Admin API를 사용
    console.log('테이블 생성을 위해 Supabase Dashboard에서 수동으로 생성해야 합니다.');
    console.log('SQL:', createTableSQL);

    return NextResponse.json({
      success: true,
      message: 'users 테이블 생성 SQL이 준비되었습니다. Supabase Dashboard에서 수동으로 실행해주세요.',
      sql: createTableSQL
    });
  } catch (error) {
    console.error('테이블 확인 중 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
