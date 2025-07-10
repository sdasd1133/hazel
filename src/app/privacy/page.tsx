export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
            <p className="text-gray-600">최종 수정일: 2025년 1월 10일</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. 개인정보의 처리목적</h2>
            <p className="text-gray-700 mb-4">
              GL GOOD LUCK FASHION은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 
              다음 목적 이외의 용도로는 이용하지 않습니다.
            </p>
            <ul className="list-disc list-inside ml-4 mb-4 text-gray-700">
              <li>고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
              <li>물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의 공급·배송</li>
              <li>고충처리 목적으로서의 고충인의 신원 확인, 고충사항 확인, 사실조사를 위한 연락·통지</li>
              <li>신규 서비스 개발 및 특화, 이벤트 등 광고성 정보 전달, 인구통계학적 특성에 따른 서비스 제공</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. 개인정보의 처리 및 보유기간</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              <p className="mb-2">구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>회원가입 및 관리: 회원 탈퇴시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지)</li>
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                <li>표시·광고에 관한 기록: 6개월</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. 개인정보의 제3자 제공</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              <p className="mb-2">회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>배송업체: 상품 배송을 위한 목적으로 이름, 주소, 연락처 제공</li>
                <li>결제대행업체: 결제 처리를 위한 목적으로 필요한 최소한의 정보 제공</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. 개인정보처리 위탁</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>배송업체: 상품 배송 서비스</li>
                <li>SMS 발송업체: 주문 및 배송 알림 서비스</li>
                <li>결제대행업체: 신용카드 결제 및 현금영수증 발행</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. 정보주체의 권리·의무 및 그 행사방법</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 정정·삭제 요구</li>
                <li>손해배상 요구</li>
              </ul>
              <p className="mb-2">위의 권리 행사는 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. 처리하는 개인정보의 항목</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <p className="mb-2 font-medium">필수항목:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>이름, 이메일, 비밀번호</li>
                <li>배송지 정보 (주문시)</li>
                <li>결제 정보 (주문시)</li>
              </ul>
              <p className="mb-2 font-medium">선택항목:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>연락처, 생년월일</li>
                <li>마케팅 수신 동의 여부</li>
              </ul>
              <p className="mb-2 font-medium">자동 수집 항목:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>접속 IP 정보, 쿠키, 접속 기록</li>
                <li>서비스 이용 기록, 접속 로그</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. 개인정보의 파기</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다.</p>
              <p className="mb-2">파기의 절차, 기한 및 방법은 다음과 같습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
                <li>파기기한: 이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에 파기합니다.</li>
                <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. 개인정보 보호책임자</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-1"><strong>개인정보 보호책임자</strong></p>
                <p className="mb-1">성명: 홍길동</p>
                <p className="mb-1">직책: 개인정보관리팀장</p>
                <p className="mb-1">연락처: 02-123-4567</p>
                <p className="mb-1">이메일: privacy@goodluckfashion.com</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. 개인정보의 안전성 확보조치</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보를 보관하는 DB서버 등의 접근권한의 제한</li>
                <li>물리적 보관 장소의 잠금장치 설치</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. 쿠키의 설치·운영 및 거부</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 쿠키를 사용합니다.</p>
              <p className="mb-2">쿠키는 웹사이트를 운영하는데 이용되는 서버가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. 개인정보 처리방침 변경</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-2">개인정보 관련 문의</h3>
                <p className="text-blue-800 mb-2">
                  개인정보와 관련하여 궁금한 사항이 있으시면 언제든지 연락주세요.
                </p>
                <div className="space-y-1 text-blue-700">
                  <p>📞 고객센터: 02-123-4567</p>
                  <p>📧 이메일: privacy@goodluckfashion.com</p>
                  <p>🕒 운영시간: 평일 10:00-17:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                본 방침은 2025년 1월 10일부터 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
