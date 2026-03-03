import React, { useState } from 'react';
import './IntegralAccessLevel.css';

function IntegralAccessLevel() {
  const [hintText, setHintText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const hintContent = "Use Integration by Parts twice. Let u = (ln x)² and dv = dx for the first pass.";

  const typeEffect = () => {
    if (isTyping) return;
    setIsTyping(true);
    setHintText('');
    let i = 0;

    const type = () => {
      if (i < hintContent.length) {
        setHintText(prev => prev + hintContent.charAt(i));
        i++;
        setTimeout(type, 40);
      } else {
        setIsTyping(false);
      }
    };
    type();
  };

  return (
    <div className="level-omega-container">
      <h1>INTEGRAL ACCESS – LEVEL OMEGA</h1>
      
      <div className="problem">
        Compute:<br />
        I = ∫<sub>1</sub><sup>e</sup> (ln x)<sup>2</sup> dx
      </div>

      <div className="hint-section">
        <button 
          id="btn-hint" 
          className="level-button"
          onClick={typeEffect}
          disabled={isTyping}
        >
          [ DECRYPT HINT ]
        </button>
        <div className="hint-text" id="text-hint">
          {hintText && (
            <>
              {hintText}
              {isTyping && <span className="cursor"></span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntegralAccessLevel;
