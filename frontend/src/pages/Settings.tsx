import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Settings = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>설정</Title>
        <p>계정 설정 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Settings
