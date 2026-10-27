import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform
} from 'react-native';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Activity,
  Pill,
  Sparkles,
  Timer,
  MessageCircle
} from 'lucide-react-native';

interface PlanTask {
  id: string;
  title?: string;
  category: string;
  time: string;
  timeSlot?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  checked: boolean;
  day?: string;
  dateStr?: string; // e.g. "2026-10-15"
  missionVerified?: boolean;
}

interface VitalRecord {
  id: string;
  hr: number;
  bpSys: number;
  bpDia: number;
  spo2: number;
  temp: number;
  date: number;
  notes?: string;
}

interface ActualCalendarViewProps {
  planTasks: PlanTask[];
  setPlanTasks: React.Dispatch<React.SetStateAction<PlanTask[]>>;
  vitalsHistory: VitalRecord[];
  onTriggerAlert: (task: PlanTask) => void;
  onAskOgoo: (prompt: string) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ActualCalendarView: React.FC<ActualCalendarViewProps> = ({
  planTasks,
  setPlanTasks,
  vitalsHistory,
  onTriggerAlert,
  onAskOgoo,
  onClose
}) => {
  // Live per-second real-time clock
  const [currentRealTime, setCurrentRealTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar View State: Year and Month
  const today = new Date();
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00 AM');
  const [newTaskCategory, setNewTaskCategory] = useState('💊 Medicine');
  const [showAddForm, setShowAddForm] = useState(false);

  // Format date helper: "YYYY-MM-DD"
  const formatDateKey = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const selectedDateKey = formatDateKey(selectedDate);
  const todayDateKey = formatDateKey(today);

  // Real-time second-by-second countdown to the next scheduled dose / routine
  const nextScheduledDoseInfo = useMemo<{ task: PlanTask; countdownStr: string; secondsRemaining: number } | null>(() => {
    const nowMs = currentRealTime.getTime();
    let closestTimeMs: number | null = null;
    let closestTask: PlanTask | null = null;

    const todayStr = WEEKDAY_NAMES[currentRealTime.getDay()];

    planTasks.forEach(task => {
      if (task.checked) return;
      // Parse time e.g. "08:00 AM" or "02:30 PM"
      const match = task.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const taskTarget = new Date(currentRealTime);
        taskTarget.setHours(hours, minutes, 0, 0);

        // If today or matches day
        const targetMs = taskTarget.getTime();
        if (targetMs > nowMs) {
          if (closestTimeMs === null || targetMs < closestTimeMs) {
            closestTimeMs = targetMs;
            closestTask = task;
          }
        }
      }
    });

    if (closestTimeMs !== null && closestTask !== null) {
      const diffSec = Math.max(0, Math.floor((closestTimeMs - nowMs) / 1000));
      const hrs = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;
      return {
        task: closestTask,
        countdownStr: `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
        secondsRemaining: diffSec
      };
    }

    return null;
  }, [currentRealTime, planTasks]);

  // Navigate Months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(today);
  };

  // Calendar Matrix Generator
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      dateKey: string;
      tasksCount: number;
      vitalsCount: number;
    }> = [];

    // Prev month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
      const dKey = formatDateKey(d);
      cells.push({
        date: d,
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        dateKey: dKey,
        tasksCount: 0,
        vitalsCount: 0
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const dKey = formatDateKey(d);
      const dayWeekday = WEEKDAY_NAMES[d.getDay()];

      const tasksOnDay = planTasks.filter(t => {
        if (t.dateStr) return t.dateStr === dKey;
        if (t.day) return t.day === dayWeekday;
        return true;
      }).length;

      const vitalsOnDay = vitalsHistory.filter(v => {
        const vDate = new Date(v.date);
        return formatDateKey(vDate) === dKey;
      }).length;

      cells.push({
        date: d,
        dayNumber: day,
        isCurrentMonth: true,
        dateKey: dKey,
        tasksCount: tasksOnDay,
        vitalsCount: vitalsOnDay
      });
    }

    // Next month padding days to complete 35 or 42 cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(viewYear, viewMonth + 1, i);
      cells.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: false,
        dateKey: formatDateKey(d),
        tasksCount: 0,
        vitalsCount: 0
      });
    }

    return cells;
  }, [viewYear, viewMonth, planTasks, vitalsHistory]);

  // Tasks for currently selected date
  const tasksForSelectedDate = useMemo(() => {
    const selectedWeekday = WEEKDAY_NAMES[selectedDate.getDay()];
    return planTasks.filter(t => {
      if (t.dateStr) return t.dateStr === selectedDateKey;
      if (t.day) return t.day === selectedWeekday;
      return true;
    });
  }, [selectedDate, selectedDateKey, planTasks]);

  // Vitals for currently selected date
  const vitalsForSelectedDate = useMemo(() => {
    return vitalsHistory.filter(v => formatDateKey(new Date(v.date)) === selectedDateKey);
  }, [selectedDateKey, vitalsHistory]);

  // Add routine for selected date
  const handleAddNewTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: PlanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      time: newTaskTime || '08:00 AM',
      dateStr: selectedDateKey,
      day: WEEKDAY_NAMES[selectedDate.getDay()],
      checked: false
    };
    setPlanTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  // Toggle routine status
  const handleToggleTask = (task: PlanTask) => {
    if (!task.checked) {
      onTriggerAlert(task);
    } else {
      setPlanTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, checked: false, missionVerified: false } : t))
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Real-Time Live Clock Card (Updates per second) */}
      <View style={styles.liveClockCard}>
        <View style={styles.clockHeaderRow}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseRing} />
            <Clock color="#E572A3" size={18} />
          </View>
          <Text style={styles.liveClockTitle}>REAL-TIME LIVE CHRONOMETER</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>● LIVE 1s</Text>
          </View>
        </View>

        {/* Digital Clock Display with Seconds */}
        <Text style={styles.digitalClockTime}>
          {currentRealTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Text>
        <Text style={styles.digitalClockDate}>
          {currentRealTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>

        {/* Real-time Live Next Dose Countdown */}
        {nextScheduledDoseInfo ? (
          <View style={styles.countdownBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Timer color="#38bdf8" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.countdownLabel}>Next Scheduled Routine:</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.countdownTaskName} numberOfLines={1}>
                {nextScheduledDoseInfo.task.title || nextScheduledDoseInfo.task.category}
              </Text>
              <Text style={styles.countdownTimerDigits}>
                ⏳ {nextScheduledDoseInfo.countdownStr}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.allDoneBox}>
            <CheckCircle2 color="#4CAF50" size={15} style={{ marginRight: 6 }} />
            <Text style={styles.allDoneText}>All scheduled health tasks up to this second are verified!</Text>
          </View>
        )}
      </View>

      {/* Ogoo Conversational Calendar Director Banner */}
      <View style={styles.ogooDirectorBanner}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Sparkles color="#E572A3" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.ogooDirectorName}>Ogoo's Live Schedule Direction</Text>
        </View>
        <Text style={styles.ogooDirectorText}>
          "I am monitoring your entire timeline second-by-second. Select any date on the calendar to audit your past vitals, view logged doses, or schedule interval medications. I ensure zero missed doses and full compliance!"
        </Text>
        <TouchableOpacity
          onPress={() => onAskOgoo("Ogoo, review my upcoming schedule for today and tell me what health precautions I should keep in mind.")}
          style={styles.askOgooQuickChip}
        >
          <MessageCircle color="#FFF" size={13} style={{ marginRight: 4 }} />
          <Text style={styles.askOgooQuickText}>Ask Ogoo to Optimize Today's Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Actual Calendar Month Header & Navigation */}
      <View style={styles.calendarNavRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CalendarIcon color="#E572A3" size={20} style={{ marginRight: 8 }} />
          <Text style={styles.calendarMonthTitle}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrowBtn}>
            <ChevronLeft color="#FFF" size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleJumpToToday} style={styles.todayJumpBtn}>
            <Text style={styles.todayJumpText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navArrowBtn}>
            <ChevronRight color="#FFF" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday Columns Header */}
      <View style={styles.weekdayRow}>
        {WEEKDAY_NAMES.map((w, idx) => (
          <Text key={idx} style={[styles.weekdayCellText, (idx === 0 || idx === 6) && { color: '#E572A3' }]}>
            {w}
          </Text>
        ))}
      </View>

      {/* Calendar Grid Matrix */}
      <View style={styles.daysGrid}>
        {calendarDays.map((cell, idx) => {
          const isSelected = cell.dateKey === selectedDateKey;
          const isToday = cell.dateKey === todayDateKey;

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedDate(cell.date)}
              style={[
                styles.dayCell,
                !cell.isCurrentMonth && styles.dayCellOutsideMonth,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday
              ]}
            >
              <Text
                style={[
                  styles.dayNumberText,
                  !cell.isCurrentMonth && styles.dayNumberOutside,
                  isSelected && styles.dayNumberSelected,
                  isToday && !isSelected && { color: '#E572A3', fontWeight: '800' }
                ]}
              >
                {cell.dayNumber}
              </Text>

              {/* Event / Indicator Badges */}
              <View style={styles.dotsRow}>
                {cell.tasksCount > 0 && (
                  <View style={[styles.eventDot, { backgroundColor: '#E572A3' }]} />
                )}
                {cell.vitalsCount > 0 && (
                  <View style={[styles.eventDot, { backgroundColor: '#38bdf8' }]} />
                )}
              </View>

              {isToday && (
                <View style={styles.todayIndicatorDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Day Agenda Header */}
      <View style={styles.selectedDayHeader}>
        <View>
          <Text style={styles.selectedDayTitle}>
            {selectedDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
          <Text style={styles.selectedDaySub}>
            {tasksForSelectedDate.length} scheduled routines • {vitalsForSelectedDate.length} vitals readings
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddForm(prev => !prev)}
          style={styles.addTaskToggleBtn}
        >
          <Plus color="#FFF" size={15} style={{ marginRight: 4 }} />
          <Text style={styles.addTaskToggleText}>{showAddForm ? 'Cancel' : 'Add Routine'}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Add Routine for this Calendar Date Form */}
      {showAddForm && (
        <View style={styles.addRoutineCard}>
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 13, marginBottom: 8 }}>
            Add Task for {selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Routine title or medicine dose..."
            placeholderTextColor="#8e7b9e"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Time e.g. 08:00 AM"
              placeholderTextColor="#8e7b9e"
              value={newTaskTime}
              onChangeText={setNewTaskTime}
            />
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Category e.g. 💊 Medicine"
              placeholderTextColor="#8e7b9e"
              value={newTaskCategory}
              onChangeText={setNewTaskCategory}
            />
          </View>
          <TouchableOpacity onPress={handleAddNewTask} style={styles.confirmAddBtn}>
            <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 13 }}>✓ Confirm & Save to Calendar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Routines for Selected Date List */}
      <View style={{ marginBottom: 20 }}>
        {tasksForSelectedDate.length === 0 ? (
          <View style={styles.emptyDayBox}>
            <AlertCircle color="#B8A8D0" size={24} style={{ marginBottom: 6, opacity: 0.7 }} />
            <Text style={{ color: '#B8A8D0', fontSize: 13, textAlign: 'center' }}>
              No health routines or doses scheduled for this date.
            </Text>
          </View>
        ) : (
          tasksForSelectedDate.map(task => (
            <View key={task.id} style={[styles.taskItemCard, task.checked && { opacity: 0.7 }]}>
              <TouchableOpacity onPress={() => handleToggleTask(task)} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {task.checked ? (
                  <CheckCircle2 color="#4CAF50" size={22} style={{ marginRight: 10 }} />
                ) : (
                  <Circle color="#B8A8D0" size={22} style={{ marginRight: 10 }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskTitleText, task.checked && { textDecorationLine: 'line-through', color: '#B8A8D0' }]}>
                    {task.title || task.category}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 8 }}>
                    <Text style={styles.taskTimeBadge}>⏰ {task.time}</Text>
                    <Text style={styles.taskCatBadge}>{task.category}</Text>
                    {task.missionVerified && (
                      <Text style={styles.missionVerifiedBadge}>🛡️ Mission Confirmed</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Vitals Logged on Selected Date */}
        {vitalsForSelectedDate.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text style={styles.vitalsSectionHeader}>💓 Clinical Vitals Logged on this Date:</Text>
            {vitalsForSelectedDate.map(v => (
              <View key={v.id} style={styles.vitalCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>
                    BP: {v.bpSys}/{v.bpDia} mmHg • HR: {v.hr} bpm
                  </Text>
                  <Text style={{ color: '#38bdf8', fontSize: 11 }}>
                    {new Date(v.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={{ color: '#d8b4fe', fontSize: 11, marginTop: 2 }}>
                  SpO2: {v.spo2}% • Temp: {v.temp}°F {v.notes ? `• ${v.notes}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14
  },
  liveClockCard: {
    backgroundColor: '#200438',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#5c1794',
    marginBottom: 14,
    alignItems: 'center'
  },
  clockHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pulseRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E572A3',
    marginRight: 6
  },
  liveClockTitle: {
    color: '#d8b4fe',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1
  },
  liveBadge: {
    backgroundColor: 'rgba(229, 114, 163, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E572A3'
  },
  liveBadgeText: {
    color: '#E572A3',
    fontSize: 10,
    fontWeight: '800'
  },
  digitalClockTime: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  digitalClockDate: {
    color: '#d8b4fe',
    fontSize: 13,
    fontWeight: '600'
  },
  countdownBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    width: '100%',
    padding: 10,
    marginTop: 12
  },
  countdownLabel: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700'
  },
  countdownTaskName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8
  },
  countdownTimerDigits: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  allDoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)'
  },
  allDoneText: {
    color: '#4CAF50',
    fontSize: 11.5,
    fontWeight: '700'
  },
  ogooDirectorBanner: {
    backgroundColor: 'rgba(92, 23, 148, 0.35)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#5c1794'
  },
  ogooDirectorName: {
    color: '#E572A3',
    fontWeight: '800',
    fontSize: 13
  },
  ogooDirectorText: {
    color: '#f3e8ff',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8
  },
  askOgooQuickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#5c1794',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E572A3'
  },
  askOgooQuickText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700'
  },
  calendarNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  calendarMonthTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800'
  },
  navArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#200438',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#5c1794'
  },
  todayJumpBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#5c1794',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E572A3'
  },
  todayJumpText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800'
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 2
  },
  weekdayCellText: {
    flex: 1,
    textAlign: 'center',
    color: '#d8b4fe',
    fontSize: 11.5,
    fontWeight: '700'
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1b0330',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#5c1794',
    marginBottom: 14
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1.05,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 2,
    position: 'relative'
  },
  dayCellOutsideMonth: {
    opacity: 0.35
  },
  dayCellSelected: {
    backgroundColor: '#E572A3',
    shadowColor: '#E572A3',
    shadowRadius: 8,
    shadowOpacity: 0.6
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: '#E572A3'
  },
  dayNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  dayNumberOutside: {
    color: '#7e6c98'
  },
  dayNumberSelected: {
    color: '#FFFFFF',
    fontWeight: '900'
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 2
  },
  eventDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25
  },
  todayIndicatorDot: {
    position: 'absolute',
    bottom: 2,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFF'
  },
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  selectedDayTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800'
  },
  selectedDaySub: {
    color: '#d8b4fe',
    fontSize: 11
  },
  addTaskToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5c1794',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E572A3'
  },
  addTaskToggleText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700'
  },
  addRoutineCard: {
    backgroundColor: '#200438',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#5c1794',
    marginBottom: 12
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#5c1794'
  },
  confirmAddBtn: {
    backgroundColor: '#00C864',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10
  },
  emptyDayBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  taskItemCard: {
    backgroundColor: '#200438',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#5c1794'
  },
  taskTitleText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  taskTimeBadge: {
    color: '#E572A3',
    fontSize: 11,
    fontWeight: '700'
  },
  taskCatBadge: {
    color: '#d8b4fe',
    fontSize: 11
  },
  missionVerifiedBadge: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '800'
  },
  vitalsSectionHeader: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8
  },
  vitalCard: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)'
  }
});
