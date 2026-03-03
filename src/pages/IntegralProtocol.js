import React, { useEffect, useState } from 'react';
import './IntegralProtocol.css';

function IntegralProtocol() {
  const [isRevealing, setIsRevealing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedSteps, setDisplayedSteps] = useState([]);
  const [showCursor, setShowCursor] = useState(false);

  const steps = [
    "Let: u = (ln x)<sup>2</sup>, dv = dx<br>Then: du = (2 ln x)/x dx, v = x",
    "Apply integration by parts:<br>∫ (ln x)<sup>2</sup> dx = x(ln x)<sup>2</sup> − 2∫ ln x dx",
    "Compute: ∫ ln x dx = x ln x − x",
    "Substitute back:<br>∫ (ln x)<sup>2</sup> dx = x(ln x)<sup>2</sup> − 2x ln x + 2x",
    "Apply bounds from 1 to e:<br>At x = e: = e(1)<sup>2</sup> − 2e(1) + 2e = e<br>At x = 1: = 0 − 0 + 2 = 2",
    "Final Answer: I = e − 2"
  ];

  const startReveal = () => {
    if (isRevealing) return;
    setIsRevealing(true);
    setDisplayedSteps([]);
    setStepIndex(0);
    setShowCursor(true);

    setTimeout(() => {
      showNext();
    }, 400);
  };

  const showNext = () => {
    let currentIndex = stepIndex;
    if (currentIndex < steps.length) {
      setDisplayedSteps(prev => [...prev, currentIndex]);
      setStepIndex(currentIndex + 1);

      setTimeout(() => {
        showNext();
      }, 800);
    } else {
      setShowCursor(false);
      setIsRevealing(false);
    }
  };

  // trigger next step when index increases; showNext & steps.length intentionally omitted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (stepIndex > 0 && stepIndex < steps.length) {
      showNext();
    }
  }, [stepIndex]);

  return (
    <div className="integral-container">
      <h1 className="glitch-title">FINAL GATE – INTEGRAL PROTOCOL</h1>

      <div className="problem">
        Evaluate the integral: <br />
        I = ∫<sub>1</sub><sup>e</sup> (ln x)<sup>2</sup> dx
      </div>

      <button 
        className="decrypt-btn" 
        onClick={startReveal}
        disabled={isRevealing}
      >
        [ DECRYPT SOLUTION ]
      </button>

      <div className="solution-box">
        <div id="solutionSteps">
          {displayedSteps.map((idx) => (
            <div 
              key={idx} 
              className={`step ${idx === steps.length - 1 ? 'final-answer' : ''}`}
              dangerouslySetInnerHTML={{ __html: steps[idx] }}
            />
          ))}
        </div>
        {showCursor && <span className="cursor">_</span>}
      </div>

      <div className="footer"> Access Granted.</div>
    </div>
  );
}

export default IntegralProtocol;
