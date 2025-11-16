import { Layout, Typography } from 'antd'
const { Title } = Typography
const { Content } = Layout

const Chat = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>AI 채팅</Title>
        <p>AI 채팅 기능 (구현 예정)</p>
      </Content>
    </Layout>
  )
}

export default Chat
