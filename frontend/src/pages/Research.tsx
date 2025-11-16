import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Research = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>법률 검색</Title>
        <p>판례 및 법령 검색 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Research
