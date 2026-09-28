import React from 'react';
import { Topic, Question } from '../types/game';
import { Skull, RotateCcw, Home, AlertOctagon, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  topic: Topic;
  gatesPassed: number;
  totalGates: number;
  reason?: 'HP_ZERO' | 'QUIZ_WRONG';
  failedQuestionData?: {
    question: Question;
    selectedOption: string;
    correctOption: string;
  } | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  topic,
  gatesPassed,
  totalGates,
  reason = 'HP_ZERO',
  failedQuestionData,
  onPlayAgain,
  onBackToMenu
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-['Chakra_Petch']">
      <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(239,68,68,0.5)] relative animate-in fade-in zoom-in-95">
        
        {/* Glow corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-red-400 pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-red-400 pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-red-400 pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-red-400 pointer-events-none" />

        {/* Icon */}
        <div className="inline-flex p-4 rounded-full bg-red-500/20 border border-red-500/50 text-red-500 mb-3 animate-pulse">
          {reason === 'QUIZ_WRONG' ? <AlertOctagon className="w-12 h-12" /> : <Skull className="w-12 h-12" />}
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-red-500 uppercase tracking-widest font-['Press_Start_2P'] text-xs sm:text-sm mb-1">
          GAME OVER
        </h2>

        {reason === 'QUIZ_WRONG' ? (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-red-950 border border-red-500/60 text-red-300 font-bold text-xs uppercase tracking-wider mb-2">
              ⚠️ TRẢ LỜI SAI CÂU HỎI TRẮC NGHIỆM!
            </span>
            <p className="text-slate-300 text-xs sm:text-sm">
              Bạn đã chọn sai đáp án tại Cổng Phong Ấn! Hệ thống phòng thủ phát nổ và chiến dịch thất bại.
            </p>
          </div>
        ) : (
          <p className="text-slate-300 text-xs sm:text-sm mb-4">
            Chiến binh đã cạn kiệt sinh lực trong trận chiến! Hãy trang bị lại vũ khí và thử lại.
          </p>
        )}

        {/* Review Box if Failed Question */}
        {reason === 'QUIZ_WRONG' && failedQuestionData && (
          <div className="bg-slate-950/90 border border-red-500/40 rounded-xl p-4 text-left mb-5 space-y-2.5 text-xs">
            <div className="text-slate-200 font-semibold leading-relaxed">
              <span className="text-amber-400 font-bold mr-1">Câu hỏi:</span>
              {failedQuestionData.question.question}
            </div>

            <div className="flex items-start gap-2 text-red-300 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Bạn đã chọn:</span> {failedQuestionData.selectedOption}
              </div>
            </div>

            <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Đáp án chính xác:</span> {failedQuestionData.correctOption}
              </div>
            </div>

            {failedQuestionData.question.hint && (
              <div className="flex items-start gap-2 text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-amber-400 font-bold">Giải thích:</span> {failedQuestionData.question.hint}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase block">Chủ đề ôn tập</span>
            <span className="text-xs font-bold text-cyan-300">{topic}</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] text-slate-400 uppercase block">Điểm số</span>
            <span className="text-sm font-bold text-amber-400 font-['Press_Start_2P'] text-xs">
              {score}
            </span>
          </div>

          <div className="col-span-2 bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Cổng đã vượt qua trước khi thất bại</span>
            <span className="text-xs font-bold text-slate-200">
              {gatesPassed} / {totalGates} Cổng
            </span>
          </div>
        </div>

        {/* Actions */}
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
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Thử Lại Ngay
          </button>
        </div>
      </div>
    </div>
  );
};
