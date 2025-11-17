import { Card, Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const Privacy = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 20 }}
        >
          뒤로가기
        </Button>

        <Card>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Title level={2}>개인정보 처리방침</Title>
            <Text type="secondary">최종 수정일: 2024년 1월 1일</Text>
          </div>

          <div style={{ lineHeight: 1.8 }}>
            <Paragraph>
              LexiKor(이하 "회사")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률,
              개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고
              원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </Paragraph>

            <Title level={3}>제1조 (개인정보의 수집 항목 및 방법)</Title>
            <Paragraph>
              1. 회사는 다음과 같은 개인정보를 수집하고 있습니다:<br />
              <br />
              가. 필수 수집 항목<br />
              &nbsp;&nbsp;- 이메일 주소<br />
              &nbsp;&nbsp;- 비밀번호 (암호화하여 저장)<br />
              &nbsp;&nbsp;- 이름<br />
              <br />
              나. 선택 수집 항목<br />
              &nbsp;&nbsp;- 전화번호<br />
              &nbsp;&nbsp;- 회사/조직명<br />
              <br />
              다. 서비스 이용 과정에서 자동으로 수집되는 정보<br />
              &nbsp;&nbsp;- IP 주소<br />
              &nbsp;&nbsp;- 쿠키<br />
              &nbsp;&nbsp;- 서비스 이용 기록<br />
              &nbsp;&nbsp;- 접속 로그<br />
              &nbsp;&nbsp;- 결제 기록<br />
              <br />
              2. 개인정보 수집 방법<br />
              &nbsp;&nbsp;- 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력<br />
              &nbsp;&nbsp;- 제휴 서비스로부터의 제공<br />
              &nbsp;&nbsp;- 생성정보 수집 툴을 통한 자동 수집
            </Paragraph>

            <Title level={3}>제2조 (개인정보의 수집 및 이용목적)</Title>
            <Paragraph>
              회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:<br />
              <br />
              1. 서비스 제공에 관한 계약 이행<br />
              &nbsp;&nbsp;- AI 법률 상담 서비스 제공<br />
              &nbsp;&nbsp;- 문서 분석 및 생성 서비스 제공<br />
              &nbsp;&nbsp;- 콘텐츠 제공<br />
              &nbsp;&nbsp;- 본인 인증<br />
              <br />
              2. 회원 관리<br />
              &nbsp;&nbsp;- 회원제 서비스 이용에 따른 본인확인<br />
              &nbsp;&nbsp;- 개인식별<br />
              &nbsp;&nbsp;- 불량회원의 부정 이용 방지<br />
              &nbsp;&nbsp;- 가입의사 확인<br />
              &nbsp;&nbsp;- 분쟁 조정을 위한 기록 보존<br />
              &nbsp;&nbsp;- 불만처리 등 민원처리<br />
              <br />
              3. 마케팅 및 광고에 활용<br />
              &nbsp;&nbsp;- 신규 서비스 개발 및 맞춤 서비스 제공<br />
              &nbsp;&nbsp;- 이벤트 및 광고성 정보 제공<br />
              &nbsp;&nbsp;- 서비스의 유효성 확인<br />
              <br />
              4. 결제 서비스 제공<br />
              &nbsp;&nbsp;- 구매 및 요금 결제<br />
              &nbsp;&nbsp;- 청구서 발송
            </Paragraph>

            <Title level={3}>제3조 (개인정보의 보유 및 이용기간)</Title>
            <Paragraph>
              1. 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
              동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.<br />
              <br />
              2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:<br />
              &nbsp;&nbsp;- 회원 가입 정보: 회원 탈퇴 시까지<br />
              &nbsp;&nbsp;- 단, 관련 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지<br />
              <br />
              3. 관련 법령에 의한 정보보유 사유<br />
              &nbsp;&nbsp;가. 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
              &nbsp;&nbsp;나. 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
              &nbsp;&nbsp;다. 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)<br />
              &nbsp;&nbsp;라. 웹사이트 방문 기록: 3개월 (통신비밀보호법)
            </Paragraph>

            <Title level={3}>제4조 (개인정보의 제3자 제공)</Title>
            <Paragraph>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:<br />
              <br />
              1. 이용자들이 사전에 동의한 경우<br />
              2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
            </Paragraph>

            <Title level={3}>제5조 (개인정보처리의 위탁)</Title>
            <Paragraph>
              회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라
              위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다:<br />
              <br />
              - 결제 처리: Stripe, Toss Payments<br />
              - 이메일 발송: SendGrid<br />
              - 클라우드 서비스: AWS
            </Paragraph>

            <Title level={3}>제6조 (이용자의 권리와 행사방법)</Title>
            <Paragraph>
              1. 이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있습니다.<br />
              2. 이용자는 언제든지 회원 탈퇴를 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.<br />
              3. 권리 행사는 설정 페이지에서 직접 하거나, 개인정보보호책임자에게 서면, 전화, 이메일로 연락하시면
              지체 없이 조치하겠습니다.
            </Paragraph>

            <Title level={3}>제7조 (개인정보의 파기)</Title>
            <Paragraph>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다.<br />
              <br />
              파기절차 및 방법은 다음과 같습니다:<br />
              1. 파기절차: 불필요한 개인정보는 개인정보보호책임자의 책임 하에 내부방침 절차에 따라 파기합니다.<br />
              2. 파기방법<br />
              &nbsp;&nbsp;- 전자적 파일: 복원이 불가능한 방법으로 영구 삭제<br />
              &nbsp;&nbsp;- 종이 문서: 분쇄기로 분쇄하거나 소각
            </Paragraph>

            <Title level={3}>제8조 (개인정보 보호책임자)</Title>
            <Paragraph>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
              피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:<br />
              <br />
              개인정보 보호책임자<br />
              - 이메일: privacy@lexikor.ai<br />
              - 전화: 02-1234-5678
            </Paragraph>

            <Title level={3}>제9조 (개인정보의 안전성 확보조치)</Title>
            <Paragraph>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:<br />
              <br />
              1. 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등<br />
              2. 기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화,
              보안프로그램 설치<br />
              3. 물리적 조치: 전산실, 자료보관실 등의 접근통제
            </Paragraph>

            <Title level={3}>제10조 (개인정보 처리방침 변경)</Title>
            <Paragraph>
              이 개인정보 처리방침은 2024년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </Paragraph>

            <div style={{
              marginTop: 40,
              padding: 20,
              background: '#f0f2f5',
              borderRadius: 8
            }}>
              <Text type="secondary">
                개인정보 관련 문의사항이 있으시면 privacy@lexikor.ai로 연락주시기 바랍니다.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Privacy
