import React, { useState } from 'react';
import { Question } from '../types/game';
import { sounds } from '../services/soundEffects';
import { ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, Zap, Home, XCircle } from 'lucide-react';

interface QuizModalProps {
  question: Question;
  gateIndex: number;
  totalGates: number;
  onSuccess: () => void;
  onWrong: (selectedOptionIndex: number) => void;
  onBackToMenu?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  gateIndex,
  totalGates,
  onSuccess,
  onWrong,
  onBackToMenu
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSelectOption = (index: number) => {
    if (isSolved || isWrong) return;
    setSelectedIndex(index);

    if (index === question.correctIndex) {
      // Correct!
      sounds.quizSuccess();
      setIsWrong(false);
      setIsSolved(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      // Wrong answer -> triggers GAME OVER immediately!
      sounds.quizWrong();
      sounds.gameOver();
      setIsWrong(true);
      setShake(true);
      setTimeout(() => {
        onWrong(index);
      }, 1200);
    }
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Sci-fi Hologram Gate Container */}
      <div 
        className={`relative w-full max-w-2xl bg-slate-900 border-2 ${
          isSolved 
            ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)]' 
            : isWrong 
            ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.7)] animate-pulse' 
            : 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)]'
        } rounded-2xl p-6 sm:p-8 font-['Chakra_Petch'] transition-all ${shake ? 'animate-bounce' : ''}`}
      >
        {/* Hologram Corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-300 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-300 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-300 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-300 pointer-events-none" />

        {/* Header Alert */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isSolved 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : isWrong 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 tracking-wider">
                  CỔNG PHONG ẤN NĂNG LƯỢNG #{gateIndex} / {totalGates}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  [{question.topic}]
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1 uppercase tracking-wide">
                Thử Thách Trắc Nghiệm Quyết Định
              </h2>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-cyan-400/80 uppercase block">QUY TẮC SỐNG CÒN</span>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
              ĐÚNG: TIẾP TỤC • SAI: GAME OVER
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-slate-800 mb-6">
          <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === question.correctIndex;
            
            let btnStyle = "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-cyan-500 hover:bg-slate-900";
            if (isSolved && isCorrectOption) {
              btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/30";
            } else if (isWrong && isSelected) {
              btnStyle = "bg-red-950 border-red-500 text-red-200 shadow-md shadow-red-500/30";
            }

            return (
              <button
                key={idx}
                disabled={isSolved || isWrong}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3.5 rounded-xl border flex items-center gap-3.5 text-left text-xs sm:text-sm font-medium transition-all group ${btnStyle}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition ${
                  isSolved && isCorrectOption 
                    ? 'bg-emerald-500 text-slate-950' 
                    : isWrong && isSelected
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950'
                }`}>
                  {letters[idx]}
                </div>
                <div className="flex-1 break-words">
                  {option}
                </div>
                {isSolved && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isWrong && isSelected && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                )}
              </button>
            );
          })}
        </div>

        {/* Wrong Answer Alert Banner */}
        {isWrong && (
          <div className="bg-red-950/90 border-2 border-red-500 rounded-xl p-3.5 mb-4 animate-in fade-in flex items-start gap-2.5 text-xs text-red-200 shadow-lg shadow-red-950">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-red-300 uppercase tracking-wider text-sm mb-0.5">
                BẠN ĐÃ TRẢ LỜI SAI! CỔNG PHONG ẤN TỰ HỦY...
              </div>
              <div className="text-slate-300 mt-1">
                Đang chuyển sang màn hình <strong>GAME OVER</strong>. Hãy xem lại kiến thức và thử sức ở ván sau!
              </div>
            </div>
          </div>
        )}

        {/* Correct Solved Banner */}
        {isSolved && (
          <div className="bg-emerald-950/80 border border-emerald-500 rounded-xl p-3.5 mb-2 flex items-center justify-center gap-2 text-emerald-300 font-bold text-sm tracking-wider uppercase animate-pulse">
            <Zap className="w-5 h-5 text-emerald-400" />
            CHÍNH XÁC! CỔNG PHONG ẤN BỊ VÔ HIỆU HÓA, TIẾP TỤC TIẾN LÊN!
          </div>
        )}

        {/* Footer Note & Exit Option */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400">
            Mục tiêu: Trả lời đúng toàn bộ câu hỏi trắc nghiệm để trở thành <strong className="text-amber-400">WINNER</strong>!
          </span>
          {onBackToMenu && !isWrong && (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn dừng trận đấu và quay về Trang Chủ không?')) {
                  onBackToMenu();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs transition"
            >
              <Home className="w-3.5 h-3.5" />
              Thoát Về Trang Chủ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
