import { supabase } from './supabase';
import { logger } from './logger';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  last_login_at?: string;
  order_count?: number;
  total_spent?: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

// 사용자 생성 (회원가입)
export async function createUser(userData: CreateUserData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('사용자 생성 시도:', userData.email);

    // 먼저 이메일 중복 체크
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: '이미 등록된 이메일입니다.'
      };
    }

    // users 테이블에 사용자 정보 저장
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'user',
        status: 'pending', // 기본적으로 승인 대기 상태
        order_count: 0,
        total_spent: 0
      })
      .select()
      .single();

    if (insertError) {
      logger.error('사용자 생성 오류:', insertError);
      return {
        success: false,
        error: `사용자 생성 중 오류가 발생했습니다: ${insertError.message}`
      };
    }

    logger.log('사용자 생성 성공:', newUser);
    return {
      success: true,
      user: newUser as User
    };

  } catch (error) {
    logger.error('사용자 생성 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 모든 사용자 조회 (관리자용)
export async function getAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    logger.log('모든 사용자 조회 시도');

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('사용자 조회 오류:', error);
      return {
        success: false,
        error: `사용자 조회 중 오류가 발생했습니다: ${error.message}`
      };
    }

    logger.log('사용자 조회 성공:', users?.length || 0, '명');
    return {
      success: true,
      users: users as User[]
    };

  } catch (error) {
    logger.error('사용자 조회 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 사용자 상태 업데이트 (승인/거부)
export async function updateUserStatus(userId: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('사용자 상태 업데이트 시도:', userId, status);

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      logger.error('사용자 상태 업데이트 오류:', error);
      return {
        success: false,
        error: `사용자 상태 업데이트 중 오류가 발생했습니다: ${error.message}`
      };
    }

    logger.log('사용자 상태 업데이트 성공:', updatedUser);
    return {
      success: true,
      user: updatedUser as User
    };

  } catch (error) {
    logger.error('사용자 상태 업데이트 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 이메일로 사용자 조회
export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('이메일로 사용자 조회:', email);

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return {
          success: false,
          error: '사용자를 찾을 수 없습니다.'
        };
      }
      logger.error('사용자 조회 오류:', error);
      return {
        success: false,
        error: `사용자 조회 중 오류가 발생했습니다: ${error.message}`
      };
    }

    logger.log('사용자 조회 성공:', user.email);
    return {
      success: true,
      user: user as User
    };

  } catch (error) {
    logger.error('사용자 조회 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 사용자 로그인 시 last_login_at 업데이트
export async function updateLastLogin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      logger.error('마지막 로그인 시간 업데이트 오류:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    logger.error('마지막 로그인 시간 업데이트 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}
