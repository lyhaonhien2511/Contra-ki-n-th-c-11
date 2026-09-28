import React from 'react';
import { Topic, Question } from '../types/game';
import { 
  Play, 
  Settings, 
  BookOpen, 
  Shield, 
  Crosshair, 
  Flame, 
  Award, 
  Atom, 
  Calculator, 
  Languages,
  Sparkles,
  Layers
} from 'lucide-react';

interface MainMenuProps {
  selectedTopic: Topic;
  onSelectTopic: (topic: Topic) => void;
  onStartGame: () => void;
  onOpenQuestionManager: () => void;
  questions: Question[];
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedTopic,
  onSelectTopic,
  onStartGame,
  onOpenQuestionManager,
  questions
}) => {
  const getTopicCount = (t: Topic) => questions.filter(q => q.topic === t).length;

  const topics: { id: Topic; name: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'Vật Lý 11',
      name: 'VẬT LÝ 11',
      desc: 'Dao động điều hòa, sóng cơ học, điện trường, định luật Coulomb & khúc xạ ánh sáng.',
      icon: <Atom className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/50 hover:border-amber-400 bg-amber-950/20'
    },
    {
      id: 'Toán 11',
      name: 'TOÁN 11',
      desc: 'Cấp số cộng, cấp số nhân, đạo hàm lũy thừa, hàm số lượng giác & xác suất cổ điển.',
      icon: <Calculator className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/50 hover:border-blue-400 bg-blue-950/20'
    },
    {
      id: 'Tiếng Anh 11',
      name: 'TIẾNG ANH 11',
      desc: 'Câu điều kiện Conditional Type 1/2, Mệnh đề quan hệ, Câu bị động & từ vựng.',
      icon: <Languages className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-['Chakra_Petch'] relative overflow-x-hidden p-4 sm:p-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-cyan-500" />

      {/* Header / Brand */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Hành Động Retro & Ôn Tập Kiến Thức
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 font-['Press_Start_2P'] drop-shadow-[0_5px_15px_rgba(244,63,94,0.4)]">
          CONTRA
        </h1>
        <h2 className="text-lg sm:text-2xl font-bold tracking-widest text-slate-200 mt-2 uppercase">
          Chiến Binh Tri Thức - Ôn Tập Vật Lý 11
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
          Vượt qua mưa bom bão đạn, thu thập súng tiếp tế và giải mã các Cổng Phong Ấn Trắc Nghiệm để giải cứu căn cứ!
        </p>
      </div>

      {/* Main Selection Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-6 flex flex-col gap-6">
        {/* Step 1: Topic Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              1. Chọn Chủ Đề Ôn Tập Cho Trận Đấu
            </h3>
            <span className="text-xs text-slate-400">
              (Thử thách trong màn chơi sẽ lấy từ chủ đề này)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topics.map(t => {
              const isSelected = selectedTopic === t.id;
              const count = getTopicCount(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900/90 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.02]'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2.5 right-4 bg-cyan-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Đang chọn
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        {t.icon}
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {count} câu hỏi
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-cyan-400">
                      {isSelected ? '✓ Đã sẵn sàng' : 'Nhấp để chọn'}
                    </span>
                    <span className="text-[11px] text-slate-500">Màn chơi 3 cổng</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: PLAY & CRUD */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Main Play Button */}
          <button
            onClick={onStartGame}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:via-rose-500 hover:to-amber-400 text-white font-extrabold text-base uppercase tracking-widest shadow-[0_0_35px_rgba(225,29,72,0.5)] transform active:scale-95 transition flex items-center justify-center gap-3 font-['Press_Start_2P'] text-xs sm:text-sm"
          >
            <Play className="w-5 h-5 fill-white" />
            VÀO TRẬN NGAY
          </button>

          {/* Question Manager CRUD Button */}
          <button
            onClick={onOpenQuestionManager}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-950/50 transform active:scale-95 transition flex items-center justify-center gap-2.5"
          >
            <Settings className="w-5 h-5 text-cyan-400" />
            Quản Lý Câu Hỏi / Cài Đặt Đề Thi (CRUD)
          </button>
        </div>

        {/* Game Features & Controls Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Controls Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              Bàn Phím & Thao Tác Điều Khiển
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">A / D hoặc ◄ ►</span>
                <span className="text-slate-400">Chạy trái / phải</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">W / Space hoặc ▲</span>
                <span className="text-slate-400">Nhảy lên bậc cao</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">S hoặc ▼</span>
                <span className="text-slate-400">Cúi người né đường đạn</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block">Phím J</span>
                <span className="text-slate-400">Bắn đạn thẳng / chéo</span>
              </div>
              <div className="col-span-2 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/40">
                <span className="text-indigo-300 font-bold block">Phím K (Kỹ năng Mana)</span>
                <span className="text-slate-400">Tạo Khiên Hộ Thể 6s & Sóng Nổ quét sạch đạn địch</span>
              </div>
            </div>
          </div>

          {/* Items & Mechanics Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              Vật Phẩm Tiếp Tế & Chướng Ngại Vật
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold w-16">🍄 Nấm Thần</span>
                <span className="text-slate-300">Hồi phục 100% thanh Máu (HP) và Mana tức thì</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-rose-400 font-bold w-16">[S] Spread</span>
                <span className="text-slate-300">Súng đạn chùm bắn tỏa 3 tia uy lực quét diện rộng</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold w-16">[L] Laser</span>
                <span className="text-slate-300">Tia laser năng lượng cao xuyên thấu mọi kẻ thù</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold w-16">⚡ Cổng Thi</span>
                <span className="text-slate-300">Đóng băng game, bắt buộc giải đố đúng để nổ cổng đi tiếp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-500 py-2 border-t border-slate-800/60 mt-4">
        Contra Ôn Tập Vật Lý 11 & Thi Trắc Nghiệm • Chu kỳ Ngày/Đêm động • Tự động lưu LocalStorage
      </footer>
    </div>
  );
};
