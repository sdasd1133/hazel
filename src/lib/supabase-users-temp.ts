// 임시 사용자 데이터를 위한 로컬 스토리지 헬퍼
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

// 사용자 생성 (회원가입)
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

    // 새 사용자 생성
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

    logger.log('사용자 생성 성공:', newUser);
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

// 모든 사용자 조회 (관리자용)
export async function getAllUsers(): Promise<{ success: boolean; users?: User[]; error?: string }> {
  try {
    logger.log('모든 사용자 조회 시도');

    let users = getStoredUsers();
    
    // 첫 실행 시 테스트 데이터 초기화
    if (users.length === 0) {
      users = initializeTestData();
    }

    logger.log('사용자 조회 성공:', users.length, '명');
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

// 사용자 상태 업데이트 (승인/거부)
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

// 이메일로 사용자 조회
export async function getUserByEmail(email: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    logger.log('이메일로 사용자 조회:', email);

    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      };
    }

    logger.log('사용자 조회 성공:', user.email);
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
