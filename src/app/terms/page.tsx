export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
            <p className="text-gray-600">최종 수정일: 2025년 1월 10일</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 mb-4">
              이 약관은 GL GOOD LUCK FASHION(이하 "회사")이 운영하는 온라인 쇼핑몰에서 제공하는 
              인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 
              책임사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제2조 (정의)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. "회사"란 GL GOOD LUCK FASHION을 말합니다.</p>
              <p className="mb-2">2. "이용자"란 회사의 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
              <p className="mb-2">3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
              <p className="mb-2">4. "비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제3조 (약관의 명시와 설명 및 개정)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호·모사전송번호·전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보보호책임자 등을 이용자가 쉽게 알 수 있도록 사이트의 초기 서비스화면에 게시합니다.</p>
              <p className="mb-2">2. 회사는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 다음과 같은 업무를 수행합니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
                <li>구매계약이 체결된 재화 또는 용역의 배송</li>
                <li>기타 회사가 정하는 업무</li>
              </ul>
              <p className="mb-2">2. 회사는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제5조 (서비스의 중단)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
              <p className="mb-2">2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제6조 (회원가입)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
              <p className="mb-2">2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제7조 (개인정보보호)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.</p>
              <p className="mb-2">2. 회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</p>
              <p className="mb-2">3. 회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제8조 (계약의 성립)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 다음과 같은 경우에는 승낙하지 않을 수 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우</li>
                <li>기타 구매신청에 승낙하는 것이 회사 기술상 현저히 지장이 있다고 판단하는 경우</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제9조 (결제방법)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각호의 방법중 가용한 방법으로 할 수 있습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌이체</li>
                <li>선불카드, 직불카드, 신용카드 등의 각종 카드 결제</li>
                <li>온라인무통장입금</li>
                <li>전자화폐에 의한 결제</li>
                <li>수령시 대금지급</li>
                <li>마일리지 등 회사가 지급한 포인트에 의한 결제</li>
                <li>기타 전자적 지급 방법에 의한 대금 지급 등</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제10조 (배송)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 이용자와 재화의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다.</p>
              <p className="mb-2">2. 회사는 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제11조 (환급)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">회사는 이용자가 구매신청한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제12조 (청약철회 등)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사와 구매계약을 체결한 이용자는 수신확인의 통지를 받은 날부터 7일 이내에는 청약의 철회를 할 수 있습니다.</p>
              <p className="mb-2">2. 이용자는 재화등을 배송받은 경우 다음 각호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다:</p>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li>이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우</li>
                <li>이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</li>
                <li>시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우</li>
                <li>같은 성능을 지닌 재화등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제13조 (손해배상)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 무료로 제공되는 서비스와 관련하여 회원에게 어떠한 손해가 발생하더라도 동 손해가 회사의 고의 또는 중대한 과실에 기인하지 않는 한 이에 대하여 책임을 부담하지 아니합니다.</p>
              <p className="mb-2">2. 회사가 제공하는 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 회원이 스스로 판단하고 그에 따른 책임을 부담하여야 합니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제14조 (면책조항)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
              <p className="mb-2">2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제15조 (준거법 및 관할법원)</h2>
            <div className="text-gray-700 mb-4">
              <p className="mb-2">1. 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 대한민국 법을 적용합니다.</p>
              <p className="mb-2">2. 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 전속관할로 합니다.</p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                본 약관은 2025년 1월 10일부터 적용됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
