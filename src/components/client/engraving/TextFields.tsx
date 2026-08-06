import React, { useState, useEffect } from 'react';
import './styles/EngravingPage.css';

interface Field {
  id: string;
  title: string;
  charLimit: number;
}

interface TextFieldsProps {
  fields: Field[];
  onTextChange?: (fieldId: string, value: string) => void;
  onActivate?: () => void;
}

const TextFields: React.FC<TextFieldsProps> = ({ 
  fields, 
  onTextChange, 
  onActivate 
}) => {
  const [values, setValues] = useState<Map<string, string>>(new Map());

  const handleChange = (fieldId: string, value: string) => {
    // Remover emojis
    const cleaned = removeEmojis(value);
    
    const newValues = new Map(values);
    newValues.set(fieldId, cleaned);
    setValues(newValues);

    if (onTextChange) {
      onTextChange(fieldId, cleaned);
    }

    // Ativar modo texto
    if (cleaned.trim() && onActivate) {
      onActivate();
    }
  };

  const removeEmojis = (text: string): string => {
    // Remover emojis de números com teclado
    text = text.replace(/[0-9#*]\uFE0F?\u20E3/gu, '');
    // Remover emojis em geral
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji}[\u200D\uFE0F])/gu;
    text = text.replace(emojiRegex, '');
    // Remover caracteres combinantes
    text = text.replace(/[\u20E3\uFE0F\u200D]/gu, '');
    return text;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs = document.querySelectorAll<HTMLInputElement>('.text-field-input');
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else {
        // Último campo, submeter
        const submitBtn = document.querySelector('.btn-submit') as HTMLButtonElement;
        if (submitBtn) submitBtn.click();
      }
    }
  };

  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className="text-fields-container">
      {fields.map((field, index) => (
        <div key={field.id} className="field slide-up" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
          <label htmlFor={`field-${field.id}`}>
            {field.title} ({field.charLimit} max)
          </label>
          <input
            type="text"
            id={`field-${field.id}`}
            className="text-field-input"
            maxLength={field.charLimit}
            placeholder={`Digite ${field.title.toLowerCase()}`}
            value={values.get(field.id) || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => {
              if (onActivate) onActivate();
            }}
          />
          <span className="char-counter">
            {(values.get(field.id) || '').length}/{field.charLimit}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TextFields;
