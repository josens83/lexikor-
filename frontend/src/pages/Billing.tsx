import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Billing = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>결제 및 구독</Title>
        <p>결제 및 구독 관리 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Billing
