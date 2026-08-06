import React from 'react'
import { ICONS } from '../../utils/icons'

interface IconSelectorProps {
  selectedIcon: string
  onSelectIcon: (icon: string) => void
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelectIcon }) => {
  return (
    <div className="icon-grid">
      <button
        type="button"
        className={`icon-option ${selectedIcon === '' ? 'selected' : ''}`}
        onClick={() => onSelectIcon('')}
      >
        <span>✖</span>
        <span className="icon-label">Nenhum</span>
      </button>
      
      {ICONS.map((icon) => (
        <button
          key={icon.symbol}
          type="button"
          className={`icon-option ${selectedIcon === icon.symbol ? 'selected' : ''}`}
          onClick={() => onSelectIcon(icon.symbol)}
        >
          <span className="icon-symbol">{icon.symbol}</span>
          <span className="icon-label">{icon.name}</span>
        </button>
      ))}
    </div>
  )
}

export default IconSelector
