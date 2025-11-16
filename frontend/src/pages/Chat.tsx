import { useState, useEffect, useRef } from 'react'
import { Layout, Input, Button, List, Card, Avatar, Typography, Space, Select, Spin, message, Empty } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { chatAPI } from '../services/api'

const { Content, Sider } = Layout
const { TextArea } = Input
const { Title, Text } = Typography

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  citations?: any[]
  created_at: string
}

interface Conversation {
  id: number
  title: string
  legal_area?: string
  created_at: string
}

const Chat = () => {
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [legalArea, setLegalArea] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(parseInt(conversationId))
      loadMessages(parseInt(conversationId))
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations()
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadMessages = async (convId: number) => {
    setLoading(true)
    try {
      const response = await chatAPI.getMessages(convId)
      setMessages(response.data.messages)
    } catch (error: any) {
      message.error('대화 내역을 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage
    setInputMessage('')
    setSending(true)

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    try {
      const response = await chatAPI.sendMessage({
        message: userMessage,
        conversation_id: currentConversation,
        legal_area: legalArea,
        stream: false
      })

      // Update with actual response
      const newConvId = response.data.conversation_id

      if (!currentConversation) {
        setCurrentConversation(newConvId)
        navigate(`/chat/${newConvId}`)
        await loadConversations()
      }

      // Remove temp message and add real messages
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id)
        return [...withoutTemp, {
          id: tempUserMessage.id,
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        }, {
          id: response.data.message_id,
          role: 'assistant' as const,
          content: response.data.content,
          citations: response.data.citations,
          created_at: response.data.created_at
        }]
      })

    } catch (error: any) {
      message.error(error.response?.data?.detail || '메시지 전송에 실패했습니다')
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
    } finally {
      setSending(false)
    }
  }

  const handleNewChat = () => {
    setCurrentConversation(null)
    setMessages([])
    setLegalArea(undefined)
    navigate('/chat')
  }

  const handleDeleteConversation = async (convId: number) => {
    try {
      await chatAPI.deleteConversation(convId)
      message.success('대화가 삭제되었습니다')
      await loadConversations()
      if (currentConversation === convId) {
        handleNewChat()
      }
    } catch (error) {
      message.error('대화 삭제에 실패했습니다')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider width={300} style={{ background: '#fff', padding: '16px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            block
            size="large"
            onClick={handleNewChat}
          >
            새 대화
          </Button>

          <Select
            placeholder="법률 분야 선택 (선택사항)"
            style={{ width: '100%' }}
            value={legalArea}
            onChange={setLegalArea}
            allowClear
          >
            <Select.Option value="민사">민사</Select.Option>
            <Select.Option value="형사">형사</Select.Option>
            <Select.Option value="상사">상사</Select.Option>
            <Select.Option value="행정">행정</Select.Option>
            <Select.Option value="노동">노동</Select.Option>
            <Select.Option value="가족">가족</Select.Option>
            <Select.Option value="부동산">부동산</Select.Option>
          </Select>

          <div>
            <Title level={5}>최근 대화</Title>
            <List
              dataSource={conversations}
              renderItem={(conv) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: currentConversation === conv.id ? '#e6f7ff' : 'transparent',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                  onClick={() => {
                    setCurrentConversation(conv.id)
                    navigate(`/chat/${conv.id}`)
                    loadMessages(conv.id)
                  }}
                  actions={[
                    <DeleteOutlined
                      key="delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConversation(conv.id)
                      }}
                      style={{ color: '#ff4d4f' }}
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={<Text ellipsis>{conv.title}</Text>}
                    description={conv.legal_area}
                  />
                </List.Item>
              )}
            />
          </div>
        </Space>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px' }}>
          <Card
            title={
              <Space>
                <RobotOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={3} style={{ margin: 0 }}>법률 AI 어시스턴트</Title>
              </Space>
            }
            style={{ height: 'calc(100vh - 48px)' }}
            bodyStyle={{ height: 'calc(100% - 72px)', display: 'flex', flexDirection: 'column' }}
          >
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', marginBottom: '16px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <Spin size="large" />
                </div>
              ) : messages.length === 0 ? (
                <Empty
                  description="새로운 대화를 시작하세요"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Text type="secondary">법률 관련 질문을 입력하시면 AI가 관련 판례와 법령을 인용하여 답변해드립니다.</Text>
                </Empty>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '16px'
                      }}
                    >
                      <Space align="start" size="middle" style={{ maxWidth: '80%' }}>
                        {msg.role === 'assistant' && (
                          <Avatar icon={<RobotOutlined />} style={{ background: '#52c41a' }} />
                        )}
                        <div
                          style={{
                            background: msg.role === 'user' ? '#e6f7ff' : '#f6f6f6',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            borderLeft: msg.role === 'user' ? '3px solid #1890ff' : '3px solid #52c41a'
                          }}
                        >
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {msg.citations && msg.citations.length > 0 && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #d9d9d9' }}>
                              <Text type="secondary" strong>출처:</Text>
                              {msg.citations.map((citation, idx) => (
                                <div key={idx} style={{ marginTop: '4px' }}>
                                  <Text type="secondary">• {citation.reference}</Text>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.role === 'user' && (
                          <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                        )}
                      </Space>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="법률 질문을 입력하세요... (Shift+Enter로 줄바꿈)"
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ flex: 1 }}
                disabled={sending}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={sending}
                disabled={!inputMessage.trim()}
                style={{ height: 'auto' }}
              >
                전송
              </Button>
            </Space.Compact>
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Chat
