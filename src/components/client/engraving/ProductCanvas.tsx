import React, { useEffect, useRef, useState } from 'react';
import './styles/EngravingPage.css';

interface ProductCanvasProps {
  config: {
    enabled: boolean;
    svgOverlays?: Array<{
      id: string;
      name: string;
      urls: string[];
      defaultIndex: number;
    }>;
    textFieldConfigs?: Array<{
      fieldId: string;
      fontSize?: number;
      fontFamily?: string;
      position?: { x: number; y: number };
    }>;
  };
  displayImageUrl?: string;
  onSvgSelect?: (overlayId: string, selectedIndex: number) => void;
}

const ProductCanvas: React.FC<ProductCanvasProps> = ({ 
  config, 
  displayImageUrl, 
  onSvgSelect 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCanvas = async () => {
      if (!canvasRef.current || !config.enabled) return;

      try {
        setIsLoading(true);
        setError(null);

        // Carregar scripts necessários
        await loadScript('/js/laserEngraver.js');
        await loadScript('/js/productCanvas.js');

        if (typeof window.initProductCanvas === 'function') {
          window.initProductCanvas(
            config,
            canvasRef.current,
            [],
            displayImageUrl
          );
        } else {
          throw new Error('ProductCanvas script not loaded');
        }
      } catch (err) {
        console.error('Failed to initialize product canvas:', err);
        setError('Não foi possível carregar o canvas do produto.');
      } finally {
        setIsLoading(false);
      }
    };

    initCanvas();

    return () => {
      // Cleanup
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [config, displayImageUrl]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  if (!config.enabled) {
    return null;
  }

  return (
    <div className="product-canvas-wrapper">
      {isLoading && (
        <div className="canvas-loading">
          <div className="loading-spinner"></div>
          <p>Carregando canvas...</p>
        </div>
      )}
      
      {error && (
        <div className="canvas-error">
          <p>{error}</p>
        </div>
      )}

      <div 
        ref={canvasRef} 
        id="productCanvas"
        className={`product-canvas ${isLoading ? 'hidden' : ''}`}
      ></div>
    </div>
  );
};

export default ProductCanvas;
