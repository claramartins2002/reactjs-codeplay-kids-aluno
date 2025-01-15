import React, { useState, useEffect } from 'react';
import ReactPainter from 'react-painter';
import './DrawingApp.css';

function DrawingApp() {
  const [isEraser, setIsEraser] = useState(false); // Estado para alternar borracha
  const [lineTexture, setLineTexture] = useState('round'); // Estado para textura do traço

  // Limpeza do áudio quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.title = "Desenho Livre";
    };
  }, []);

  const toggleEraser = (setColor) => {
    setIsEraser((prev) => !prev);
    setColor(isEraser ? '#000000' : '#FFFFFF'); // Alterna entre preto e branco
  };

  const handleLineTexture = (texture, setLineJoin, setLineCap) => {
    setLineTexture(texture);
    setLineJoin(texture === 'round' ? 'round' : 'miter');
    setLineCap(texture);
  };

  return (
    <>
      <ReactPainter
        width={1000}
        height={600}
        render={({ canvas, triggerSave, setColor, setLineWidth, setLineJoin, setLineCap, imageDownloadUrl }) => (
          <div className="drawing-container">
            <h1 className="drawing-title">Desenho Livre</h1>
            <div className="toolbox">
              {/* Cores */}
              <div className="flex">
                <label htmlFor="color">Cores:</label>
                <input
                  id="color"
                  type="color"
                  onChange={(e) => {
                    setColor(e.target.value);
                    setIsEraser(false); // Sai do modo borracha ao alterar cor
                  }}
                />
              </div>

              {/* Tamanho do Pincel */}
              <div className="flex">
                <label htmlFor="brush-size">Tamanho do Pincel:</label>
                <input
                  id="brush-size"
                  type="range"
                  defaultValue="10"
                  min="1"
                  max="50"
                  onChange={(e) => setLineWidth(e.target.value)}
                />
              </div>

              {/* Borracha */}
              <div className="flex">
                <button onClick={() => toggleEraser(setColor)}>
                  {isEraser ? 'Voltar para Pincel' : 'Borracha'}
                </button>
              </div>

              {/* Texturas do Pincel */}
              <div className="flex">
                <label>Texturas:</label>
                <select
                  value={lineTexture}
                  onChange={(e) =>
                    handleLineTexture(e.target.value, setLineJoin, setLineCap)
                  }
                >
                  <option value="round">Redondo</option>
                  <option value="square">Quadrado</option>
                  <option value="butt">Reto</option>
                </select>
              </div>

              {/* Botão de Salvar */}
              <div className="flex">
                {imageDownloadUrl ? (
                  <a href={imageDownloadUrl} download="sketch.png">
                    Download
                  </a>
                ) : (
                  <button onClick={triggerSave}>Salvar</button>
                )}
              </div>
            </div>

            {/* Área de desenho */}
            <div className="awesomeContainer">{canvas}</div>
          </div>
        )}
      />
    </>
  );
}

export default DrawingApp;
