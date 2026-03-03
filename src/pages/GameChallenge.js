import React, { useState, useEffect, useRef } from 'react';
import './GameChallenge.css';

function GameChallenge() {
  const canvasRef = useRef(null);
  const [levelState, setLevelState] = useState({
    currentLevel: 0,
    codeParts: ["", "", ""],
    levelComplete: false,
    deathReset: false,
    levelJustCompleted: false,
    showPostLevel3Choice: false,
    warningVisible: false
  });

  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const PLAYER_WIDTH = 20;
  const PLAYER_HEIGHT = 20;
  const MOVE_SPEED = 3.5;

  const gameStateRef = useRef({
    player: { x: 50, y: 300, vx: 0, vy: 0, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, onGround: false },
    platforms: [],
    collectibles: [],
    enemies: [],
    exit: { x: 0, y: 0, w: 25, h: 30, active: false },
    requiredOrder: [],
    collectedOrderIndex: 0,
    keys: { ArrowLeft: false, ArrowRight: false, Space: false, ArrowUp: false }
  });

  const levelData = React.useMemo(() => [
    {
      platforms: [
        { x: 0, y: 380, w: 800, h: 20 },
        { x: 150, y: 320, w: 150, h: 20 },
        { x: 450, y: 280, w: 150, h: 20 },
        { x: 600, y: 200, w: 100, h: 20 }
      ],
      collectibles: [
        { x: 170, y: 300, type: 'star', color: 'gold', orderColor: null },
        { x: 220, y: 300, type: 'star', color: 'gold', orderColor: null },
        { x: 470, y: 260, type: 'star', color: 'gold', orderColor: null },
        { x: 520, y: 260, type: 'star', color: 'gold', orderColor: null },
        { x: 620, y: 180, type: 'star', color: 'gold', orderColor: null }
      ],
      enemies: [],
      exit: null,
      requiredCount: 5,
      order: null,
      name: 'LEVEL 1'
    },
    {
      platforms: [
        { x: 0, y: 380, w: 800, h: 20 },
        { x: 100, y: 320, w: 120, h: 20 },
        { x: 320, y: 280, w: 140, h: 20 },
        { x: 550, y: 240, w: 120, h: 20 },
        { x: 600, y: 200, w: 100, h: 20 }
      ],
      collectibles: [
        { x: 110, y: 300, type: 'gem', color: '#44aaff', orderColor: null },
        { x: 330, y: 260, type: 'gem', color: '#44aaff', orderColor: null },
        { x: 620, y: 180, type: 'gem', color: '#44aaff', orderColor: null }
      ],
      enemies: [
        { x: 300, y: 360, w: 20, h: 20, dx: 2, minX: 200, maxX: 500 }
      ],
      exit: null,
      requiredCount: 3,
      order: null,
      name: 'LEVEL 2'
    },
    {
      platforms: [
        { x: 0, y: 380, w: 800, h: 20 },
        { x: 80, y: 320, w: 120, h: 20 },
        { x: 280, y: 280, w: 140, h: 20 },
        { x: 500, y: 240, w: 130, h: 20 },
        { x: 650, y: 150, w: 80, h: 20 }
      ],
      collectibles: [
        { x: 95, y: 300, type: 'gem', color: '#ff4444', orderColor: 'red' },
        { x: 300, y: 260, type: 'gem', color: '#44ff44', orderColor: 'green' },
        { x: 570, y: 180, type: 'gem', color: '#4da6ff', orderColor: 'blue' }
      ],
      enemies: [
        { x: 100, y: 360, w: 20, h: 20, dx: 1.5, minX: 50, maxX: 300 }
      ],
      exit: null,
      requiredCount: 3,
      order: ['red', 'green', 'blue'],
      name: 'LEVEL 3'
    },
    {
      platforms: [
        { x: 0, y: 380, w: 800, h: 20 },
        { x: 50, y: 320, w: 100, h: 20 },
        { x: 200, y: 280, w: 130, h: 20 },
        { x: 400, y: 240, w: 150, h: 20 },
        { x: 600, y: 200, w: 120, h: 20 },
        { x: 700, y: 160, w: 60, h: 20 }
      ],
      collectibles: [],
      enemies: [
        { x: 250, y: 220, w: 20, h: 20, dx: 2, minX: 200, maxX: 450 },
        { x: 350, y: 220, w: 20, h: 20, dx: 1.8, minX: 280, maxX: 500 }
      ],
      exit: { x: 720, y: 140, w: 30, h: 30 },
      requiredCount: 0,
      order: null,
      name: 'LEVEL 4'
    },
    {
      platforms: [
        { x: 0, y: 380, w: 800, h: 20 },
        { x: 40, y: 320, w: 120, h: 20 },
        { x: 220, y: 280, w: 140, h: 20 },
        { x: 420, y: 240, w: 150, h: 20 },
        { x: 600, y: 200, w: 120, h: 20 },
        { x: 730, y: 140, w: 50, h: 20 }
      ],
      collectibles: [
        { x: 450, y: 220, type: 'star', color: 'gold', orderColor: null },
        { x: 500, y: 220, type: 'star', color: 'gold', orderColor: null },
        { x: 570, y: 200, type: 'star', color: 'gold', orderColor: null }
      ],
      enemies: [
        { x: 250, y: 260, w: 20, h: 20, dx: 1.5, minX: 200, maxX: 400 },
        { x: 380, y: 250, w: 20, h: 20, dx: 1.8, minX: 300, maxX: 500 }
      ],
      exit: { x: 750, y: 120, w: 22, h: 30 },
      requiredCount: 3,
      order: null,
      name: 'LEVEL 5'
    }
  ], []);

  const loadLevel = React.useCallback((levelIndex) => {
    const lvl = levelData[levelIndex];
    gameStateRef.current.platforms = lvl.platforms.map(p => ({...p}));
    gameStateRef.current.collectibles = lvl.collectibles.map(c => ({...c, collected: false}));
    gameStateRef.current.enemies = lvl.enemies.map(e => ({...e, x: e.minX}));
    
    if (lvl.exit) {
      gameStateRef.current.exit = { ...lvl.exit, active: true };
    } else {
      gameStateRef.current.exit = { x: 0, y: 0, w: 25, h: 30, active: false };
    }

    gameStateRef.current.player = { x: 50, y: 300, vx: 0, vy: 0, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, onGround: false };
    gameStateRef.current.requiredOrder = lvl.order ? [...lvl.order] : [];
    gameStateRef.current.collectedOrderIndex = 0;

    setLevelState(prev => ({
      ...prev,
      currentLevel: levelIndex,
      levelComplete: false,
      deathReset: false,
      levelJustCompleted: false,
      showPostLevel3Choice: false,
      warningVisible: false
    }));
  }, [levelData]);

  const resetGame = () => {
    setLevelState(prev => ({
      ...prev,
      currentLevel: 0,
      codeParts: ["", "", ""]
    }));
    loadLevel(0);
  };



  const drawStar = (ctx, cx, cy, spikes, outerRadius, rotationOffset) => {
    let rot = Math.PI / 2 + rotationOffset;
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      rot += (Math.PI * 2) / spikes / 2;
      x = cx + Math.cos(rot) * (outerRadius * 0.5);
      y = cy + Math.sin(rot) * (outerRadius * 0.5);
      ctx.lineTo(x, y);
      rot += (Math.PI * 2) / spikes / 2;
    }
    ctx.fillStyle = 'gold';
    ctx.fill();
  };

  // run once on mount
  useEffect(() => {
    loadLevel(0);
  }, [loadLevel]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const gs = gameStateRef.current;
      if (e.key === 'ArrowLeft') gs.keys.ArrowLeft = true;
      if (e.key === 'ArrowRight') gs.keys.ArrowRight = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        gs.keys.Space = true;
        gs.keys.ArrowUp = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const gs = gameStateRef.current;
      if (e.key === 'ArrowLeft') gs.keys.ArrowLeft = false;
      if (e.key === 'ArrowRight') gs.keys.ArrowRight = false;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        gs.keys.Space = false;
        gs.keys.ArrowUp = false;
      }
    };

    const localUpdate = () => {
      const gs = gameStateRef.current;
      const state = levelState;
      if (state.showPostLevel3Choice || state.levelComplete || state.levelJustCompleted || state.deathReset) return;
      let move = 0;
      if (gs.keys.ArrowLeft) move -= 1;
      if (gs.keys.ArrowRight) move += 1;
      gs.player.vx = move * MOVE_SPEED;
      if ((gs.keys.Space || gs.keys.ArrowUp) && gs.player.onGround) {
        gs.player.vy = JUMP_FORCE;
        gs.player.onGround = false;
      }
      gs.player.vy += GRAVITY;
      gs.player.y += gs.player.vy;
      gs.player.x += gs.player.vx;
      gs.player.onGround = false;
      for (let pl of gs.platforms) {
        if (gs.player.vy >= 0 &&
            gs.player.y + gs.player.height <= pl.y + 5 &&
            gs.player.y + gs.player.height + gs.player.vy >= pl.y &&
            gs.player.x + gs.player.width > pl.x &&
            gs.player.x < pl.x + pl.w) {
          gs.player.y = pl.y - gs.player.height;
          gs.player.vy = 0;
          gs.player.onGround = true;
        }
      }
      if (gs.player.y > 400) loadLevel(state.currentLevel);
      for (let e of gs.enemies) {
        e.x += e.dx;
        if (e.x <= e.minX || e.x >= e.maxX) e.dx *= -1;
        if (gs.player.x < e.x + e.w &&
            gs.player.x + gs.player.width > e.x &&
            gs.player.y < e.y + e.h &&
            gs.player.y + gs.player.height > e.y) {
          loadLevel(state.currentLevel);
        }
      }
      for (let c of gs.collectibles) {
        if (!c.collected &&
            gs.player.x < c.x + 20 &&
            gs.player.x + gs.player.width > c.x &&
            gs.player.y < c.y + 20 &&
            gs.player.y + gs.player.height > c.y) {
          c.collected = true;
        }
      }
    };

    const localDraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 800, 400);
      const grad = ctx.createLinearGradient(0, 0, 0, 400);
      grad.addColorStop(0, '#b2e6ff');
      grad.addColorStop(0.7, '#f9d77e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 400);
      const gs = gameStateRef.current;
      ctx.shadowColor = '#7a4d1a';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#8b7355';
      for (let p of gs.platforms) {
        ctx.fillRect(p.x, p.y, p.w, p.h);
      }
      ctx.shadowColor = '#440000';
      ctx.fillStyle = '#cc0000';
      for (let e of gs.enemies) {
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(e.x + 5, e.y + 5, 5, 5);
        ctx.fillRect(e.x + 10, e.y + 5, 5, 5);
        ctx.fillStyle = '#cc0000';
      }
      ctx.shadowColor = 'gold';
      for (let c of gs.collectibles) {
        if (!c.collected) {
          if (c.type === 'star') {
            drawStar(ctx, c.x + 10, c.y + 10, 8, 5, 0);
          } else {
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x + 10, c.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      if (gs.exit.active) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(gs.exit.x, gs.exit.y, gs.exit.w, gs.exit.h);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(gs.exit.x + 5, gs.exit.y + 5, gs.exit.w - 10, gs.exit.h - 10);
      }
      ctx.shadowColor = '#222222';
      ctx.fillStyle = '#f7d63e';
      ctx.fillRect(gs.player.x, gs.player.y, gs.player.width, gs.player.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(gs.player.x + 3, gs.player.y + 3, 5, 5);
      ctx.fillRect(gs.player.x + 12, gs.player.y + 3, 5, 5);
      ctx.shadowBlur = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      localUpdate();
      localDraw();
    }, 1000 / 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(gameLoop);
    };
  }, [levelState, loadLevel, JUMP_FORCE, GRAVITY, MOVE_SPEED]);

  const lvl = levelData[levelState.currentLevel];

  return (
    <div className="game-wrapper">
      <div className="header">
        <span>🏆 ULTIMATE FUN CHALLENGE</span>
        <span className="level-badge" id="levelDisplay">{lvl.name}</span>
      </div>
      <canvas 
        ref={canvasRef}
        id="gameCanvas" 
        width="800" 
        height="400"
        className="game-canvas"
      />
      <div className="info-bar">
        <div className="code-panel">
          {levelState.codeParts.map((part, i) => (
            part ? `[${part}] ` : '[ _ ] '
          ))}
        </div>
        {levelState.warningVisible && (
          <div className="warning-flash">⚠️ WARNING ⚠️</div>
        )}
      </div>
      <div className="message-area">
        <span>✨ Collect stars! ✨</span>
        <button className="button-reset" onClick={resetGame}>
          ↺ RESTART
        </button>
      </div>
    </div>
  );
}

export default GameChallenge;
