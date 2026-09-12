import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useScheduleStorage } from './hooks/useScheduleStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { SlotItem, DayOfWeek, FilterCategory, ViewMode } from './types/calendar';

import { Header } from './components/Header';
import { StatsHUD } from './components/StatsHUD';
import { FilterBar } from './components/FilterBar';
import { CalendarGrid } from './components/CalendarGrid';
import { MatrixGrid } from './components/MatrixGrid';
import { DailyAgendaView } from './components/DailyAgendaView';
import { AmieTodoSidebar } from './components/AmieTodoSidebar';
import { SlotDrawer } from './components/SlotDrawer';
import { AddSlotModal } from './components/AddSlotModal';
import { QuickSyllabusModal } from './components/QuickSyllabusModal';
import { SettingsModal } from './components/SettingsModal';
import { PrintView } from './components/PrintView';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    slots,
    todos,
    lastSaved,
    snapshots,
    restoreSnapshot,
    updateSlot,
    addSlot,
    deleteSlot,
    moveSlot,
    updateSlotStatus,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    resetToDefault,
    importSchedule,
    // Amie Todo handlers
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleTodoPriority,
    convertTodoToSlot,
    // Dynamic week engine
    weekDays,
    weekTitle,
    semesterWeekLabel,
    isCurrentWeek,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    getSlotsForDay,
  } = useScheduleStorage();

  // View Mode: 'matrix' (40 min matrix) | 'agenda' (Daily Pomodoro Agenda) | 'cards' (Kanban)
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');

  // Amie Sidebar Toggle state (Default open on wide screens)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal & Drawer states
  const [selectedSlot, setSelectedSlot] = useState<SlotItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Add Slot Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialDay, setAddModalInitialDay] = useState<DayOfWeek>('monday');
  const [addModalStartTime, setAddModalStartTime] = useState<string>('16:30');
  const [addModalEndTime, setAddModalEndTime] = useState<string>('17:30');
  const [addModalDateIso, setAddModalDateIso] = useState<string | undefined>(undefined);
  
  // Syllabus & Settings Modals
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filters
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Amie Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onToday: goToToday,
    onPrevWeek: goToPreviousWeek,
    onNextWeek: goToNextWeek,
    onToggleSidebar: () => setIsSidebarOpen(prev => !prev),
    onViewModeChange: setViewMode,
    onOpenAddModal: () => {
      setAddModalInitialDay('monday');
      setAddModalDateIso(undefined);
      setIsAddModalOpen(true);
    },
    onOpenSettings: () => setIsSettingsOpen(true),
  });

  // Handle slot card click
  const handleSlotClick = (slot: SlotItem) => {
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
  };

  // Quick add button in day column
  const handleQuickAdd = (day: DayOfWeek, dateIso?: string) => {
    setAddModalInitialDay(day);
    setAddModalDateIso(dateIso);
    setAddModalStartTime('16:30');
    setAddModalEndTime('17:30');
    setIsAddModalOpen(true);
  };

  // Cell add in 40-minute matrix
  const handleCellAdd = (day: DayOfWeek, startTime: string, endTime: string, dateIso?: string) => {
    setAddModalInitialDay(day);
    setAddModalDateIso(dateIso);
    setAddModalStartTime(startTime);
    setAddModalEndTime(endTime);
    setIsAddModalOpen(true);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSlot(null);
  };

  const todayInfo = weekDays.find(w => w.isToday);
  const todayFormatted = todayInfo 
    ? `${todayInfo.dayNumber} ${todayInfo.monthName} ${todayInfo.dayName}` 
    : 'Bugün';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gt3-black text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-gt3-yellow selection:text-black">
      
      {/* 1. Sleek Single-Row Top Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAddModal={() => {
          setAddModalInitialDay('monday');
          setAddModalDateIso(undefined);
          setAddModalStartTime('16:30');
          setAddModalEndTime('17:30');
          setIsAddModalOpen(true);
        }}
        onOpenSyllabusModal={() => setIsSyllabusOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        weekTitle={weekTitle}
        semesterWeekLabel={semesterWeekLabel}
        onPrevWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onToday={goToToday}
        isCurrentWeek={isCurrentWeek}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* 2. Main Workspace Layout: Amie Split-Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Amie Todo & Task Panel (Draggable to Calendar) */}
        <AmieTodoSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          todos={todos}
          onAddTodo={addTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onTogglePriority={toggleTodoPriority}
          todayFormatted={todayFormatted}
        />

        {/* Right: Main Calendar Canvas */}
        <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
          
          {/* Refined Telemetry Bar */}
          <StatsHUD slots={slots} />

          {/* Filters & Realtime Search Bar (Visible in Matrix and Cards mode) */}
          {viewMode !== 'agenda' && (
            <FilterBar
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {/* Active Main View */}
          <main className="flex-1 pb-10">
            {viewMode === 'matrix' && (
              <MatrixGrid
                slots={slots}
                weekDays={weekDays}
                getSlotsForDay={getSlotsForDay}
                activeFilter={activeFilter}
                searchQuery={searchQuery}
                onSlotClick={handleSlotClick}
                onCellAdd={handleCellAdd}
                onMoveSlot={moveSlot}
                onConvertTodoToSlot={convertTodoToSlot}
              />
            )}

            {viewMode === 'agenda' && (
              <DailyAgendaView
                slots={slots}
                weekDays={weekDays}
                getSlotsForDay={getSlotsForDay}
                onSlotClick={handleSlotClick}
                onUpdateSlotStatus={updateSlotStatus}
                onQuickAdd={handleQuickAdd}
              />
            )}

            {viewMode === 'cards' && (
              <CalendarGrid
                slots={slots}
                weekDays={weekDays}
                getSlotsForDay={getSlotsForDay}
                activeFilter={activeFilter}
                searchQuery={searchQuery}
                onSlotClick={handleSlotClick}
                onQuickAdd={handleQuickAdd}
                onMoveSlot={moveSlot}
                onConvertTodoToSlot={convertTodoToSlot}
              />
            )}
          </main>

          {/* Minimal Footer */}
          <footer className="no-print border-t border-slate-200 dark:border-gt3-borderDark py-3 text-center text-xs text-slate-500 dark:text-slate-500 bg-white/40 dark:bg-gt3-cardDark/30">
            <div className="max-w-[1720px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                <span className="font-mono font-bold text-slate-700 dark:text-gt3-yellow">GTCAT CALENDAR</span> • Erdal Çetin Özel Sürümü
              </p>
              <p className="text-[11px]">
                İÜHF Çift Şube • 9 Ders (63 AKTS) • Amie.so + GT3 RS Engine
              </p>
            </div>
          </footer>

        </div>
      </div>

      {/* 6. Sliding Slot Inspector & Note Drawer */}
      <SlotDrawer
        slot={selectedSlot}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdate={updateSlot}
        onDelete={deleteSlot}
        onToggleChecklist={toggleChecklistItem}
        onAddChecklist={addChecklistItem}
        onDeleteChecklist={deleteChecklistItem}
      />

      {/* 7. Add Slot Modal */}
      <AddSlotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addSlot}
        initialDay={addModalInitialDay}
        initialStartTime={addModalStartTime}
        initialEndTime={addModalEndTime}
        initialDateIso={addModalDateIso}
      />

      {/* 8. Quick Syllabus Modal */}
      <QuickSyllabusModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
      />

      {/* 9. Master Control & Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        slots={slots}
        lastSaved={lastSaved}
        snapshots={snapshots}
        onRestoreSnapshot={restoreSnapshot}
        onReset={resetToDefault}
        onImport={importSchedule}
      />

      {/* 10. Pure Print Layout (Shown only in print preview / Ctrl+P) */}
      <PrintView slots={slots} />

    </div>
  );
}

export default App;
