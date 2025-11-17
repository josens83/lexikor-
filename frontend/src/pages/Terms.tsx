import { Card, Typography, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const Terms = () => {
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
            <Title level={2}>LexiKor 이용약관</Title>
            <Text type="secondary">최종 수정일: 2024년 1월 1일</Text>
          </div>

          <div style={{ lineHeight: 1.8 }}>
            <Title level={3}>제1조 (목적)</Title>
            <Paragraph>
              본 약관은 LexiKor(이하 "회사")가 제공하는 법률 AI 서비스(이하 "서비스")의 이용과 관련하여
              회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </Paragraph>

            <Title level={3}>제2조 (정의)</Title>
            <Paragraph>
              1. "서비스"란 회사가 제공하는 LexiKor 법률 AI 플랫폼 및 관련 제반 서비스를 의미합니다.<br />
              2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br />
              3. "회원"이란 회사와 서비스 이용계약을 체결하고 아이디를 부여받은 자를 말합니다.<br />
              4. "콘텐츠"란 서비스에서 제공되는 정보, 문서, 데이터 등을 의미합니다.
            </Paragraph>

            <Title level={3}>제3조 (약관의 효력 및 변경)</Title>
            <Paragraph>
              1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력이 발생합니다.<br />
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.<br />
              3. 약관이 변경될 경우, 회사는 변경사항을 시행일자 7일 전부터 공지합니다.
            </Paragraph>

            <Title level={3}>제4조 (서비스의 제공)</Title>
            <Paragraph>
              1. 회사는 다음과 같은 서비스를 제공합니다:<br />
              &nbsp;&nbsp;가. AI 기반 법률 상담 서비스<br />
              &nbsp;&nbsp;나. 법률 문서 분석 및 검토 서비스<br />
              &nbsp;&nbsp;다. 판례 및 법령 검색 서비스<br />
              &nbsp;&nbsp;라. 법률 문서 자동 생성 서비스<br />
              &nbsp;&nbsp;마. 기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 서비스<br />
              2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.<br />
              3. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는
              서비스의 제공을 일시적으로 중단할 수 있습니다.
            </Paragraph>

            <Title level={3}>제5조 (회원가입)</Title>
            <Paragraph>
              1. 이용자는 회사가 정한 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써
              회원가입을 신청합니다.<br />
              2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한
              회원으로 등록합니다:<br />
              &nbsp;&nbsp;가. 등록 내용에 허위, 기재누락, 오기가 있는 경우<br />
              &nbsp;&nbsp;나. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우
            </Paragraph>

            <Title level={3}>제6조 (개인정보보호)</Title>
            <Paragraph>
              회사는 관계법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.
              개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.
            </Paragraph>

            <Title level={3}>제7조 (이용자의 의무)</Title>
            <Paragraph>
              1. 이용자는 다음 행위를 하여서는 안 됩니다:<br />
              &nbsp;&nbsp;가. 신청 또는 변경 시 허위 내용의 등록<br />
              &nbsp;&nbsp;나. 타인의 정보 도용<br />
              &nbsp;&nbsp;다. 회사가 게시한 정보의 변경<br />
              &nbsp;&nbsp;라. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시<br />
              &nbsp;&nbsp;마. 회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해<br />
              &nbsp;&nbsp;바. 회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위<br />
              2. 이용자는 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.
            </Paragraph>

            <Title level={3}>제8조 (서비스 이용제한)</Title>
            <Paragraph>
              회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우,
              경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
            </Paragraph>

            <Title level={3}>제9조 (면책조항)</Title>
            <Paragraph>
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.<br />
              2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.<br />
              3. 본 서비스는 법률 정보 제공 서비스이며, 실제 법률 자문을 대체하지 않습니다. 중요한 법률 문제는 반드시 변호사와 상담하시기 바랍니다.<br />
              4. 회사는 이용자가 서비스를 통해 얻은 정보로 인해 발생한 투자, 계약 등의 결과에 대해 책임을 지지 않습니다.
            </Paragraph>

            <Title level={3}>제10조 (분쟁해결)</Title>
            <Paragraph>
              1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
              피해보상처리기구를 설치·운영합니다.<br />
              2. 본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국 법을 적용하며,
              본 분쟁으로 인한 소는 민사소송법상의 관할법원에 제기합니다.
            </Paragraph>

            <Title level={3}>부칙</Title>
            <Paragraph>
              본 약관은 2024년 1월 1일부터 시행됩니다.
            </Paragraph>

            <div style={{
              marginTop: 40,
              padding: 20,
              background: '#f0f2f5',
              borderRadius: 8
            }}>
              <Text type="secondary">
                문의사항이 있으시면 support@lexikor.ai로 연락주시기 바랍니다.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Terms
