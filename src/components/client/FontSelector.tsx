import React, { useState, useRef, useEffect } from 'react'
import { FONTS, getFontsByCategory } from '../../utils/fonts'
import './styles/ClientPage.css'

interface FontSelectorProps {
  selectedFont: string
  onSelectFont: (font: string) => void
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onSelectFont }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedFontData = FONTS.find(f => f.name === selectedFont) || FONTS[0]

  const filteredFonts = FONTS.filter(font =>
    font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    font.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (fontName: string) => {
    onSelectFont(fontName)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="font-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`font-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className="selected-font-display"
          style={{ fontFamily: `'${selectedFontData.name}', sans-serif` }}
        >
          {selectedFontData.name}
        </span>
        <span className="toggle-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="font-dropdown animate-slide-down">
          <div className="font-search">
            <input
              type="text"
              placeholder="🔍 Buscar fonte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="font-grid">
            {filteredFonts.length === 0 ? (
              <div className="font-empty">Nenhuma fonte encontrada</div>
            ) : (
              filteredFonts.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  className={`font-option ${selectedFont === font.name ? 'selected' : ''}`}
                  onClick={() => handleSelect(font.name)}
                >
                  <span 
                    className="font-sample"
                    style={{ fontFamily: `'${font.name}', sans-serif` }}
                  >
                    {font.sample}
                  </span>
                  <span className="font-category">{font.category}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FontSelector
