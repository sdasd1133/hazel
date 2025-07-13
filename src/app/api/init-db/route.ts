import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Supabase 연결 체크
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        message: 'Supabase environment variables not configured',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey
        }
      }, { status: 500 });
    }

    // 환경변수만 체크하고 성공 응답 (실제 DB 초기화는 별도로)
    return NextResponse.json({ 
      success: true, 
      message: 'Environment configuration OK',
      config: {
        url: supabaseUrl.substring(0, 20) + '...',
        keyLength: supabaseAnonKey.length
      }
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
