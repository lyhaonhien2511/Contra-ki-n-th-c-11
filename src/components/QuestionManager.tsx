import React, { useState } from 'react';
import { Question, Topic } from '../types/game';
import { DEFAULT_QUESTIONS, saveStoredQuestions } from '../data/defaultQuestions';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  HelpCircle,
  BookOpen,
  Filter
} from 'lucide-react';

interface QuestionManagerProps {
  questions: Question[];
  onUpdateQuestions: (questions: Question[]) => void;
  onBackToMenu: () => void;
}

export const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  onUpdateQuestions,
  onBackToMenu
}) => {
  const [selectedTopic, setSelectedTopic] = useState<'ALL' | Topic>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal / Form state for Add/Edit
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [formTopic, setFormTopic] = useState<Topic>('Vật Lý 11');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formHint, setFormHint] = useState('');
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const topicsList: Topic[] = ['Vật Lý 11', 'Toán 11', 'Tiếng Anh 11'];

  const filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'ALL' || q.topic === selectedTopic;
    const matchesSearch = 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.hint.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const countByTopic = (topic: Topic) => questions.filter(q => q.topic === topic).length;

  const handleOpenAdd = () => {
    setCurrentEditId(null);
    setFormTopic(selectedTopic === 'ALL' ? 'Vật Lý 11' : selectedTopic);
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormHint('');
    setFormError('');
    setIsEditing(true);
  };

  const handleOpenEdit = (q: Question) => {
    setCurrentEditId(q.id);
    setFormTopic(q.topic);
    setFormQuestion(q.question);
    setFormOptions([...q.options] as [string, string, string, string]);
    setFormCorrectIndex(q.correctIndex);
    setFormHint(q.hint);
    setFormError('');
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    if (formOptions.some(opt => !opt.trim())) {
      setFormError('Vui lòng điền đầy đủ cả 4 phương án A, B, C, D!');
      return;
    }

    let updatedList: Question[];
    if (currentEditId) {
      // Update existing
      updatedList = questions.map(q => {
        if (q.id === currentEditId) {
          return {
            ...q,
            topic: formTopic,
            question: formQuestion.trim(),
            options: [formOptions[0].trim(), formOptions[1].trim(), formOptions[2].trim(), formOptions[3].trim()],
            correctIndex: formCorrectIndex,
            hint: formHint.trim() || 'Hãy suy nghĩ kỹ dựa trên kiến thức lý thuyết đã học.'
          };
        }
        return q;
      });
    } else {
      // Create new
      const newQuestion: Question = {
        id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        topic: formTopic,
        question: formQuestion.trim(),
        options: [formOptions[0].trim(), formOptions[1].trim(), formOptions[2].trim(), formOptions[3].trim()],
        correctIndex: formCorrectIndex,
        hint: formHint.trim() || 'Gợi ý: Đọc kỹ định luật và công thức liên quan.'
      };
      updatedList = [newQuestion, ...questions];
    }

    saveStoredQuestions(updatedList);
    onUpdateQuestions(updatedList);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    const updated = questions.filter(q => q.id !== deleteTargetId);
    saveStoredQuestions(updated);
    onUpdateQuestions(updated);
    setDeleteTargetId(null);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục toàn bộ danh sách câu hỏi về mặc định ban đầu không?')) {
      saveStoredQuestions(DEFAULT_QUESTIONS);
      onUpdateQuestions(DEFAULT_QUESTIONS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Chakra_Petch']">
      {/* Header */}
      <header className="bg-slate-900/90 border-b border-cyan-500/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/40 text-sm font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Về Menu Chính
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-cyan-300 flex items-center gap-2 uppercase">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Ngân Hàng Câu Hỏi Contra (CRUD)
            </h1>
            <p className="text-xs text-slate-400">
              Quản lý, Thêm / Sửa / Xóa câu hỏi trắc nghiệm theo từng môn học (Tự động lưu vào máy)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            title="Khôi phục danh sách câu hỏi gốc"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/70 border border-amber-500/40 text-amber-300 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục mặc định
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm câu hỏi mới
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Filter and Search Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Topic Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 uppercase tracking-wider mr-1">
              <Filter className="w-3.5 h-3.5" /> Chủ đề:
            </span>
            <button
              onClick={() => setSelectedTopic('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedTopic === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/40 text-white">{questions.length}</span>
            </button>
            {topicsList.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedTopic === topic
                    ? topic === 'Vật Lý 11'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : topic === 'Toán 11'
                      ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/30'
                      : 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {topic}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/40 text-white">
                  {countByTopic(topic)}
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung câu hỏi, đáp án, gợi ý..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Questions Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">Không tìm thấy câu hỏi nào phù hợp.</p>
              <button
                onClick={handleOpenAdd}
                className="mt-3 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
              >
                Thêm câu hỏi mới vào chủ đề này
              </button>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between gap-4 transition shadow-md group relative"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                      q.topic === 'Vật Lý 11'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : q.topic === 'Toán 11'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {q.topic}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                      <button
                        onClick={() => handleOpenEdit(q)}
                        title="Chỉnh sửa câu hỏi"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-900/40 text-cyan-300 hover:text-cyan-200 transition border border-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(q.id)}
                        title="Xóa câu hỏi"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition border border-slate-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-semibold text-slate-100 text-sm leading-relaxed mb-3">
                    <span className="text-cyan-400 font-bold mr-1">#{idx + 1}.</span> {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      const letters = ['A', 'B', 'C', 'D'];
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-start gap-2 p-2 rounded-lg text-xs transition border ${
                            isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-950/40 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {letters[optIdx]}
                          </span>
                          <span className="flex-1 break-words leading-tight">{opt}</span>
                          {isCorrect && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hint / Explanation */}
                  {q.hint && (
                    <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="leading-tight">
                        <span className="text-amber-300 font-bold">Gợi ý:</span> {q.hint}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-cyan-300 mb-1 uppercase flex items-center gap-2">
              {currentEditId ? <Edit3 className="w-5 h-5 text-cyan-400" /> : <PlusCircle className="w-5 h-5 text-emerald-400" />}
              {currentEditId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Điền nội dung trắc nghiệm, các đáp án và chọn đáp án chính xác cho thử thách Contra.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500/60 text-red-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Topic Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Chủ đề môn học:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {topicsList.map(topic => (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => setFormTopic(topic)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                        formTopic === topic
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nội dung câu hỏi:
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Ví dụ: Công thức tính bước sóng truyền trong môi trường là gì?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* 4 Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  4 Phương án lựa chọn (Click vòng tròn để chọn đáp án đúng):
                </label>
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((letter, idx) => {
                    const isCorrect = formCorrectIndex === idx;
                    return (
                      <div
                        key={letter}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/60'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setFormCorrectIndex(idx)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                          title={`Chọn phương án ${letter} là đáp án đúng`}
                        >
                          {letter}
                        </button>
                        <input
                          type="text"
                          value={formOptions[idx]}
                          onChange={(e) => {
                            const copy = [...formOptions] as [string, string, string, string];
                            copy[idx] = e.target.value;
                            setFormOptions(copy);
                          }}
                          placeholder={`Nhập phương án ${letter}...`}
                          className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:outline-none placeholder-slate-600"
                        />
                        {isCorrect && (
                          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                            Đáp án đúng
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hint / Explanation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Gợi ý giải thích (Hiện ra khi học sinh trả lời sai):
                </label>
                <input
                  type="text"
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  placeholder="Ví dụ: Bước sóng λ = v.T = v/f (v là vận tốc, f là tần số)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/60 transition"
                >
                  {currentEditId ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-red-400 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              Xác Nhận Xóa Câu Hỏi
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng đề không? Hành động này sẽ được lưu ngay lập tức vào trình duyệt của bạn.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-950/50 transition"
              >
                Đồng ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
