import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Crosshair, Shield } from 'lucide-react';

interface TouchControlsProps {
  onInputStart: (action: string) => void;
  onInputEnd: (action: string) => void;
  onManaSkill: () => void;
  mana: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInputStart,
  onInputEnd,
  onManaSkill,
  mana
}) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 flex items-end justify-between pointer-events-none z-30 select-none">
      {/* D-Pad (Left, Right, Jump/Up, Crouch/Down) */}
      <div className="pointer-events-auto flex flex-col items-center gap-1.5 bg-slate-900/60 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/20">
        <button
          onPointerDown={() => onInputStart('up')}
          onPointerUp={() => onInputEnd('up')}
          onPointerCancel={() => onInputEnd('up')}
          className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-600 active:scale-95 text-cyan-300 flex items-center justify-center border border-slate-700 shadow-md font-bold text-xs"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => onInputStart('left')}
            onPointerUp={() => onInputEnd('left')}
            onPointerCancel={() => onInputEnd('left')}
            className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-600 active:scale-95 text-cyan-300 flex items-center justify-center border border-slate-700 shadow-md font-bold text-xs"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => onInputStart('down')}
            onPointerUp={() => onInputEnd('down')}
            onPointerCancel={() => onInputEnd('down')}
            className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-600 active:scale-95 text-cyan-300 flex items-center justify-center border border-slate-700 shadow-md font-bold text-xs"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onPointerDown={() => onInputStart('right')}
            onPointerUp={() => onInputEnd('right')}
            onPointerCancel={() => onInputEnd('right')}
            className="w-12 h-12 rounded-xl bg-slate-800/80 active:bg-cyan-600 active:scale-95 text-cyan-300 flex items-center justify-center border border-slate-700 shadow-md font-bold text-xs"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Action Buttons (Shoot, Skill K) */}
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/60 backdrop-blur-md p-2 rounded-2xl border border-cyan-500/20">
        {/* Mana Skill Button (K) */}
        <button
          onClick={onManaSkill}
          disabled={mana < 30}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border transition-all active:scale-90 ${
            mana >= 30
              ? 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-900/50'
              : 'bg-slate-800/50 border-slate-700 text-slate-500 opacity-60'
          }`}
          title="Kích hoạt Khiên Mana & Sóng Xung Kích (K)"
        >
          <Shield className="w-6 h-6" />
          <span className="text-[9px] font-bold">KHIÊN [K]</span>
        </button>

        {/* Shoot Button (J) */}
        <button
          onPointerDown={() => onInputStart('shoot')}
          onPointerUp={() => onInputEnd('shoot')}
          onPointerCancel={() => onInputEnd('shoot')}
          className="w-16 h-16 rounded-2xl bg-rose-600/90 hover:bg-rose-500 active:scale-95 text-white flex flex-col items-center justify-center border-2 border-rose-400 shadow-xl shadow-rose-950/60 font-bold"
          title="Bắn Đạn (J)"
        >
          <Crosshair className="w-7 h-7" />
          <span className="text-[9px] tracking-widest font-extrabold uppercase mt-0.5">BẮN [J]</span>
        </button>
      </div>
    </div>
  );
};
