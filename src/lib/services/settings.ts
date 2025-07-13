import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Settings = Database['public']['Tables']['settings']['Row']
type SettingsInsert = Database['public']['Tables']['settings']['Insert']

export class SettingsService {
  private supabase = createClient()

  // 설정 조회
  async getSetting(key: string) {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return data
  }

  // 설정 저장/업데이트
  async setSetting(key: string, value: any, description?: string) {
    const { data, error } = await this.supabase
      .from('settings')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }

  // 푸터 설정 조회
  async getFooterSettings() {
    const setting = await this.getSetting('footer_settings')
    return setting?.value || {
      companyName: 'GL GOOD LUCK FASHION',
      businessNumber: '123-45-67890',
      representative: '홍길동',
      address: '부산광역시 동래구 금강공원로33번길 5 3층',
      phone: '02-123-4567',
      email: 'customer@goodluckfashion.com',
      workingHours: '평일 10:00-17:00',
      copyrightText: 'GL GOOD LUCK FASHION. All rights reserved.'
    }
  }

  // 푸터 설정 저장
  async setFooterSettings(footerSettings: any) {
    return this.setSetting('footer_settings', footerSettings, '푸터 설정')
  }

  // 사이트 설정 조회
  async getSiteSettings() {
    const setting = await this.getSetting('site_settings')
    return setting?.value || {
      siteName: 'HAZEL',
      siteDescription: '프리미엄 패션 의류 쇼핑몰',
      siteUrl: 'https://hazel.com',
      contactEmail: 'contact@hazel.com',
      supportEmail: 'support@hazel.com',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true
    }
  }

  // 사이트 설정 저장
  async setSiteSettings(siteSettings: any) {
    return this.setSetting('site_settings', siteSettings, '사이트 설정')
  }

  // 알림 설정 조회
  async getNotificationSettings() {
    const setting = await this.getSetting('notification_settings')
    return setting?.value || {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrationNotifications: true,
      lowStockNotifications: true,
      newsletterEnabled: true
    }
  }

  // 알림 설정 저장
  async setNotificationSettings(notificationSettings: any) {
    return this.setSetting('notification_settings', notificationSettings, '알림 설정')
  }

  // 보안 설정 조회
  async getSecuritySettings() {
    const setting = await this.getSetting('security_settings')
    return setting?.value || {
      passwordMinLength: 8,
      requireSpecialCharacters: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableTwoFactor: false
    }
  }

  // 보안 설정 저장
  async setSecuritySettings(securitySettings: any) {
    return this.setSetting('security_settings', securitySettings, '보안 설정')
  }
}

export const settingsService = new SettingsService()
