export type Topic = 'Vật Lý 11' | 'Toán 11' | 'Tiếng Anh 11';

export interface Question {
  id: string;
  topic: Topic;
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctIndex: number; // 0, 1, 2, 3
  hint: string;
}

export type WeaponType = 'NORMAL' | 'SPREAD' | 'LASER';

export type GameState = 
  | 'MENU' 
  | 'PLAYING' 
  | 'QUIZ_PAUSED' 
  | 'GAME_OVER' 
  | 'VICTORY' 
  | 'QUESTION_MANAGER';

export interface DropItem {
  id: string;
  x: number;
  y: number;
  vy: number;
  type: 'HEALTH_MANA' | 'SPREAD_GUN' | 'LASER_GUN';
  collected: boolean;
  pulseTimer: number;
}

export interface SupplyDrone {
  id: string;
  x: number;
  y: number;
  vx: number;
  hp: number;
  maxHp: number;
  itemType: 'HEALTH_MANA' | 'SPREAD_GUN' | 'LASER_GUN';
  destroyed: boolean;
}

export interface Enemy {
  id: string;
  type: 'SOLDIER' | 'TURRET' | 'DRONE' | 'BOSS';
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  direction: 1 | -1; // 1 = right, -1 = left
  shootCooldown: number;
  patrolMinX?: number;
  patrolMaxX?: number;
  isGrounded?: boolean;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPlayer: boolean;
  damage: number;
  weaponType: WeaponType;
  pierceCount?: number;
  lifeTime: number;
  radius: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'GROUND' | 'FLOATING' | 'BUNKER';
}

export interface QuizGate {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  unlocked: boolean;
  gateIndex: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isCrouching: boolean;
  facing: 1 | -1;
  aimAngle: number; // 0 = straight, -45 = up-diagonal
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  weapon: WeaponType;
  shieldActive: boolean;
  shieldDuration: number;
  shootCooldown: number;
  invincibleTimer: number;
  frameIndex: number;
  animTimer: number;
}
