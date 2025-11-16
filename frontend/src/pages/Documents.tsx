import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Documents = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>문서 관리</Title>
        <p>문서 업로드 및 관리 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Documents
