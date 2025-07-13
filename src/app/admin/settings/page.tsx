'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Mail, 
  Palette, 
  Shield, 
  Bell, 
  Database, 
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  CreditCard,
  MapPin
} from 'lucide-react';
import { settingsService } from '@/lib/services/settings';
import { bankAccountService } from '@/lib/services/bankAccount';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  userRegistrationNotifications: boolean;
  lowStockNotifications: boolean;
  newsletterEnabled: boolean;
}

interface SecuritySettings {
  passwordMinLength: number;
  requireSpecialCharacters: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  enableTwoFactor: boolean;
}

interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  account_holder: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FooterSettings {
  companyName: string;
  businessNumber: string;
  representative: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  copyrightText: string;
}

const SettingsCard = ({ title, description, children }: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
    {children}
  </div>
);

const Toggle = ({ enabled, onChange, label }: { 
  enabled: boolean; 
  onChange: (value: boolean) => void; 
  label: string;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'accounts' | 'footer' | 'backup'>('general');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 설정 상태
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'GL GOOD LUCK FASHION',
    siteDescription: '프리미엄 패션 쇼핑몰',
    siteUrl: 'https://hazel.com',
    contactEmail: 'contact@hazel.com',
    supportEmail: 'support@hazel.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    userRegistrationNotifications: true,
    lowStockNotifications: true,
    newsletterEnabled: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    requireSpecialCharacters: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '(주)헤이즐',
      isDefault: true,
      isActive: true,
    },
    {
      id: '2',
      bankName: '신한은행',
      accountNumber: '110-123-456789',
      accountHolder: '(주)헤이즐',
      isDefault: false,
      isActive: true,
    },
  ]);

  const [newAccount, setNewAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });

  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    companyName: 'GL GOOD LUCK FASHION',
    businessNumber: '123-45-67890',
    representative: '홍길동',
    address: '부산광역시 동래구 금강공원로33번길 5 3층',
    phone: '02-123-4567',
    email: 'customer@goodluckfashion.com',
    workingHours: '평일 10:00-17:00',
    copyrightText: 'GL GOOD LUCK FASHION. All rights reserved.',
  });

  // 설정 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFooterSettings = localStorage.getItem('footerSettings');
      const savedSiteSettings = localStorage.getItem('siteSettings');
      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      const savedSecuritySettings = localStorage.getItem('securitySettings');
      const savedBankAccounts = localStorage.getItem('bankAccounts');

      if (savedFooterSettings) {
        setFooterSettings(JSON.parse(savedFooterSettings));
      }
      if (savedSiteSettings) {
        setSiteSettings(JSON.parse(savedSiteSettings));
      }
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings));
      }
      if (savedBankAccounts) {
        setBankAccounts(JSON.parse(savedBankAccounts));
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 실제 구현에서는 API 호출
      // 임시로 localStorage에 저장
      localStorage.setItem('footerSettings', JSON.stringify(footerSettings));
      localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
      localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    // 백업 로직
    console.log('백업 시작...');
  };

  const handleRestore = async (file: File) => {
    // 복원 로직
    console.log('복원 시작...', file.name);
  };

  // 계좌 관리 함수들
  const addBankAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountHolder) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const account: BankAccount = {
      id: Date.now().toString(),
      bankName: newAccount.bankName,
      accountNumber: newAccount.accountNumber,
      accountHolder: newAccount.accountHolder,
      isDefault: bankAccounts.length === 0,
      isActive: true,
    };

    setBankAccounts([...bankAccounts, account]);
    setNewAccount({ bankName: '', accountNumber: '', accountHolder: '' });
    setShowAddAccountForm(false);
  };

  const setDefaultAccount = (id: string) => {
    setBankAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isDefault: account.id === id,
      }))
    );
  };

  const toggleAccountStatus = (id: string) => {
    setBankAccounts(accounts =>
      accounts.map(account =>
        account.id === id ? { ...account, isActive: !account.isActive } : account
      )
    );
  };

  const deleteAccount = (id: string) => {
    const account = bankAccounts.find(acc => acc.id === id);
    if (account?.isDefault) {
      alert('기본 계좌는 삭제할 수 없습니다. 다른 계좌를 기본으로 설정한 후 삭제해주세요.');
      return;
    }
    
    if (confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      setBankAccounts(accounts => accounts.filter(acc => acc.id !== id));
    }
  };

  const tabs = [
    { id: 'general' as const, label: '일반', icon: Globe },
    { id: 'notifications' as const, label: '알림', icon: Bell },
    { id: 'security' as const, label: '보안', icon: Shield },
    { id: 'accounts' as const, label: '입금 계좌', icon: CreditCard },
    { id: 'footer' as const, label: '푸터 관리', icon: MapPin },
    { id: 'backup' as const, label: '백업', icon: Database },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">시스템 설정</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all ${
            saving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : saveStatus === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : saveStatus === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : saveStatus === 'success' ? (
            <Check className="h-4 w-4" />
          ) : saveStatus === 'error' ? (
            <X className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? '저장 중...' : saveStatus === 'success' ? '저장됨' : saveStatus === 'error' ? '저장 실패' : '설정 저장'}
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <>
            <SettingsCard
              title="사이트 정보"
              description="웹사이트의 기본 정보를 설정합니다"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사이트 이름
                  </label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사이트 설명
                  </label>
                  <textarea
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사이트 URL
                  </label>
                  <input
                    type="url"
                    value={siteSettings.siteUrl}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="연락처 정보"
              description="고객 지원 및 연락처 이메일을 설정합니다"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    연락처 이메일
                  </label>
                  <input
                    type="email"
                    value={siteSettings.contactEmail}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    고객지원 이메일
                  </label>
                  <input
                    type="email"
                    value={siteSettings.supportEmail}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="시스템 설정"
              description="사이트 운영과 관련된 기본 설정을 관리합니다"
            >
              <div className="space-y-4">
                <Toggle
                  enabled={siteSettings.maintenanceMode}
                  onChange={(value) => setSiteSettings(prev => ({ ...prev, maintenanceMode: value }))}
                  label="유지보수 모드"
                />
                <Toggle
                  enabled={siteSettings.allowRegistration}
                  onChange={(value) => setSiteSettings(prev => ({ ...prev, allowRegistration: value }))}
                  label="신규 회원가입 허용"
                />
                <Toggle
                  enabled={siteSettings.requireEmailVerification}
                  onChange={(value) => setSiteSettings(prev => ({ ...prev, requireEmailVerification: value }))}
                  label="이메일 인증 필수"
                />
              </div>
              {siteSettings.maintenanceMode && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      유지보수 모드가 활성화되면 관리자를 제외한 모든 사용자가 사이트에 접근할 수 없습니다.
                    </span>
                  </div>
                </div>
              )}
            </SettingsCard>
          </>
        )}

        {activeTab === 'notifications' && (
          <SettingsCard
            title="알림 설정"
            description="시스템 알림과 이메일 설정을 관리합니다"
          >
            <div className="space-y-4">
              <Toggle
                enabled={notificationSettings.emailNotifications}
                onChange={(value) => setNotificationSettings(prev => ({ ...prev, emailNotifications: value }))}
                label="이메일 알림 활성화"
              />
              <Toggle
                enabled={notificationSettings.orderNotifications}
                onChange={(value) => setNotificationSettings(prev => ({ ...prev, orderNotifications: value }))}
                label="주문 알림"
              />
              <Toggle
                enabled={notificationSettings.userRegistrationNotifications}
                onChange={(value) => setNotificationSettings(prev => ({ ...prev, userRegistrationNotifications: value }))}
                label="신규 회원가입 알림"
              />
              <Toggle
                enabled={notificationSettings.lowStockNotifications}
                onChange={(value) => setNotificationSettings(prev => ({ ...prev, lowStockNotifications: value }))}
                label="재고 부족 알림"
              />
              <Toggle
                enabled={notificationSettings.newsletterEnabled}
                onChange={(value) => setNotificationSettings(prev => ({ ...prev, newsletterEnabled: value }))}
                label="뉴스레터 서비스"
              />
            </div>
          </SettingsCard>
        )}

        {activeTab === 'security' && (
          <>
            <SettingsCard
              title="비밀번호 정책"
              description="사용자 비밀번호에 대한 보안 정책을 설정합니다"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최소 비밀번호 길이
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 ml-2">글자</span>
                </div>
                <Toggle
                  enabled={securitySettings.requireSpecialCharacters}
                  onChange={(value) => setSecuritySettings(prev => ({ ...prev, requireSpecialCharacters: value }))}
                  label="특수문자 포함 필수"
                />
              </div>
            </SettingsCard>

            <SettingsCard
              title="세션 및 로그인 보안"
              description="사용자 세션과 로그인에 대한 보안 설정입니다"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    세션 만료 시간
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 ml-2">분</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 로그인 시도 횟수
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500 ml-2">회</span>
                </div>
                <Toggle
                  enabled={securitySettings.enableTwoFactor}
                  onChange={(value) => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: value }))}
                  label="2단계 인증 활성화"
                />
              </div>
            </SettingsCard>
          </>
        )}

        {activeTab === 'accounts' && (
          <>
            <SettingsCard
              title="입금 계좌 관리"
              description="고객 결제를 위한 입금 계좌를 관리합니다"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">등록된 계좌</h4>
                  <button
                    onClick={() => setShowAddAccountForm(!showAddAccountForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    계좌 추가
                  </button>
                </div>

                {/* 계좌 추가 폼 */}
                {showAddAccountForm && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-3">새 계좌 추가</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          은행명
                        </label>
                        <input
                          type="text"
                          value={newAccount.bankName}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, bankName: e.target.value }))}
                          placeholder="예: 국민은행"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          계좌번호
                        </label>
                        <input
                          type="text"
                          value={newAccount.accountNumber}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, accountNumber: e.target.value }))}
                          placeholder="123-456-789012"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          예금주
                        </label>
                        <input
                          type="text"
                          value={newAccount.accountHolder}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, accountHolder: e.target.value }))}
                          placeholder="(주)헤이즐"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addBankAccount}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        추가
                      </button>
                      <button
                        onClick={() => {
                          setShowAddAccountForm(false);
                          setNewAccount({ bankName: '', accountNumber: '', accountHolder: '' });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {/* 계좌 목록 */}
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`p-4 border rounded-lg ${
                        account.isDefault 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-gray-900">
                              {account.bankName}
                            </h5>
                            {account.isDefault && (
                              <span className="px-2 py-1 text-xs bg-primary text-white rounded">
                                기본 계좌
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded ${
                              account.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {account.isActive ? '활성' : '비활성'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            계좌번호: {account.accountNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            예금주: {account.accountHolder}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!account.isDefault && (
                            <button
                              onClick={() => setDefaultAccount(account.id)}
                              className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                            >
                              기본 설정
                            </button>
                          )}
                          <button
                            onClick={() => toggleAccountStatus(account.id)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              account.isActive
                                ? 'border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                                : 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                            }`}
                          >
                            {account.isActive ? '비활성화' : '활성화'}
                          </button>
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {bankAccounts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      등록된 계좌가 없습니다. 새 계좌를 추가해주세요.
                    </div>
                  )}
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="계좌 안내사항"
              description="입금 계좌 관리 시 주의사항"
            >
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p>기본 계좌는 고객에게 주문서와 결제 안내에서 우선적으로 표시됩니다.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p>비활성화된 계좌는 고객에게 표시되지 않습니다.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p>기본 계좌를 삭제하려면 먼저 다른 계좌를 기본으로 설정해야 합니다.</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p>계좌 정보는 정확하게 입력해주세요. 잘못된 계좌 정보는 결제 지연을 일으킬 수 있습니다.</p>
                </div>
              </div>
            </SettingsCard>
          </>
        )}

        {activeTab === 'footer' && (
          <>
            <SettingsCard
              title="회사 정보"
              description="푸터에 표시될 회사 기본 정보를 설정합니다"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명
                  </label>
                  <input
                    type="text"
                    value={footerSettings.companyName}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={footerSettings.businessNumber}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, businessNumber: e.target.value }))}
                    placeholder="123-45-67890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표자명
                  </label>
                  <input
                    type="text"
                    value={footerSettings.representative}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, representative: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    저작권 텍스트
                  </label>
                  <input
                    type="text"
                    value={footerSettings.copyrightText}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
                    placeholder="GL GOOD LUCK FASHION. All rights reserved."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사 주소
                  </label>
                  <input
                    type="text"
                    value={footerSettings.address}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="부산광역시 동래구 금강공원로33번길 5 3층"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="연락처 정보"
              description="고객센터 연락처와 영업시간을 설정합니다"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    고객센터 전화번호
                  </label>
                  <input
                    type="text"
                    value={footerSettings.phone}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="02-123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    고객센터 이메일
                  </label>
                  <input
                    type="email"
                    value={footerSettings.email}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="customer@goodluckfashion.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    영업시간
                  </label>
                  <input
                    type="text"
                    value={footerSettings.workingHours}
                    onChange={(e) => setFooterSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                    placeholder="평일 10:00-17:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="푸터 미리보기"
              description="설정한 내용이 실제 푸터에 어떻게 표시되는지 미리 확인할 수 있습니다"
            >
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src="/logo.png"
                        alt={footerSettings.companyName}
                        className="h-10 w-auto"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600">
                        고객센터: {footerSettings.phone} ({footerSettings.workingHours})
                      </p>
                      <p className="text-sm text-gray-600">
                        이메일: {footerSettings.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-700">
                      &copy; {new Date().getFullYear()} {footerSettings.copyrightText}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      사업자등록번호: {footerSettings.businessNumber} | 대표: {footerSettings.representative}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      주소: {footerSettings.address}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    변경사항을 적용하려면 페이지 상단의 "설정 저장" 버튼을 클릭하세요.
                  </span>
                </div>
              </div>
            </SettingsCard>
          </>
        )}

        {activeTab === 'backup' && (
          <>
            <SettingsCard
              title="데이터 백업"
              description="시스템 데이터를 백업하고 관리합니다"
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleBackup}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    백업 생성
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".sql,.json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleRestore(file);
                      }}
                      className="hidden"
                      id="restore-file"
                    />
                    <label
                      htmlFor="restore-file"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      백업 복원
                    </label>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">백업 기록</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium">full_backup_2024_07_13.sql</div>
                        <div className="text-xs text-gray-500">2024년 7월 13일 14:30</div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        다운로드
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="text-sm font-medium">full_backup_2024_07_12.sql</div>
                        <div className="text-xs text-gray-500">2024년 7월 12일 14:30</div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        다운로드
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              title="자동 백업 설정"
              description="정기적인 자동 백업을 설정합니다"
            >
              <div className="space-y-4">
                <Toggle
                  enabled={true}
                  onChange={() => {}}
                  label="자동 백업 활성화"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    백업 주기
                  </label>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    백업 보관 기간
                  </label>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="7">7일</option>
                    <option value="30">30일</option>
                    <option value="90">90일</option>
                    <option value="365">1년</option>
                  </select>
                </div>
              </div>
            </SettingsCard>
          </>
        )}
      </div>
    </div>
  );
}
