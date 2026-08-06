import React, { useState, useEffect } from 'react';
import './styles/EngravingPage.css';

interface SvgOverlay {
  id: string;
  name: string;
  urls: string[];
  defaultIndex: number;
}

interface SvgSelectorProps {
  svgOverlays: SvgOverlay[];
  onSelect?: (overlayId: string, selectedIndex: number) => void;
  mode?: 'text' | 'graphics' | 'both' | 'exclusive';
  activeMode?: 'text' | 'graphics' | null;
  onActivate?: () => void;
}

const SvgSelector: React.FC<SvgSelectorProps> = ({
  svgOverlays,
  onSelect,
  mode = 'both',
  activeMode = null,
  onActivate
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Map<string, number>>(
    new Map(svgOverlays.map(overlay => [overlay.id, overlay.defaultIndex || 0]))
  );
  const [expanded, setExpanded] = useState(true);

  // Se o modo for exclusivo e não estiver ativo, colapsar
  useEffect(() => {
    if (mode === 'exclusive' && activeMode !== 'graphics') {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [mode, activeMode]);

  const handleSelect = (overlayId: string, index: number) => {
    const newSelections = new Map(selectedOptions);
    newSelections.set(overlayId, index);
    setSelectedOptions(newSelections);

    if (onSelect) {
      onSelect(overlayId, index);
    }

    // Ativar modo gráfico
    if (mode === 'exclusive' && onActivate) {
      onActivate();
    }
  };

  const toggleExpand = () => {
    if (mode === 'exclusive') {
      setExpanded(!expanded);
      if (!expanded && onActivate) {
        onActivate();
      }
    }
  };

  // Verificar se há opções múltiplas
  const hasMultipleOptions = svgOverlays.some(overlay => overlay.urls.length > 1);

  if (!hasMultipleOptions) {
    return null;
  }

  return (
    <div className={`svg-selector-container slide-up animation-delay-1 ${!expanded ? 'collapsed' : ''}`}>
      <button 
        type="button" 
        className="svg-selector-toggle"
        onClick={toggleExpand}
      >
        {expanded ? '▼' : '▶'} Opções Gráficas
      </button>

      {expanded && (
        <div className="svg-selector-grid">
          {svgOverlays.map((overlay) => (
            overlay.urls.length > 1 && (
              <div key={overlay.id} className="svg-option-group">
                <label className="svg-option-label">{overlay.name}</label>
                <div className="svg-option-buttons">
                  {overlay.urls.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`svg-option-btn ${selectedOptions.get(overlay.id) === index ? 'selected' : ''}`}
                      onClick={() => handleSelect(overlay.id, index)}
                    >
                      <img 
                        src={url} 
                        alt={`${overlay.name} ${index + 1}`}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <span className="svg-option-number">{index + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SvgSelector;
