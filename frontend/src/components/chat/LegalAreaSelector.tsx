/**
 * LegalAreaSelector Component
 * Dropdown for selecting legal practice areas
 *
 * @module components/chat/LegalAreaSelector
 * @lines < 50
 */

import { Select } from 'antd'
import type { LegalAreaSelectorProps, LegalArea } from '@/types/chat'
import { LEGAL_AREAS, LEGAL_AREA_LABELS } from '@/types/chat'

const LegalAreaSelector: React.FC<LegalAreaSelectorProps> = ({
  value,
  onChange,
  size = 'middle',
}) => {
  return (
    <Select
      placeholder="법률 분야 선택 (선택사항)"
      style={{ width: '100%' }}
      value={value}
      onChange={onChange}
      allowClear
      size={size}
    >
      {LEGAL_AREAS.map((area) => (
        <Select.Option key={area} value={area}>
          {LEGAL_AREA_LABELS[area]}
        </Select.Option>
      ))}
    </Select>
  )
}

export default LegalAreaSelector
