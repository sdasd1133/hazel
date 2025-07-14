// 로컬 스토리지와 Supabase 데이터베이스를 모두 지원하는 혼합 사용자 관리 시스템
import { logger } from './logger';
import { supabase } from './supabase';

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

// 로컬 스토리지 키
const USERS_STORAGE_KEY = 'hazel_users';

// 로컬 스토리지에서 사용자 목록 가져오기
function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error('저장된 사용자 데이터 읽기 오류:', error);
    return [];
  }
}

// 로컬 스토리지에 사용자 목록 저장
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    logger.error('사용자 데이터 저장 오류:', error);
  }
}

// Supabase 데이터베이스가 사용 가능한지 확인
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (error) {
    logger.log('Supabase users 테이블을 사용할 수 없습니다. 로컬 스토리지를 사용합니다.');
    return false;
  }
}

// 초기 테스트 데이터 생성
function initializeTestData(): User[] {
  const testUsers: User[] = [
    {
      id: '1',
      name: '관리자',
      email: 'admin@hazel.com',
      role: 'admin',
      status: 'approved',
      created_at: '2023-12-01T00:00:00Z',
      last_login_at: new Date().toISOString(),
      order_count: 0,
      total_spent: 0
    },
    {
      id: '2',
      name: '테스트 사용자',
      email: 'test@hazel.com',
      role: 'user',
      status: 'approved',
      created_at: '2024-01-15T00:00:00Z',
      last_login_at: '2024-07-13T00:00:00Z',
      order_count: 5,
      total_spent: 250000
    },
    {
      id: '3',
      name: '승인 대기 사용자',
      email: 'pending@hazel.com',
      role: 'user',
      status: 'pending',
      created_at: '2024-07-14T00:00:00Z',
      order_count: 0,
      total_spent: 0
    }
  ];
  
  saveUsers(testUsers);
  return testUsers;
}

// 사용자 생성 (회원가입) - 로컬 스토리지에 저장
export async function createUser(userData: CreateUserData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('사용자 생성 시도:', userData.email);

    const users = getStoredUsers();
    
    // 이메일 중복 체크
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        error: '이미 등록된 이메일입니다.'
      };
    }

    // 새 사용자 생성 (로컬 스토리지에 저장)
    const newUser: User = {
      id: Date.now().toString(), // 임시 ID 생성
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'user',
      status: 'pending',
      created_at: new Date().toISOString(),
      order_count: 0,
      total_spent: 0
    };

    // 사용자 목록에 추가하고 저장
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    logger.log('사용자 생성 성공 (로컬 스토리지):', newUser);
    return {
      success: true,
      user: newUser
    };

  } catch (error) {
    logger.error('사용자 생성 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// Supabase 데이터베이스에 사용자 등록 (승인 시 호출)
async function registerToSupabase(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        order_count: user.order_count || 0,
        total_spent: user.total_spent || 0
      })
      .select()
      .single();

    if (insertError) {
      logger.error('Supabase 사용자 등록 오류:', insertError);
      return {
        success: false,
        error: `Supabase 등록 중 오류가 발생했습니다: ${insertError.message}`
      };
    }

    logger.log('Supabase 사용자 등록 성공:', newUser);
    return { success: true };

  } catch (error) {
    logger.error('Supabase 사용자 등록 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Supabase 등록 중 알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 모든 사용자 조회 (관리자용)
export async function getAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    logger.log('모든 사용자 조회 시도');

    // 먼저 Supabase가 사용 가능한지 확인
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      // Supabase에서 사용자 조회
      const { data: supabaseUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && supabaseUsers) {
        logger.log('Supabase에서 사용자 조회 성공:', supabaseUsers.length, '명');
        
        // 로컬 스토리지의 사용자들도 함께 반환 (승인 대기 중인 사용자들)
        const localUsers = getStoredUsers();
        const pendingUsers = localUsers.filter(user => user.status === 'pending');
        
        const allUsers = [...supabaseUsers as User[], ...pendingUsers];
        
        return {
          success: true,
          users: allUsers
        };
      }
    }

    // Supabase가 사용 불가능하거나 오류가 발생한 경우 로컬 스토리지 사용
    let users = getStoredUsers();
    
    // 첫 실행 시 테스트 데이터 초기화
    if (users.length === 0) {
      users = initializeTestData();
    }

    logger.log('로컬 스토리지에서 사용자 조회 성공:', users.length, '명');
    return {
      success: true,
      users: users
    };

  } catch (error) {
    logger.error('사용자 조회 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 사용자 상태 업데이트 (승인/거부) - 승인 시 Supabase에 자동 등록
export async function updateUserStatus(userId: string, status: 'approved' | 'rejected'): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('사용자 상태 업데이트 시도:', userId, status);

    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    // 사용자 상태 업데이트
    users[userIndex] = {
      ...users[userIndex],
      status
    };

    // 승인된 경우 Supabase 데이터베이스에 자동 등록
    if (status === 'approved') {
      const supabaseAvailable = await isSupabaseAvailable();
      
      if (supabaseAvailable) {
        const registerResult = await registerToSupabase(users[userIndex]);
        
        if (registerResult.success) {
          logger.log('사용자가 승인되어 Supabase에 자동 등록되었습니다:', users[userIndex].email);
          
          // 로컬 스토리지에서 제거 (이제 Supabase에서 관리)
          const updatedUsers = users.filter(user => user.id !== userId);
          saveUsers(updatedUsers);
          
          return {
            success: true,
            user: users[userIndex]
          };
        } else {
          logger.error('Supabase 등록 실패:', registerResult.error);
          // 실패해도 로컬에서는 승인 상태 유지
        }
      }
    }

    // 로컬 스토리지 업데이트
    saveUsers(users);

    logger.log('사용자 상태 업데이트 성공:', users[userIndex]);
    return {
      success: true,
      user: users[userIndex]
    };

  } catch (error) {
    logger.error('사용자 상태 업데이트 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}

// 이메일로 사용자 조회 (로컬 + Supabase)
export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('이메일로 사용자 조회:', email);

    // 먼저 Supabase에서 조회
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!error && user) {
        logger.log('Supabase에서 사용자 조회 성공:', user.email);
        return {
          success: true,
          user: user as User
        };
      }
    }

    // Supabase에서 찾지 못한 경우 로컬 스토리지에서 조회
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    logger.log('로컬 스토리지에서 사용자 조회 성공:', user.email);
    return {
      success: true,
      user: user
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
    // 먼저 Supabase에서 업데이트 시도
    const supabaseAvailable = await isSupabaseAvailable();
    
    if (supabaseAvailable) {
      const { error } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      if (!error) {
        logger.log('Supabase에서 마지막 로그인 시간 업데이트 성공');
        return { success: true };
      }
    }

    // Supabase 업데이트 실패 시 로컬 스토리지에서 업데이트
    const users = getStoredUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    users[userIndex] = {
      ...users[userIndex],
      last_login_at: new Date().toISOString()
    };

    saveUsers(users);
    return { success: true };
  } catch (error) {
    logger.error('마지막 로그인 시간 업데이트 중 예외 발생:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
}
