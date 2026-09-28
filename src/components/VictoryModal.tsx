import React from 'react';
import { Topic } from '../types/game';
import { Trophy, RotateCcw, Home, Award, Zap, CheckCircle2, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  topic: Topic;
  gatesPassed: number;
  totalGates: number;
  enemiesDefeated: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  topic,
  gatesPassed,
  totalGates,
  enemiesDefeated,
  onPlayAgain,
  onBackToMenu
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-['Chakra_Petch']">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(251,191,36,0.5)] relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Glow corner accents */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-amber-300 pointer-events-none" />

        {/* Crown & Trophy Icon */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <div className="p-4 rounded-full bg-gradient-to-tr from-amber-500/30 to-yellow-300/30 border-2 border-amber-400 text-amber-400 animate-bounce shadow-lg shadow-amber-500/20">
            <Trophy className="w-12 h-12" />
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-1 -right-2 animate-pulse" />
        </div>

        {/* Big WINNER Banner */}
        <div className="mb-2">
          <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs tracking-widest uppercase mb-1 shadow-md">
            ★ CHIẾN THẮNG TUYỆT ĐỐI ★
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 uppercase tracking-widest font-['Press_Start_2P'] text-base sm:text-xl drop-shadow-md">
            WINNER!
          </h2>
        </div>

        <p className="text-slate-200 text-xs sm:text-sm mb-5 font-medium leading-relaxed">
          Xuất sắc! Bạn đã <strong className="text-emerald-400">trả lời đúng hết 100%</strong> các câu hỏi trắc nghiệm và tiêu diệt toàn bộ lực lượng địch để phá đảo chiến dịch!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Chủ đề ôn tập</span>
            <span className="text-xs font-bold text-cyan-300">{topic}</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Tổng điểm số</span>
            <span className="text-lg font-bold text-amber-400 font-['Press_Start_2P'] text-xs">
              {score}
            </span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 text-left">
            <span className="text-[10px] text-emerald-400 uppercase block">Độ chính xác câu hỏi</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% ({gatesPassed}/{totalGates} Cổng)
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-left">
            <span className="text-[10px] text-slate-400 uppercase block">Kẻ địch tiêu diệt</span>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 text-rose-400" />
              {enemiesDefeated} Mục tiêu
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Chơi Lại Ván Mới
          </button>
        </div>
      </div>
    </div>
  );
};
