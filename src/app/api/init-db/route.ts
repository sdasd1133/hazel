import { NextResponse } from 'next/server';
import { initSupabaseData } from '@/lib/supabase-init';

export async function GET() {
  try {
    const result = await initSupabaseData();
    
    if (result) {
      return NextResponse.json({ success: true, message: 'Supabase database initialized successfully' });
    } else {
      return NextResponse.json(
        { success: false, message: 'Error initializing Supabase database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
