import React, { useState } from 'react';
import { TodoItem, Category, DayOfWeek } from '../types/calendar';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  Trash2, 
  Plus, 
  GripVertical, 
  Sparkles, 
  PanelLeftClose, 
  Check, 
  Calendar, 
  BookOpen, 
  Laptop, 
  Clock,
  Layers
} from 'lucide-react';

interface AmieTodoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  todos: TodoItem[];
  onAddTodo: (text: string, category: Category, priority: boolean) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onTogglePriority: (id: string) => void;
  todayFormatted: string;
}

export const AmieTodoSidebar: React.FC<AmieTodoSidebarProps> = ({
  isOpen,
  onClose,
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onTogglePriority,
  todayFormatted,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('snf2');
  const [filterTab, setFilterTab] = useState<'all' | 'law' | 'deepwork' | 'done'>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTodo(inputText.trim(), selectedCategory, false);
    setInputText('');
  };

  const filteredTodos = todos.filter(t => {
    if (filterTab === 'done') return t.done;
    if (t.done) return false; // In active tabs, hide done
    if (filterTab === 'law') return t.category === 'snf1' || t.category === 'snf2' || t.category === 'lib';
    if (filterTab === 'deepwork') return t.category === 'deepwork';
    return true;
  });

  const completedCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getCategoryBadge = (cat: Category) => {
    switch (cat) {
      case 'snf1': return { label: '1. Sınıf', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'snf2': return { label: '2. Sınıf', bg: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
      case 'lib': return { label: 'Kütüphane', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'deepwork': return { label: 'Startup & Kod', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
      default: return { label: 'Görev', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <aside className="w-80 sm:w-88 shrink-0 bg-white/95 dark:bg-gt3-cardDark/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-gt3-borderDark h-[calc(100vh-53px)] sticky top-[53px] flex flex-col z-20 transition-all shadow-sm">
      
      {/* 1. Header & Date */}
      <div className="p-4 border-b border-slate-200/80 dark:border-gt3-borderDark flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gt3-yellow animate-pulse" />
            <h2 className="font-mono font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Amie Görevler & Odak
            </h2>
            <span className="text-[10px] font-mono font-bold text-slate-400 px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800">
              [B]
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {todayFormatted}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Paneli Gizle (B)"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Progress Pill */}
      <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-gt3-borderDark/60">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Günlük İlerleme</span>
          <span className="font-mono text-slate-900 dark:text-gt3-yellow">
            {completedCount}/{totalCount} (%{progressPercent})
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gt3-yellow to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Quick Add Form */}
      <form onSubmit={handleSubmit} className="p-3 border-b border-slate-200/80 dark:border-gt3-borderDark">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="+ Yeni görev, pratik olay veya kod..."
            className="w-full pl-3 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gt3-yellow transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-gt3-yellow text-black disabled:opacity-30 hover:bg-gt3-yellowHover transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Category Picker Chips */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto scrollbar-none">
          {[
            { cat: 'snf2', label: '2. Snf 🏛️' },
            { cat: 'snf1', label: '1. Snf 📜' },
            { cat: 'deepwork', label: 'Startup 💻' },
            { cat: 'lib', label: 'Kütüp 📚' },
          ].map(chip => (
            <button
              key={chip.cat}
              type="button"
              onClick={() => setSelectedCategory(chip.cat as Category)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                selectedCategory === chip.cat
                  ? 'bg-slate-900 text-white dark:bg-gt3-yellow dark:text-black border-transparent shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </form>

      {/* 4. Filter Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 dark:border-gt3-borderDark/60 text-[11px] font-bold">
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'law', label: 'Hukuk ⚖️' },
          { key: 'deepwork', label: 'Startup 💻' },
          { key: 'done', label: `Biten (${completedCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key as any)}
            className={`px-2 py-1 rounded-lg transition-colors ${
              filterTab === tab.key
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-gt3-yellow'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Draggable Todo Items List (Amie Signature) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700 stroke-[1.5]" />
            <p className="text-xs font-semibold">Bu kategoride görev yok</p>
            <p className="text-[10px] mt-0.5 opacity-80">Yeni bir çalışma hedefi ekleyin</p>
          </div>
        ) : (
          filteredTodos.map(todo => {
            const badge = getCategoryBadge(todo.category);
            return (
              <div
                key={todo.id}
                draggable={true}
                onDragStart={(e) => {
                  // Pass rich drag data so MatrixGrid or CalendarGrid can receive it!
                  e.dataTransfer.setData('text/plain', `TODO:${todo.id}`);
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    type: 'todo',
                    todoId: todo.id,
                    title: todo.text,
                    category: todo.category,
                  }));
                  e.dataTransfer.effectAllowed = 'copyMove';
                }}
                className={`group relative flex items-start gap-2 p-2.5 rounded-xl border bg-white dark:bg-slate-900/60 transition-all cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gt3-yellow/60 ${
                  todo.priority 
                    ? 'border-gt3-yellow/60 ring-1 ring-gt3-yellow/20' 
                    : 'border-slate-200/90 dark:border-gt3-borderDark'
                }`}
              >
                {/* Drag Handle indicator */}
                <div className="mt-0.5 text-slate-300 dark:text-slate-600 group-hover:text-gt3-yellow transition-colors shrink-0" title="Takvime sürükleyip bırak">
                  <GripVertical className="w-3.5 h-3.5" />
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                >
                  {todo.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-4 h-4 hover:stroke-gt3-yellow" />
                  )}
                </button>

                {/* Todo Text & Badge */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug tracking-tight select-none ${
                    todo.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {todo.text}
                  </p>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.bg}`}>
                      {badge.label}
                    </span>

                    {todo.priority && (
                      <span className="text-[9px] font-bold text-yellow-600 dark:text-gt3-yellow flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Öncelikli</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions (Priority & Delete) */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onTogglePriority(todo.id)}
                    className="p-1 text-slate-400 hover:text-gt3-yellow rounded transition-colors"
                    title="Öncelik ver"
                  >
                    <Star className={`w-3.5 h-3.5 ${todo.priority ? 'fill-current text-gt3-yellow' : ''}`} />
                  </button>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 6. Footer Drag Hint (Amie style helper) */}
      <div className="p-3 border-t border-slate-200/80 dark:border-gt3-borderDark bg-slate-50/50 dark:bg-slate-900/30 text-[10.5px] text-slate-500 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gt3-yellow shrink-0" />
        <p className="leading-tight">
          💡 <i>Görevleri sağdaki takvim matrisine sürükleyip bırakarak anında zaman bloğu oluşturun.</i>
        </p>
      </div>

    </aside>
  );
};
