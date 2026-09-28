import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Question, 
  Topic, 
  WeaponType, 
  Player, 
  Platform, 
  Enemy, 
  Bullet, 
  DropItem, 
  SupplyDrone, 
  QuizGate, 
  Particle 
} from '../types/game';
import { sounds } from '../services/soundEffects';
import { HUD } from './HUD';
import { QuizModal } from './QuizModal';
import { VictoryModal } from './VictoryModal';
import { GameOverModal } from './GameOverModal';
import { TouchControls } from './TouchControls';
import { Home, Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface ContraGameCanvasProps {
  topic: Topic;
  questions: Question[];
  onBackToMenu: () => void;
}

export const ContraGameCanvas: React.FC<ContraGameCanvasProps> = ({
  topic,
  questions,
  onBackToMenu
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter questions for the selected topic
  const topicQuestions = questions.filter(q => q.topic === topic);
  const activeQuestions = topicQuestions.length > 0 ? topicQuestions : questions;

  // React state for UI overlays
  const [hudStats, setHudStats] = useState({
    hp: 100,
    maxHp: 100,
    mana: 100,
    maxMana: 100,
    weapon: 'NORMAL' as WeaponType,
    score: 0,
    shieldActive: false,
    shieldDuration: 0,
    dayNightPhase: 'DAY' as 'DAY' | 'SUNSET' | 'NIGHT',
    dayNightProgress: 0,
    gatesPassed: 0,
    totalGates: 3,
    isMuted: false,
    isPaused: false
  });

  // Modals
  const [quizState, setQuizState] = useState<{
    isOpen: boolean;
    question: Question | null;
    gateIndex: number;
    gateId: string | null;
  }>({
    isOpen: false,
    question: null,
    gateIndex: 1,
    gateId: null
  });

  const [isVictory, setIsVictory] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState<{
    reason: 'HP_ZERO' | 'QUIZ_WRONG';
    failedQuestionData?: {
      question: Question;
      selectedOption: string;
      correctOption: string;
    } | null;
  }>({
    reason: 'HP_ZERO',
    failedQuestionData: null
  });

  // References for Game Loop (avoids state lag in requestAnimationFrame)
  const gameStateRef = useRef({
    score: 0,
    enemiesDefeatedCount: 0,
    gatesPassedCount: 0,
    isPaused: false,
    isFrozenForQuiz: false,
    isGameOver: false,
    isVictory: false,
    dayNightTimer: 0,
    cameraX: 0,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      shoot: false
    }
  });

  const playerRef = useRef<Player>({
    x: 80,
    y: 400,
    width: 32,
    height: 52,
    vx: 0,
    vy: 0,
    isGrounded: false,
    isCrouching: false,
    facing: 1,
    aimAngle: 0,
    hp: 100,
    maxHp: 100,
    mana: 100,
    maxMana: 100,
    weapon: 'NORMAL',
    shieldActive: false,
    shieldDuration: 0,
    shootCooldown: 0,
    invincibleTimer: 0,
    frameIndex: 0,
    animTimer: 0
  });

  const platformsRef = useRef<Platform[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const supplyDronesRef = useRef<SupplyDrone[]>([]);
  const dropItemsRef = useRef<DropItem[]>([]);
  const quizGatesRef = useRef<QuizGate[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Level dimensions
  const LEVEL_WIDTH = 2900;
  const LEVEL_HEIGHT = 600;

  // Initialize level geometry & entities
  const initLevel = useCallback(() => {
    // Reset player
    playerRef.current = {
      x: 80,
      y: 350,
      width: 32,
      height: 52,
      vx: 0,
      vy: 0,
      isGrounded: false,
      isCrouching: false,
      facing: 1,
      aimAngle: 0,
      hp: 100,
      maxHp: 100,
      mana: 100,
      maxMana: 100,
      weapon: 'NORMAL',
      shieldActive: false,
      shieldDuration: 0,
      shootCooldown: 0,
      invincibleTimer: 0,
      frameIndex: 0,
      animTimer: 0
    };

    gameStateRef.current.score = 0;
    gameStateRef.current.enemiesDefeatedCount = 0;
    gameStateRef.current.gatesPassedCount = 0;
    gameStateRef.current.isPaused = false;
    gameStateRef.current.isFrozenForQuiz = false;
    gameStateRef.current.isGameOver = false;
    gameStateRef.current.isVictory = false;
    gameStateRef.current.dayNightTimer = 0;
    gameStateRef.current.cameraX = 0;

    // Build Platforms (ground and elevated bunkers/ledges)
    platformsRef.current = [
      // Main Ground segments with small pitfalls
      { x: 0, y: 500, width: 850, height: 100, type: 'GROUND' },
      { x: 920, y: 500, width: 750, height: 100, type: 'GROUND' },
      { x: 1720, y: 500, width: 750, height: 100, type: 'GROUND' },
      { x: 2520, y: 500, width: 500, height: 100, type: 'GROUND' },

      // Floating Platforms & Towers - Section 1
      { x: 180, y: 400, width: 140, height: 20, type: 'FLOATING' },
      { x: 380, y: 340, width: 160, height: 20, type: 'FLOATING' },
      { x: 600, y: 420, width: 120, height: 20, type: 'FLOATING' },

      // Section 2
      { x: 1000, y: 380, width: 160, height: 20, type: 'FLOATING' },
      { x: 1220, y: 310, width: 180, height: 20, type: 'FLOATING' },
      { x: 1450, y: 400, width: 140, height: 20, type: 'FLOATING' },

      // Section 3
      { x: 1800, y: 390, width: 160, height: 20, type: 'FLOATING' },
      { x: 2020, y: 320, width: 180, height: 20, type: 'FLOATING' },
      { x: 2260, y: 410, width: 140, height: 20, type: 'FLOATING' },

      // Final Extraction Bunker
      { x: 2650, y: 430, width: 200, height: 70, type: 'BUNKER' },
    ];

    // Quiz Gates (3 required checkpoints)
    quizGatesRef.current = [
      { id: 'gate-1', x: 800, y: 220, width: 36, height: 280, unlocked: false, gateIndex: 1 },
      { id: 'gate-2', x: 1620, y: 220, width: 36, height: 280, unlocked: false, gateIndex: 2 },
      { id: 'gate-3', x: 2420, y: 220, width: 36, height: 280, unlocked: false, gateIndex: 3 }
    ];

    // Enemies (Soldiers, Turrets, Drones)
    enemiesRef.current = [
      // Patrol Soldiers - Section 1
      { id: 'e1', type: 'SOLDIER', x: 450, y: 450, width: 30, height: 50, vx: -1.8, vy: 0, hp: 20, maxHp: 20, direction: -1, shootCooldown: 70, patrolMinX: 300, patrolMaxX: 650 },
      { id: 'e2', type: 'SOLDIER', x: 700, y: 450, width: 30, height: 50, vx: -1.8, vy: 0, hp: 20, maxHp: 20, direction: -1, shootCooldown: 90, patrolMinX: 550, patrolMaxX: 750 },
      { id: 'e3', type: 'TURRET', x: 380, y: 300, width: 36, height: 36, vx: 0, vy: 0, hp: 35, maxHp: 35, direction: -1, shootCooldown: 100 },

      // Section 2
      { id: 'e4', type: 'SOLDIER', x: 1100, y: 450, width: 30, height: 50, vx: -2, vy: 0, hp: 25, maxHp: 25, direction: -1, shootCooldown: 60, patrolMinX: 980, patrolMaxX: 1350 },
      { id: 'e5', type: 'TURRET', x: 1280, y: 270, width: 36, height: 36, vx: 0, vy: 0, hp: 40, maxHp: 40, direction: -1, shootCooldown: 80 },
      { id: 'e6', type: 'SOLDIER', x: 1480, y: 450, width: 30, height: 50, vx: -2.2, vy: 0, hp: 25, maxHp: 25, direction: -1, shootCooldown: 50, patrolMinX: 1380, patrolMaxX: 1580 },

      // Section 3
      { id: 'e7', type: 'SOLDIER', x: 1900, y: 450, width: 30, height: 50, vx: -2.2, vy: 0, hp: 30, maxHp: 30, direction: -1, shootCooldown: 60, patrolMinX: 1780, patrolMaxX: 2100 },
      { id: 'e8', type: 'TURRET', x: 2080, y: 280, width: 36, height: 36, vx: 0, vy: 0, hp: 45, maxHp: 45, direction: -1, shootCooldown: 75 },
      { id: 'e9', type: 'SOLDIER', x: 2300, y: 450, width: 30, height: 50, vx: -2.5, vy: 0, hp: 30, maxHp: 30, direction: -1, shootCooldown: 55, patrolMinX: 2150, patrolMaxX: 2400 },

      // Final Fortress Boss Mech
      { id: 'boss', type: 'BOSS', x: 2680, y: 350, width: 64, height: 80, vx: 0, vy: 0, hp: 120, maxHp: 120, direction: -1, shootCooldown: 40 }
    ];

    // Flying Supply Drones across the sky
    supplyDronesRef.current = [
      { id: 'drone-1', x: 500, y: 140, vx: 1.2, hp: 15, maxHp: 15, itemType: 'SPREAD_GUN', destroyed: false },
      { id: 'drone-2', x: 1250, y: 130, vx: -1.2, hp: 15, maxHp: 15, itemType: 'HEALTH_MANA', destroyed: false },
      { id: 'drone-3', x: 1950, y: 150, vx: 1.2, hp: 15, maxHp: 15, itemType: 'LASER_GUN', destroyed: false },
      { id: 'drone-4', x: 2500, y: 120, vx: -1.2, hp: 15, maxHp: 15, itemType: 'HEALTH_MANA', destroyed: false }
    ];

    bulletsRef.current = [];
    dropItemsRef.current = [];
    particlesRef.current = [];

    setIsVictory(false);
    setIsGameOver(false);
    setEnemiesDefeated(0);
    setGameOverInfo({ reason: 'HP_ZERO', failedQuestionData: null });
    setQuizState({ isOpen: false, question: null, gateIndex: 1, gateId: null });
  }, []);

  // Initialize on mount
  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Handle Mana Skill (K)
  const triggerManaSkill = useCallback(() => {
    const player = playerRef.current;
    if (player.mana < 30 || player.shieldActive) return;

    player.mana -= 30;
    player.shieldActive = true;
    player.shieldDuration = 6.0; // 6 seconds shield
    sounds.manaSkill();

    // Shockwave burst: destroy all nearby enemy bullets and damage nearby enemies
    bulletsRef.current = bulletsRef.current.filter(b => b.isPlayer);

    // Blast wave particle ring
    for (let i = 0; i < 36; i++) {
      const angle = (i * Math.PI * 2) / 36;
      const speed = 7;
      particlesRef.current.push({
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#818cf8',
        size: 5,
        alpha: 1,
        life: 0,
        maxLife: 30
      });
    }

    // Damage enemies on screen
    const camX = gameStateRef.current.cameraX;
    enemiesRef.current.forEach(e => {
      if (Math.abs(e.x - (player.x + 20)) < 350) {
        e.hp -= 25;
        // spawn hit sparks
        for (let j = 0; j < 8; j++) {
          particlesRef.current.push({
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color: '#a78bfa',
            size: 4,
            alpha: 1,
            life: 0,
            maxLife: 20
          });
        }
      }
    });
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept inputs if typing or modal open
      if (quizState.isOpen || isVictory || isGameOver) return;

      const code = e.code;
      const keys = gameStateRef.current.keys;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        keys.left = true;
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        keys.right = true;
      } else if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') {
        keys.up = true;
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        keys.down = true;
      } else if (code === 'KeyJ') {
        keys.shoot = true;
      } else if (code === 'KeyK') {
        triggerManaSkill();
      } else if (code === 'KeyM') {
        sounds.toggleMute();
        setHudStats(prev => ({ ...prev, isMuted: sounds.isMuted() }));
      } else if (code === 'KeyP') {
        gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
        setHudStats(prev => ({ ...prev, isPaused: gameStateRef.current.isPaused }));
      } else if (code === 'Escape') {
        gameStateRef.current.isPaused = true;
        setHudStats(prev => ({ ...prev, isPaused: true }));
        setShowExitConfirm(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      const keys = gameStateRef.current.keys;

      if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
      if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') keys.up = false;
      if (code === 'KeyS' || code === 'ArrowDown') keys.down = false;
      if (code === 'KeyJ') keys.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [quizState.isOpen, isVictory, isGameOver, triggerManaSkill]);

  // Touch control callbacks
  const handleTouchInputStart = (action: string) => {
    const keys = gameStateRef.current.keys;
    if (action === 'left') keys.left = true;
    if (action === 'right') keys.right = true;
    if (action === 'up') keys.up = true;
    if (action === 'down') keys.down = true;
    if (action === 'shoot') keys.shoot = true;
  };

  const handleTouchInputEnd = (action: string) => {
    const keys = gameStateRef.current.keys;
    if (action === 'left') keys.left = false;
    if (action === 'right') keys.right = false;
    if (action === 'up') keys.up = false;
    if (action === 'down') keys.down = false;
    if (action === 'shoot') keys.shoot = false;
  };

  // Player Shoot Logic
  const firePlayerBullet = useCallback(() => {
    const player = playerRef.current;
    if (player.shootCooldown > 0) return;

    sounds.shoot(player.weapon);

    const gunOriginX = player.facing === 1 ? player.x + player.width + 2 : player.x - 2;
    const gunOriginY = player.isCrouching ? player.y + 14 : player.y + 18;

    const angleRad = (player.aimAngle * Math.PI) / 180;
    const baseSpeed = 14;

    if (player.weapon === 'NORMAL') {
      player.shootCooldown = 12; // Standard rifle fire rate
      const vx = Math.cos(angleRad) * baseSpeed * player.facing;
      const vy = Math.sin(angleRad) * baseSpeed;
      bulletsRef.current.push({
        id: 'pb-' + Math.random(),
        x: gunOriginX,
        y: gunOriginY,
        vx,
        vy,
        isPlayer: true,
        damage: 15,
        weaponType: 'NORMAL',
        lifeTime: 60,
        radius: 4
      });
    } else if (player.weapon === 'SPREAD') {
      player.shootCooldown = 16;
      // 3 fan-shaped bullets
      [-0.22, 0, 0.22].forEach(offsetAngle => {
        const totalAngle = angleRad + offsetAngle;
        const vx = Math.cos(totalAngle) * baseSpeed * player.facing;
        const vy = Math.sin(totalAngle) * baseSpeed;
        bulletsRef.current.push({
          id: 'pb-' + Math.random(),
          x: gunOriginX,
          y: gunOriginY,
          vx,
          vy,
          isPlayer: true,
          damage: 12,
          weaponType: 'SPREAD',
          lifeTime: 55,
          radius: 5
        });
      });
    } else if (player.weapon === 'LASER') {
      player.shootCooldown = 22;
      const vx = Math.cos(angleRad) * 20 * player.facing;
      const vy = Math.sin(angleRad) * 20;
      bulletsRef.current.push({
        id: 'pb-' + Math.random(),
        x: gunOriginX,
        y: gunOriginY,
        vx,
        vy,
        isPlayer: true,
        damage: 35,
        weaponType: 'LASER',
        pierceCount: 5,
        lifeTime: 45,
        radius: 6
      });
    }

    // Muzzle flash particle
    particlesRef.current.push({
      x: gunOriginX,
      y: gunOriginY,
      vx: player.facing * 2,
      vy: 0,
      color: '#fef08a',
      size: 6,
      alpha: 1,
      life: 0,
      maxLife: 6
    });
  }, []);

  // When player answers quiz correctly
  const handleQuizSuccess = () => {
    if (!quizState.gateId) return;

    // Unlock the gate
    const gate = quizGatesRef.current.find(g => g.id === quizState.gateId);
    if (gate) {
      gate.unlocked = true;

      // Shatter barrier into particles
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: gate.x + Math.random() * gate.width,
          y: gate.y + Math.random() * gate.height,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: Math.random() > 0.5 ? '#06b6d4' : '#10b981',
          size: Math.random() * 6 + 2,
          alpha: 1,
          life: 0,
          maxLife: 45
        });
      }
      sounds.explosion();
    }

    gameStateRef.current.score += 500;
    gameStateRef.current.gatesPassedCount += 1;
    gameStateRef.current.isFrozenForQuiz = false;

    const currentGateIdx = quizState.gateIndex;

    setQuizState({
      isOpen: false,
      question: null,
      gateIndex: quizState.gateIndex,
      gateId: null
    });

    // Nếu trả lời đúng hết toàn bộ các cổng (3/3 cổng) -> WINNER!
    if (gameStateRef.current.gatesPassedCount >= 3 || currentGateIdx >= 3) {
      setTimeout(() => {
        gameStateRef.current.isVictory = true;
        sounds.victory();
        setIsVictory(true);
      }, 600);
    }
  };

  // When player answers quiz incorrectly -> GAME OVER!
  const handleQuizWrong = (selectedOptionIndex: number) => {
    if (!quizState.question) return;
    const currentQ = quizState.question;
    const selectedText = currentQ.options[selectedOptionIndex] || 'Không xác định';
    const correctText = currentQ.options[currentQ.correctIndex];

    gameStateRef.current.isGameOver = true;
    gameStateRef.current.isFrozenForQuiz = false;

    setGameOverInfo({
      reason: 'QUIZ_WRONG',
      failedQuestionData: {
        question: currentQ,
        selectedOption: selectedText,
        correctOption: correctText
      }
    });

    setQuizState({
      isOpen: false,
      question: null,
      gateIndex: 1,
      gateId: null
    });

    setIsGameOver(true);
  };

  // MAIN GAME LOOP (Physics, Collisions, Render)
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed canvas internal resolution
    canvas.width = 960;
    canvas.height = 540;

    const loop = () => {
      const gState = gameStateRef.current;
      const player = playerRef.current;

      // Only update simulation if not paused and not frozen for quiz modal
      if (!gState.isPaused && !gState.isFrozenForQuiz && !gState.isGameOver && !gState.isVictory) {
        // 1. Day / Night Cycle Timer (every 36s cycle)
        gState.dayNightTimer = (gState.dayNightTimer + 1) % 2160; // 2160 frames @ 60fps = 36s
        const phaseRatio = gState.dayNightTimer / 2160;
        let dayPhase: 'DAY' | 'SUNSET' | 'NIGHT' = 'DAY';
        if (phaseRatio < 0.45) {
          dayPhase = 'DAY';
        } else if (phaseRatio < 0.65) {
          dayPhase = 'SUNSET';
        } else {
          dayPhase = 'NIGHT';
        }

        // Mana passive regeneration (slowly 0.05 per frame)
        if (player.mana < player.maxMana) {
          player.mana = Math.min(player.maxMana, player.mana + 0.04);
        }

        // Shield countdown
        if (player.shieldActive) {
          player.shieldDuration -= 1 / 60;
          if (player.shieldDuration <= 0) {
            player.shieldActive = false;
            player.shieldDuration = 0;
          }
        }

        // Invincible timer countdown
        if (player.invincibleTimer > 0) {
          player.invincibleTimer -= 1;
        }

        // Shoot cooldown countdown
        if (player.shootCooldown > 0) {
          player.shootCooldown -= 1;
        }

        // 2. Player Controls & Movement
        const keys = gState.keys;
        const MOVE_SPEED = 4.2;
        const GRAVITY = 0.55;
        const JUMP_FORCE = -11.5;

        // Crouch check
        if (keys.down && player.isGrounded) {
          player.isCrouching = true;
          player.height = 28;
          player.vx = 0; // cannot run while crouching
        } else {
          player.isCrouching = false;
          player.height = 52;

          if (keys.left) {
            player.vx = -MOVE_SPEED;
            player.facing = -1;
          } else if (keys.right) {
            player.vx = MOVE_SPEED;
            player.facing = 1;
          } else {
            player.vx *= 0.7;
            if (Math.abs(player.vx) < 0.2) player.vx = 0;
          }
        }

        // Aim angle: if holding up, aim 45 deg up
        if (keys.up && !player.isGrounded) {
          player.aimAngle = -45;
        } else if (keys.up && player.vx !== 0) {
          player.aimAngle = -45;
        } else {
          player.aimAngle = 0;
        }

        // Jump
        if (keys.up && player.isGrounded && !player.isCrouching) {
          player.vy = JUMP_FORCE;
          player.isGrounded = false;
          sounds.jump();
        }

        // Shoot key held
        if (keys.shoot) {
          firePlayerBullet();
        }

        // Apply Gravity
        player.vy += GRAVITY;
        if (player.vy > 12) player.vy = 12;

        // Apply velocities
        player.x += player.vx;
        player.y += player.vy;

        // Level boundary constraints
        if (player.x < 10) player.x = 10;
        if (player.x > LEVEL_WIDTH - 60) player.x = LEVEL_WIDTH - 60;

        // Fall into pit check
        if (player.y > LEVEL_HEIGHT + 40) {
          player.hp = 0;
        }

        // 3. Platform Collision Resolution
        player.isGrounded = false;
        for (const plat of platformsRef.current) {
          // Landing on top of platform
          if (
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height >= plat.y &&
            player.y + player.height - player.vy <= plat.y + 12 &&
            player.vy >= 0
          ) {
            player.y = plat.y - player.height;
            player.vy = 0;
            player.isGrounded = true;
          }
        }

        // 4. Quiz Gate Collisions (MUST PAUSE WHEN TOUCHING ACTIVE GATE!)
        for (const gate of quizGatesRef.current) {
          if (!gate.unlocked) {
            // Check if player reaches the gate barrier
            const hitGate = 
              player.x + player.width >= gate.x &&
              player.x <= gate.x + gate.width &&
              player.y + player.height >= gate.y &&
              player.y <= gate.y + gate.height;

            if (hitGate) {
              // Push player back slightly to prevent slipping through
              player.x = gate.x - player.width - 2;
              player.vx = 0;

              // Freeze game and trigger quiz modal!
              gState.isFrozenForQuiz = true;
              sounds.quizOpen();

              // Pick random question from active pool
              const randomQ = activeQuestions[Math.floor(Math.random() * activeQuestions.length)];

              setQuizState({
                isOpen: true,
                question: randomQ,
                gateIndex: gate.gateIndex,
                gateId: gate.id
              });
              break;
            }
          }
        }

        // 5. Update Camera to follow player smoothly
        const targetCamX = player.x - 280;
        gState.cameraX += (targetCamX - gState.cameraX) * 0.1;
        if (gState.cameraX < 0) gState.cameraX = 0;
        if (gState.cameraX > LEVEL_WIDTH - 960) gState.cameraX = LEVEL_WIDTH - 960;

        // 6. Update Bullets & Collisions
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const b = bulletsRef.current[i];
          b.x += b.vx;
          b.y += b.vy;
          b.lifeTime -= 1;

          if (b.lifeTime <= 0 || b.x < 0 || b.x > LEVEL_WIDTH || b.y < 0 || b.y > LEVEL_HEIGHT) {
            bulletsRef.current.splice(i, 1);
            continue;
          }

          if (b.isPlayer) {
            // Check collision with supply drones
            for (const drone of supplyDronesRef.current) {
              if (!drone.destroyed && Math.abs(b.x - drone.x) < 30 && Math.abs(b.y - drone.y) < 20) {
                drone.hp -= b.damage;
                sounds.hit();
                // Drone destroyed: drop item!
                if (drone.hp <= 0) {
                  drone.destroyed = true;
                  sounds.explosion();
                  gState.score += 150;
                  dropItemsRef.current.push({
                    id: 'item-' + Math.random(),
                    x: drone.x,
                    y: drone.y,
                    vy: 1.5,
                    type: drone.itemType,
                    collected: false,
                    pulseTimer: 0
                  });
                }
                if (!b.pierceCount) {
                  bulletsRef.current.splice(i, 1);
                  break;
                }
              }
            }

            // Check collision with enemies
            for (const enemy of enemiesRef.current) {
              if (
                b.x >= enemy.x &&
                b.x <= enemy.x + enemy.width &&
                b.y >= enemy.y &&
                b.y <= enemy.y + enemy.height
              ) {
                enemy.hp -= b.damage;
                sounds.hit();

                // Hit spark particle
                particlesRef.current.push({
                  x: b.x,
                  y: b.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#fbbf24',
                  size: 4,
                  alpha: 1,
                  life: 0,
                  maxLife: 15
                });

                if (b.pierceCount) {
                  b.pierceCount -= 1;
                  if (b.pierceCount <= 0) {
                    bulletsRef.current.splice(i, 1);
                    break;
                  }
                } else {
                  bulletsRef.current.splice(i, 1);
                  break;
                }
              }
            }
          } else {
            // Enemy Bullet vs Player Collision
            if (
              b.x >= player.x &&
              b.x <= player.x + player.width &&
              b.y >= player.y &&
              b.y <= player.y + player.height
            ) {
              bulletsRef.current.splice(i, 1);

              if (player.shieldActive) {
                // Shield deflected the shot!
                sounds.hit();
                for (let k = 0; k < 6; k++) {
                  particlesRef.current.push({
                    x: b.x,
                    y: b.y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: '#818cf8',
                    size: 3,
                    alpha: 1,
                    life: 0,
                    maxLife: 15
                  });
                }
              } else if (player.invincibleTimer <= 0) {
                player.hp -= b.damage;
                player.invincibleTimer = 40; // 40 frames iframe flicker
                sounds.hit();
                if (player.hp <= 0) {
                  player.hp = 0;
                }
              }
            }
          }
        }

        // 7. Update Enemies & AI
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const e = enemiesRef.current[i];

          // Enemy Death Check
          if (e.hp <= 0) {
            sounds.explosion();
            gState.score += e.type === 'BOSS' ? 1000 : 100;
            gState.enemiesDefeatedCount += 1;
            setEnemiesDefeated(gState.enemiesDefeatedCount);

            // Explosions particles
            for (let p = 0; p < (e.type === 'BOSS' ? 40 : 15); p++) {
              particlesRef.current.push({
                x: e.x + e.width / 2,
                y: e.y + e.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
                size: Math.random() * 5 + 2,
                alpha: 1,
                life: 0,
                maxLife: 30
              });
            }

            enemiesRef.current.splice(i, 1);
            continue;
          }

          // Patrol Movement
          if (e.type === 'SOLDIER') {
            e.x += e.vx;
            if (e.patrolMinX && e.x < e.patrolMinX) {
              e.x = e.patrolMinX;
              e.vx = Math.abs(e.vx);
              e.direction = 1;
            } else if (e.patrolMaxX && e.x > e.patrolMaxX) {
              e.x = e.patrolMaxX;
              e.vx = -Math.abs(e.vx);
              e.direction = -1;
            }
          }

          // Enemy Shooting logic (if within visible distance from player)
          const distToPlayer = Math.abs(e.x - player.x);
          if (distToPlayer < 480) {
            e.shootCooldown -= 1;
            if (e.shootCooldown <= 0) {
              // Shoot bullet towards player
              e.shootCooldown = e.type === 'BOSS' ? 45 : 90;
              const angle = Math.atan2((player.y + 15) - (e.y + 15), (player.x + 15) - (e.x + 15));
              const bulletSpeed = e.type === 'BOSS' ? 7 : 5;
              bulletsRef.current.push({
                id: 'eb-' + Math.random(),
                x: e.x + (e.direction === 1 ? e.width : 0),
                y: e.y + 15,
                vx: Math.cos(angle) * bulletSpeed,
                vy: Math.sin(angle) * bulletSpeed,
                isPlayer: false,
                damage: e.type === 'BOSS' ? 20 : 12,
                weaponType: 'NORMAL',
                lifeTime: 120,
                radius: 4
              });
            }
          }
        }

        // 8. Update Supply Drones
        for (const drone of supplyDronesRef.current) {
          if (!drone.destroyed) {
            drone.x += drone.vx;
            if (drone.x < 100 || drone.x > LEVEL_WIDTH - 200) {
              drone.vx *= -1;
            }
          }
        }

        // 9. Update Drop Items
        for (let i = dropItemsRef.current.length - 1; i >= 0; i--) {
          const item = dropItemsRef.current[i];
          item.pulseTimer += 0.08;
          item.y += item.vy;

          // Land on ground
          for (const plat of platformsRef.current) {
            if (
              item.x >= plat.x &&
              item.x <= plat.x + plat.width &&
              item.y + 18 >= plat.y &&
              item.y <= plat.y + 20
            ) {
              item.y = plat.y - 18;
              item.vy = 0;
            }
          }

          // Player Pickup Check
          const pickupDist = Math.hypot(
            (player.x + player.width / 2) - item.x,
            (player.y + player.height / 2) - item.y
          );

          if (pickupDist < 35) {
            sounds.itemPickup();
            gState.score += 200;

            if (item.type === 'HEALTH_MANA') {
              player.hp = player.maxHp;
              player.mana = player.maxMana;
            } else if (item.type === 'SPREAD_GUN') {
              player.weapon = 'SPREAD';
            } else if (item.type === 'LASER_GUN') {
              player.weapon = 'LASER';
            }

            // Pickup sparkly particles
            for (let s = 0; s < 12; s++) {
              particlesRef.current.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: item.type === 'HEALTH_MANA' ? '#10b981' : item.type === 'SPREAD_GUN' ? '#f43f5e' : '#06b6d4',
                size: 4,
                alpha: 1,
                life: 0,
                maxLife: 25
              });
            }

            dropItemsRef.current.splice(i, 1);
          }
        }

        // 10. Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }

        // 11. Check Game Over / Victory Conditions
        if (player.hp <= 0 && !gState.isGameOver) {
          gState.isGameOver = true;
          sounds.gameOver();
          setGameOverInfo({ reason: 'HP_ZERO', failedQuestionData: null });
          setIsGameOver(true);
        }

        // Victory: All 3 gates passed and reached end zone (x >= 2650)
        if (
          quizGatesRef.current.every(g => g.unlocked) &&
          player.x >= 2600 &&
          !gState.isVictory
        ) {
          gState.isVictory = true;
          sounds.victory();
          setIsVictory(true);
        }

        // Sync HUD stats to React state
        setHudStats({
          hp: player.hp,
          maxHp: player.maxHp,
          mana: player.mana,
          maxMana: player.maxMana,
          weapon: player.weapon,
          score: gState.score,
          shieldActive: player.shieldActive,
          shieldDuration: player.shieldDuration,
          dayNightPhase: dayPhase,
          dayNightProgress: phaseRatio,
          gatesPassed: gState.gatesPassedCount,
          totalGates: 3,
          isMuted: sounds.isMuted(),
          isPaused: gState.isPaused
        });
      }

      // ==========================================
      // RENDERING SECTION
      // ==========================================
      const camX = gState.cameraX;

      // 1. Sky & Day-Night Background Transition
      const phaseRatio = gState.dayNightTimer / 2160;
      let skyTop = '#1e3a8a';
      let skyBottom = '#60a5fa';

      if (phaseRatio < 0.4) {
        // Daytime: Bright Azure Sky
        skyTop = '#0284c7';
        skyBottom = '#7dd3fc';
      } else if (phaseRatio < 0.65) {
        // Sunset: Orange / Crimson Glow
        skyTop = '#7c2d12';
        skyBottom = '#f97316';
      } else {
        // Night: Deep Midnight Indigo
        skyTop = '#020617';
        skyBottom = '#0f172a';
      }

      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(1, skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars at Night
      if (phaseRatio >= 0.65) {
        ctx.fillStyle = '#ffffff';
        for (let s = 0; s < 45; s++) {
          const starX = (s * 87 + 13) % canvas.width;
          const starY = (s * 53 + 7) % 250;
          const starAlpha = 0.4 + 0.6 * Math.sin(Date.now() * 0.003 + s);
          ctx.globalAlpha = starAlpha;
          ctx.fillRect(starX, starY, 2, 2);
        }
        ctx.globalAlpha = 1.0;

        // Glowing Moon
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(canvas.width - 120, 80, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Parallax Mountain & Jungle Silhouettes (Far background)
      ctx.fillStyle = phaseRatio >= 0.65 ? '#090d16' : phaseRatio >= 0.4 ? '#431407' : '#0369a1';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 60) {
        const worldX = x + camX * 0.2;
        const mountainH = Math.sin(worldX * 0.005) * 80 + Math.cos(worldX * 0.01) * 40 + 220;
        ctx.lineTo(x, canvas.height - mountainH);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Middle parallax jungle foliage
      ctx.fillStyle = phaseRatio >= 0.65 ? '#03170e' : phaseRatio >= 0.4 ? '#291404' : '#065f46';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 40) {
        const worldX = x + camX * 0.5;
        const treeH = Math.sin(worldX * 0.01) * 45 + Math.cos(worldX * 0.02) * 25 + 140;
        ctx.lineTo(x, canvas.height - treeH);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Save context for camera translation
      ctx.save();
      ctx.translate(-camX, 0);

      // 3. Render Platforms
      for (const plat of platformsRef.current) {
        if (plat.type === 'GROUND') {
          // Retro Contra Military Steel & Dirt Ground
          ctx.fillStyle = '#1e293b'; // Base steel
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);

          // Top grass/foliage layer
          ctx.fillStyle = '#10b981';
          ctx.fillRect(plat.x, plat.y, plat.width, 6);

          // Metal rivets & hazard stripes
          ctx.fillStyle = '#eab308';
          for (let rx = plat.x; rx < plat.x + plat.width; rx += 40) {
            ctx.fillRect(rx, plat.y + 8, 12, 4);
          }
        } else if (plat.type === 'FLOATING') {
          // Floating High-tech Platform
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

          // Platform underlights
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(plat.x + 8, plat.y + plat.height - 3, plat.width - 16, 2);
        } else {
          // Extraction Bunker
          ctx.fillStyle = '#334155';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

          // Rescue Helicopter / Base Flag
          ctx.fillStyle = '#f59e0b';
          ctx.font = "bold 14px 'Press Start 2P', monospace";
          ctx.fillText("EVAC ZONE", plat.x + 30, plat.y - 15);
        }
      }

      // 4. Render Quiz Gates (Holographic energy barrier)
      for (const gate of quizGatesRef.current) {
        if (!gate.unlocked) {
          // Tower emitters at top and bottom
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(gate.x - 4, gate.y - 12, gate.width + 8, 16);
          ctx.fillRect(gate.x - 4, gate.y + gate.height - 4, gate.width + 8, 16);

          // Pulsing energy laser beam
          const pulse = Math.sin(Date.now() * 0.008) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(6, 182, 212, ${pulse * 0.45})`;
          ctx.fillRect(gate.x, gate.y, gate.width, gate.height);

          ctx.strokeStyle = `rgba(34, 211, 238, ${pulse})`;
          ctx.lineWidth = 3;
          ctx.strokeRect(gate.x, gate.y, gate.width, gate.height);

          // Sine energy waveforms inside gate
          ctx.strokeStyle = '#a5f3fc';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let gy = gate.y; gy <= gate.y + gate.height; gy += 8) {
            const waveX = gate.x + gate.width / 2 + Math.sin(gy * 0.05 + Date.now() * 0.01) * 8;
            if (gy === gate.y) ctx.moveTo(waveX, gy);
            else ctx.lineTo(waveX, gy);
          }
          ctx.stroke();

          // Gate Locked Icon / Text
          ctx.fillStyle = '#f43f5e';
          ctx.font = "bold 10px 'Press Start 2P', monospace";
          ctx.fillText(`GATE ${gate.gateIndex}`, gate.x - 12, gate.y - 20);
        }
      }

      // 5. Render Supply Drones & Drop Items
      for (const drone of supplyDronesRef.current) {
        if (!drone.destroyed) {
          // Flying drone body
          ctx.fillStyle = '#475569';
          ctx.fillRect(drone.x - 20, drone.y - 10, 40, 20);
          // Drone rotors
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(drone.x - 28, drone.y - 14, 56, 4);
          // Blinking light
          ctx.fillStyle = Math.sin(Date.now() * 0.01) > 0 ? '#ef4444' : '#10b981';
          ctx.beginPath();
          ctx.arc(drone.x, drone.y - 4, 3, 0, Math.PI * 2);
          ctx.fill();

          // Supply Pod crate attached underneath
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(drone.x - 10, drone.y + 10, 20, 16);
          ctx.fillStyle = '#000000';
          ctx.font = "bold 9px 'Press Start 2P', monospace";
          const iconLetter = drone.itemType === 'HEALTH_MANA' ? 'M' : drone.itemType === 'SPREAD_GUN' ? 'S' : 'L';
          ctx.fillText(iconLetter, drone.x - 4, drone.y + 22);
        }
      }

      for (const item of dropItemsRef.current) {
        const pulse = 1 + Math.sin(item.pulseTimer) * 0.15;
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.scale(pulse, pulse);

        // Item Pod glow
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fillStyle = item.type === 'HEALTH_MANA' ? '#10b981' : item.type === 'SPREAD_GUN' ? '#f43f5e' : '#06b6d4';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Icon inside
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 12px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = item.type === 'HEALTH_MANA' ? '🍄' : item.type === 'SPREAD_GUN' ? 'S' : 'L';
        ctx.fillText(label, 0, 1);

        ctx.restore();
      }

      // 6. Render Enemies
      for (const e of enemiesRef.current) {
        if (e.type === 'SOLDIER') {
          // Patrol Soldier (Red combat suit, helmet, rifle)
          ctx.fillStyle = '#b91c1c'; // Red uniform
          ctx.fillRect(e.x, e.y + 14, e.width, e.height - 14);

          // Head & Helmet
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(e.x + e.width / 2, e.y + 10, 10, 0, Math.PI * 2);
          ctx.fill();

          // Gun barrel
          ctx.fillStyle = '#0f172a';
          const gunX = e.direction === 1 ? e.x + e.width : e.x - 12;
          ctx.fillRect(gunX, e.y + 22, 14, 4);

          // Health bar above enemy
          const hpRatio = e.hp / e.maxHp;
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(e.x, e.y - 8, e.width, 4);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(e.x, e.y - 8, e.width * hpRatio, 4);
        } else if (e.type === 'TURRET') {
          // Stationary Gun Turret on Bunker
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.arc(e.x + e.width / 2, e.y + e.height / 2, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Aimed Cannon
          const angle = Math.atan2((player.y + 20) - (e.y + 18), (player.x + 16) - (e.x + 18));
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(e.x + e.width / 2, e.y + e.height / 2);
          ctx.lineTo(
            e.x + e.width / 2 + Math.cos(angle) * 26,
            e.y + e.height / 2 + Math.sin(angle) * 26
          );
          ctx.stroke();

          // Turret HP bar
          const hpRatio = e.hp / e.maxHp;
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(e.x - 2, e.y - 10, e.width + 4, 4);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(e.x - 2, e.y - 10, (e.width + 4) * hpRatio, 4);
        } else if (e.type === 'BOSS') {
          // Giant Mech Command Boss
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(e.x, e.y, e.width, e.height);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(e.x, e.y, e.width, e.height);

          // Glowing Core Eye
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(e.x + e.width / 2, e.y + 28, 12, 0, Math.PI * 2);
          ctx.fill();

          // Boss Title & HP Bar
          ctx.fillStyle = '#ef4444';
          ctx.font = "bold 9px 'Press Start 2P', monospace";
          ctx.fillText("CYBER COMMANDER", e.x - 20, e.y - 18);

          const hpRatio = e.hp / e.maxHp;
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(e.x - 20, e.y - 10, e.width + 40, 6);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(e.x - 20, e.y - 10, (e.width + 40) * hpRatio, 6);
        }
      }

      // 7. Render Contra Player
      if (player.invincibleTimer % 4 < 2) { // Flashing on iframe hit
        ctx.save();
        ctx.translate(player.x, player.y);

        // Player Headband & Hair (Classic Bill Rizer blue pants / red headband)
        const facing = player.facing;
        const centerX = player.width / 2;

        if (player.isCrouching) {
          // Crouching Contra Soldier
          ctx.fillStyle = '#1e3a8a'; // Blue pants
          ctx.fillRect(0, 10, player.width, 18);
          ctx.fillStyle = '#fbcfe8'; // Skin
          ctx.beginPath();
          ctx.arc(centerX + (facing * 4), 6, 8, 0, Math.PI * 2);
          ctx.fill();
          // Red Headband
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(centerX - 8, 2, 16, 4);
          // Gun pointing low
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(facing === 1 ? player.width - 2 : -16, 12, 18, 4);
        } else {
          // Standing / Running Contra Soldier
          // Legs
          ctx.fillStyle = '#1e3a8a'; // Blue camo trousers
          ctx.fillRect(4, 28, 10, 24);
          ctx.fillRect(18, 28, 10, 24);

          // Torso
          ctx.fillStyle = '#fbcfe8'; // Muscle chest
          ctx.fillRect(6, 12, 20, 16);

          // Red harness straps
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(10, 12, 3, 16);
          ctx.fillRect(18, 12, 3, 16);

          // Head
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(centerX, 8, 8, 0, Math.PI * 2);
          ctx.fill();

          // Red Headband with blowing tail
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(centerX - 8, 4, 16, 4);
          ctx.fillRect(facing === 1 ? centerX - 12 : centerX + 8, 5, 6, 2);

          // Heavy Rifle & Hands
          ctx.fillStyle = '#0f172a';
          if (player.aimAngle === -45) {
            // Aiming diagonal up
            ctx.save();
            ctx.translate(centerX, 18);
            ctx.rotate((facing * -45 * Math.PI) / 180);
            ctx.fillRect(0, -3, 24, 6);
            ctx.restore();
          } else {
            // Aiming straight
            const gunX = facing === 1 ? centerX : centerX - 24;
            ctx.fillRect(gunX, 16, 24, 6);
          }
        }

        // Plasma Shield Aura (Skill K active)
        if (player.shieldActive) {
          ctx.beginPath();
          ctx.arc(player.width / 2, player.height / 2, 38, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.7 + 0.3 * Math.sin(Date.now() * 0.015)})`;
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
          ctx.fill();
        }

        ctx.restore();
      }

      // 8. Render Bullets
      for (const b of bulletsRef.current) {
        if (b.isPlayer) {
          if (b.weaponType === 'SPREAD') {
            // Bright Red Spread Bullet
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else if (b.weaponType === 'LASER') {
            // Cyan High-tech Penetrating Beam
            ctx.fillStyle = '#22d3ee';
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 14, 4, Math.atan2(b.vy, b.vx), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            // Standard Orange Pellet
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Enemy Red Pulse Bullet
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fecaca';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 9. Render Particles
      for (const p of particlesRef.current) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Restore camera transform
      ctx.restore();

      // 10. Night Darkness Overlay & Player Flashlight Quầng Sáng
      if (phaseRatio >= 0.65) {
        ctx.save();
        const playerScreenX = player.x + player.width / 2 - camX;
        const playerScreenY = player.y + player.height / 2;

        // Dark ambient overlay with hole cutout around player
        const nightMask = ctx.createRadialGradient(
          playerScreenX, playerScreenY, 60,
          playerScreenX, playerScreenY, 260
        );
        nightMask.addColorStop(0, 'rgba(3, 7, 18, 0)');
        nightMask.addColorStop(0.5, 'rgba(3, 7, 18, 0.4)');
        nightMask.addColorStop(1, 'rgba(3, 7, 18, 0.88)');

        ctx.fillStyle = nightMask;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeQuestions, firePlayerBullet]);

  return (
    <div className="relative w-full h-screen bg-slate-950 flex items-center justify-center overflow-hidden select-none">
      {/* HTML5 Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain cursor-crosshair shadow-2xl bg-black"
      />

      {/* Retro HUD */}
      <HUD
        hp={hudStats.hp}
        maxHp={hudStats.maxHp}
        mana={hudStats.mana}
        maxMana={hudStats.maxMana}
        weapon={hudStats.weapon}
        score={hudStats.score}
        shieldActive={hudStats.shieldActive}
        shieldDuration={hudStats.shieldDuration}
        dayNightPhase={hudStats.dayNightPhase}
        dayNightProgress={hudStats.dayNightProgress}
        topic={topic}
        gatesPassed={hudStats.gatesPassed}
        totalGates={hudStats.totalGates}
        isMuted={hudStats.isMuted}
        onToggleMute={() => {
          sounds.toggleMute();
          setHudStats(prev => ({ ...prev, isMuted: sounds.isMuted() }));
        }}
        isPaused={hudStats.isPaused}
        onTogglePause={() => {
          gameStateRef.current.isPaused = !gameStateRef.current.isPaused;
          setHudStats(prev => ({ ...prev, isPaused: gameStateRef.current.isPaused }));
        }}
        onBackToMenu={() => {
          gameStateRef.current.isPaused = true;
          setHudStats(prev => ({ ...prev, isPaused: true }));
          setShowExitConfirm(true);
        }}
      />

      {/* On-screen touch controls */}
      <TouchControls
        onInputStart={handleTouchInputStart}
        onInputEnd={handleTouchInputEnd}
        onManaSkill={triggerManaSkill}
        mana={hudStats.mana}
      />

      {/* Quiz Modal when hitting gate */}
      {quizState.isOpen && quizState.question && (
        <QuizModal
          question={quizState.question}
          gateIndex={quizState.gateIndex}
          totalGates={3}
          onSuccess={handleQuizSuccess}
          onWrong={handleQuizWrong}
          onBackToMenu={onBackToMenu}
        />
      )}

      {/* Pause & Quit Confirmation Dialog */}
      {(showExitConfirm || hudStats.isPaused) && !quizState.isOpen && !isVictory && !isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-['Chakra_Petch']">
          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.3)] relative animate-in fade-in zoom-in-95">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/30">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-100 mb-1 font-['Press_Start_2P'] text-xs sm:text-sm">
              TẠM DỪNG TRẬN ĐẤU
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Bạn có muốn tiếp tục chiến đấu hay quay trở về Trang Chủ (Menu chính) để đổi chủ đề/câu hỏi khác?
            </p>

            <div className="space-y-3">
              {/* Resume Button */}
              <button
                onClick={() => {
                  gameStateRef.current.isPaused = false;
                  setHudStats(prev => ({ ...prev, isPaused: false }));
                  setShowExitConfirm(false);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                Tiếp Tục Chiến Đấu
              </button>

              {/* Restart Level Button */}
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  initLevel();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Chơi Lại Từ Đầu
              </button>

              {/* Quit to Home / Main Menu */}
              <button
                onClick={onBackToMenu}
                className="w-full py-3 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4 text-rose-400" />
                Về Trang Chủ (Menu Chính)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {isVictory && (
        <VictoryModal
          score={hudStats.score}
          topic={topic}
          gatesPassed={hudStats.gatesPassed}
          totalGates={3}
          enemiesDefeated={enemiesDefeated}
          onPlayAgain={initLevel}
          onBackToMenu={onBackToMenu}
        />
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={hudStats.score}
          topic={topic}
          gatesPassed={hudStats.gatesPassed}
          totalGates={3}
          reason={gameOverInfo.reason}
          failedQuestionData={gameOverInfo.failedQuestionData}
          onPlayAgain={initLevel}
          onBackToMenu={onBackToMenu}
        />
      )}
    </div>
  );
};
