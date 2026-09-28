import React from 'react';
import { WeaponType, Topic } from '../types/game';
import { 
  Heart, 
  Zap, 
  Shield, 
  Sun, 
  Moon, 
  Sunset, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play,
  Crosshair,
  Home
} from 'lucide-react';

interface HUDProps {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  weapon: WeaponType;
  score: number;
  shieldActive: boolean;
  shieldDuration: number;
  dayNightPhase: 'DAY' | 'SUNSET' | 'NIGHT';
  dayNightProgress: number; // 0 to 1
  topic: Topic;
  gatesPassed: number;
  totalGates: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onBackToMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hp,
  maxHp,
  mana,
  maxMana,
  weapon,
  score,
  shieldActive,
  shieldDuration,
  dayNightPhase,
  topic,
  gatesPassed,
  totalGates,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  onBackToMenu
}) => {
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const manaPercent = Math.max(0, Math.min(100, (mana / maxMana) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 pointer-events-none z-30 font-['Chakra_Petch']">
      <div className="flex flex-wrap items-start justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Side: HP, Mana, Weapon */}
        <div className="flex flex-col gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/30 shadow-xl">
          {/* HP Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-14">
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400">HP</span>
            </div>
            <div className="w-36 sm:w-44 h-4 bg-slate-950 rounded-full border border-red-500/40 p-0.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 rounded-full transition-all duration-200"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-red-300 w-12 text-right">
              {Math.ceil(hp)}/{maxHp}
            </span>
          </div>

          {/* Mana Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-14">
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span className="text-xs font-bold text-cyan-400">MANA</span>
            </div>
            <div className="w-36 sm:w-44 h-4 bg-slate-950 rounded-full border border-cyan-500/40 p-0.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 via-sky-400 to-blue-300 rounded-full transition-all duration-200"
                style={{ width: `${manaPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-cyan-300 w-12 text-right">
              {Math.ceil(mana)}/{maxMana}
            </span>
          </div>

          {/* Weapon & Shield Status */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            {/* Weapon Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-slate-400 uppercase">Súng:</span>
              <span className={`text-xs font-extrabold ${
                weapon === 'SPREAD' ? 'text-rose-400' : weapon === 'LASER' ? 'text-cyan-400' : 'text-amber-300'
              }`}>
                {weapon === 'SPREAD' ? 'SPREAD [S]' : weapon === 'LASER' ? 'LASER [L]' : 'STANDARD [R]'}
              </span>
            </div>

            {/* Shield Indicator */}
            {shieldActive && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-400 text-indigo-300 animate-pulse">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold">{shieldDuration.toFixed(1)}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Gate Progress & Topic */}
        <div className="flex flex-col items-center gap-1 pointer-events-auto bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/30 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {topic}
            </span>
            <span className="text-xs font-bold text-cyan-300">
              CỔNG: {gatesPassed} / {totalGates}
            </span>
          </div>
          <div className="flex gap-1.5 mt-0.5">
            {Array.from({ length: totalGates }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-2 rounded-sm border ${
                  i < gatesPassed
                    ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500'
                    : 'bg-slate-950 border-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Day/Night, Score & Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Day/Night Indicator */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-cyan-500/30 shadow-xl">
            {dayNightPhase === 'DAY' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : dayNightPhase === 'SUNSET' ? (
              <Sunset className="w-5 h-5 text-orange-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-300 animate-pulse" />
            )}
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase block leading-none">THỜI GIAN</span>
              <span className="text-xs font-bold text-slate-200">
                {dayNightPhase === 'DAY' ? 'BAN NGÀY' : dayNightPhase === 'SUNSET' ? 'HOÀNG HÔN' : 'ĐÊM TỐI'}
              </span>
            </div>
          </div>

          {/* Score display */}
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/30 shadow-xl text-right">
            <span className="text-[10px] text-slate-400 uppercase block leading-none">ĐIỂM SỐ</span>
            <span className="text-base font-extrabold text-amber-300 font-['Press_Start_2P']">
              {score.toString().padStart(5, '0')}
            </span>
          </div>

          {/* Sound, Pause & Home Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-cyan-500/30 shadow-xl">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={isMuted ? 'Bật âm thanh (Phím M)' : 'Tắt âm thanh (Phím M)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onTogglePause}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={isPaused ? 'Tiếp tục chơi (Phím P)' : 'Tạm dừng trò chơi (Phím P)'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-rose-950/70 hover:to-slate-800 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 text-slate-200 text-xs font-bold transition shadow-sm"
              title="Thoát khỏi ván đấu và quay về Trang Chủ"
            >
              <Home className="w-4 h-4 text-cyan-400 group-hover:text-rose-400" />
              <span>Trang Chủ</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
