import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoInsideChallenge.css';

function GoInsideChallenge() {
  const navigate = useNavigate();
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [isGranted, setIsGranted] = useState(false);
  const [message, setMessage] = useState('🔒 terminal locked • step two to authenticate');
  const [typingText, setTypingText] = useState('');

  const codeDestinationMap = [
    { code: "A1B2-C3D4-E5F6", route: "/integral4" },
    { code: "X7Y8-Z9W0", route: "/integra" }
  ];

  React.useEffect(() => {
    const systemMsg = "> secure channel • purple core • v3.0 ready";
    let idx = 0;
    
    const typeWriter = () => {
      if (idx < systemMsg.length) {
        setTypingText(systemMsg.substring(0, idx + 1));
        idx++;
        setTimeout(typeWriter, 60);
      }
    };
    typeWriter();
  }, []);

  const handleStepOne = () => {
    navigate('/game');
  };

  const handleStepTwo = () => {
    setShowAccessPanel(!showAccessPanel);
    if (!showAccessPanel && !isGranted) {
      setMessage('▶ ENTER ACCESS CODE:');
      setCodeInput('');
    }
  };

  const performVerification = () => {
    if (isGranted) return;

    const entered = codeInput.trim();
    const match = codeDestinationMap.find(item => item.code === entered);

    if (match) {
      setIsGranted(true);
      setMessage('⏵ ACCESS GRANTED\n⏵ Redirecting to final destination...');
      setTimeout(() => {
        navigate(match.route);
      }, 2000);
    } else {
      setMessage('⛔ ACCESS DENIED\n⛔ Invalid code.');
      setCodeInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performVerification();
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setCodeInput(newValue);
    if (!isGranted && message.includes('DENIED')) {
      setMessage('▶ ENTER ACCESS CODE:');
    }
  };

  return (
    <div className="go-inside-container">
      <div className="logo-wrapper">
        <div className="club-badge"><span>CG</span></div>
      </div>

      <h1>⚡ GO INSIDE THE CHALLENGE ⚡</h1>
      <div className="subhead">authenticate to proceed</div>

      <div className="button-group">
        <button className="terminal-button" onClick={handleStepOne}>
          ⏵ STEP ONE · GAME
        </button>
        <button className="terminal-button" onClick={handleStepTwo}>
          ⏵ STEP TWO · FINAL
        </button>
      </div>

      {showAccessPanel && (
        <div id="accessPanel" className="access-panel">
          <div className="access-label">
            <span> ENTER ACCESS CODE:</span>
            <span className="cursor-blink">_</span>
          </div>
          <div className="input-row">
            <input
              type="text"
              id="codeInput"
              className="terminal-input"
              placeholder="••••••••"
              value={codeInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isGranted}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              id="verifyBtn"
              className="terminal-button small"
              onClick={performVerification}
              disabled={isGranted}
            >
              VERIFY
            </button>
          </div>
          <div id="messageArea" className="message-area">
            {message}
          </div>
          <div className="status-hint">press ↵ to submit</div>
        </div>
      )}

      <div className="system-footer">
        <span id="typingText">{typingText}</span>
        <span className="cursor">_</span>
      </div>
    </div>
  );
}

export default GoInsideChallenge;
