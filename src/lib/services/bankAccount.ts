import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type BankAccount = Database['public']['Tables']['bank_accounts']['Row']
type BankAccountInsert = Database['public']['Tables']['bank_accounts']['Insert']
type BankAccountUpdate = Database['public']['Tables']['bank_accounts']['Update']

export class BankAccountService {
  private supabase = createClient()

  // 모든 계좌 조회
  async getBankAccounts() {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  }

  // 활성화된 계좌만 조회
  async getActiveBankAccounts() {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  }

  // 기본 계좌 조회
  async getDefaultBankAccount() {
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data
  }

  // 계좌 추가
  async createBankAccount(account: Omit<BankAccountInsert, 'id' | 'created_at' | 'updated_at'>) {
    // 첫 번째 계좌는 자동으로 기본 계좌로 설정
    const accounts = await this.getBankAccounts()
    const isDefault = accounts.length === 0 || account.is_default

    if (isDefault) {
      // 기존 기본 계좌를 일반 계좌로 변경
      await this.clearDefaultAccount()
    }

    const { data, error } = await this.supabase
      .from('bank_accounts')
      .insert({
        ...account,
        is_default: isDefault,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // 계좌 수정
  async updateBankAccount(id: number, updates: BankAccountUpdate) {
    if (updates.is_default) {
      // 새로운 기본 계좌로 설정하기 전에 기존 기본 계좌 해제
      await this.clearDefaultAccount()
    }

    const { data, error } = await this.supabase
      .from('bank_accounts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // 계좌 삭제
  async deleteBankAccount(id: number) {
    // 기본 계좌인지 확인
    const { data: account } = await this.supabase
      .from('bank_accounts')
      .select('is_default')
      .eq('id', id)
      .single()

    if (account?.is_default) {
      throw new Error('기본 계좌는 삭제할 수 없습니다. 다른 계좌를 기본으로 설정한 후 삭제해주세요.')
    }

    const { error } = await this.supabase
      .from('bank_accounts')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return true
  }

  // 기본 계좌 설정
  async setDefaultAccount(id: number) {
    // 기존 기본 계좌 해제
    await this.clearDefaultAccount()

    // 새 기본 계좌 설정
    const { data, error } = await this.supabase
      .from('bank_accounts')
      .update({ 
        is_default: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // 계좌 활성화/비활성화
  async toggleAccountStatus(id: number) {
    // 현재 상태 조회
    const { data: account } = await this.supabase
      .from('bank_accounts')
      .select('is_active, is_default')
      .eq('id', id)
      .single()

    if (!account) {
      throw new Error('계좌를 찾을 수 없습니다.')
    }

    // 기본 계좌는 비활성화할 수 없음
    if (account.is_default && account.is_active) {
      throw new Error('기본 계좌는 비활성화할 수 없습니다.')
    }

    const { data, error } = await this.supabase
      .from('bank_accounts')
      .update({ 
        is_active: !account.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // 기존 기본 계좌 해제 (private method)
  private async clearDefaultAccount() {
    await this.supabase
      .from('bank_accounts')
      .update({ 
        is_default: false,
        updated_at: new Date().toISOString()
      })
      .eq('is_default', true)
  }
}

export const bankAccountService = new BankAccountService()
