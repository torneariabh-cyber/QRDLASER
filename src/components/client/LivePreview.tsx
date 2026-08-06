import React from 'react'

interface LivePreviewProps {
  name: string
  font: string
  icon: string
}

const LivePreview: React.FC<LivePreviewProps> = ({ name, font, icon }) => {
  const displayText = icon ? `${icon} ${name}` : name

  return (
    <div className="live-preview">
      <h4>👀 Prévia</h4>
      <div className="preview-box">
        <span
          id="previewText"
          style={{ fontFamily: `'${font}', sans-serif` }}
        >
          {displayText}
        </span>
      </div>
    </div>
  )
}

export default LivePreview
