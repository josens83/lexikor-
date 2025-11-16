import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Templates = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>문서 템플릿</Title>
        <p>법률 문서 템플릿 생성 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Templates
