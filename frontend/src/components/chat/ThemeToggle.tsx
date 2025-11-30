/**
 * ThemeToggle Component
 * Toggle button for dark/light mode
 *
 * @module components/chat/ThemeToggle
 * @lines < 50
 */

import { Button, Tooltip, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { SunOutlined, MoonOutlined, SettingOutlined } from '@ant-design/icons'
import { useTheme, type ThemeMode } from '@/hooks/useTheme'

const ThemeToggle: React.FC = () => {
  const { mode, isDark, setTheme, toggleTheme } = useTheme()

  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: '라이트 모드',
      icon: <SunOutlined />,
      onClick: () => setTheme('light'),
    },
    {
      key: 'dark',
      label: '다크 모드',
      icon: <MoonOutlined />,
      onClick: () => setTheme('dark'),
    },
    {
      key: 'system',
      label: '시스템 설정',
      icon: <SettingOutlined />,
      onClick: () => setTheme('system'),
    },
  ]

  return (
    <Dropdown menu={{ items, selectedKeys: [mode] }} trigger={['click']}>
      <Tooltip title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}>
        <Button
          type="text"
          icon={isDark ? <MoonOutlined /> : <SunOutlined />}
          onClick={(e) => {
            e.preventDefault()
            toggleTheme()
          }}
          aria-label="테마 변경"
        />
      </Tooltip>
    </Dropdown>
  )
}

export default ThemeToggle
