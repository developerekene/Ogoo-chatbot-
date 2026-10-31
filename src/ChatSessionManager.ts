import { Platform } from 'react-native';

export interface GroundingSource {
  title: string;
  uri: string;
  snippet?: string;
  sourceName?: string;
}

export interface ChatAttachment {
  type: 'image' | 'document' | 'video';
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  base64?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
  snippet?: string;
  sourceName?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  fromUser: boolean;
  imageUri?: string;
  attachment?: ChatAttachment;
  isImportant?: boolean;
  timestamp?: number;
  createdAt?: string;
  groundingSources?: GroundingSource[];
  toolActions?: Array<{ name: string; args: any }>;
  suggestedQuickPrompts?: string[];
  clinicalAlert?: { severity: 'normal' | 'moderate' | 'emergency' | string; message: string };
  modelUsed?: string;
}

export interface OgooChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  category?: string;
  isPinned?: boolean;
}

const STORAGE_KEY_SESSIONS = 'ogoo_chat_sessions_v3';
const STORAGE_KEY_ACTIVE_ID = 'ogoo_active_chat_id_v3';
const LEGACY_STORAGE_KEY = 'ogoo_chat_history_v2';

export const createDefaultIntroMessage = (): ChatMessage => ({
  id: '1',
  text: `Hello! I am **Ogoo**, your comprehensive health companion and wellness guide. 

I am embedded in every function and feature of this application to guide and support you. You can converse with me about **anything**—from medical queries, medication plans, and biometric interpretations, to general knowledge, daily life, science, and wellness.

How can I direct or assist you today?`,
  fromUser: false,
  isImportant: true,
  timestamp: Date.now(),
  createdAt: new Date().toISOString(),
  suggestedQuickPrompts: [
    '💓 Check & Log Vitals',
    '📅 Open Live Calendar',
    '⌚ Connect Smart Wearable',
    '💊 Review Medication Plan'
  ]
});

export const loadStoredChatSessions = (): OgooChatSession[] => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Check legacy single-chat migration
      const legacySaved = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacySaved) {
        const legacyMessages = JSON.parse(legacySaved);
        if (Array.isArray(legacyMessages) && legacyMessages.length > 0) {
          const firstUserMsg = legacyMessages.find((m: any) => m.fromUser);
          const title = firstUserMsg ? (firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? '...' : '')) : 'Initial Chat';
          const migratedSession: OgooChatSession = {
            id: 'session-legacy-1',
            title,
            createdAt: legacyMessages[0]?.timestamp || Date.now(),
            updatedAt: legacyMessages[legacyMessages.length - 1]?.timestamp || Date.now(),
            messages: legacyMessages
          };
          saveChatSessions([migratedSession]);
          return [migratedSession];
        }
      }
    } catch (e) {
      console.warn('Error loading chat sessions:', e);
    }
  }

  // Create initial default session
  const defaultSession: OgooChatSession = {
    id: `chat-${Date.now()}`,
    title: 'Chat with Ogoo',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [createDefaultIntroMessage()]
  };
  saveChatSessions([defaultSession]);
  return [defaultSession];
};

export const saveChatSessions = (sessions: OgooChatSession[]): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save chat sessions to localStorage:', e);
    }
  }
};

export const loadActiveChatId = (availableSessions: OgooChatSession[]): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved && availableSessions.some(s => s.id === saved)) {
        return saved;
      }
    } catch (_) {}
  }
  return availableSessions[0]?.id || `chat-${Date.now()}`;
};

export const saveActiveChatId = (id: string): void => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } catch (_) {}
  }
};

export const generateSessionTitleFromPrompt = (prompt: string): string => {
  const clean = prompt
    .replace(/[#*_`]/g, '')
    .replace(/^(please\s+|can\s+you\s+|what\s+is\s+|how\s+to\s+|tell\s+me\s+about\s+)/i, '')
    .trim();
  if (!clean) return 'New Chat';
  
  // Create a 3-5 word summary
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 'New Chat';
  
  const summaryLength = Math.min(Math.max(words.length, 3), 5);
  const summary = words.slice(0, summaryLength).join(' ');
  
  const capital = summary.charAt(0).toUpperCase() + summary.slice(1);
  return capital.length > 36 ? capital.slice(0, 36) + '...' : capital;
};

export const sortChatSessions = (
  sessions: OgooChatSession[],
  sortBy: 'recent' | 'alphabetical' | 'oldest'
): OgooChatSession[] => {
  const list = [...sessions];
  if (sortBy === 'recent') {
    return list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }
  if (sortBy === 'oldest') {
    return list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }
  if (sortBy === 'alphabetical') {
    return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }
  return list;
};

export interface ChatSessionGroup {
  label: string;
  sessions: OgooChatSession[];
}

export const groupChatSessionsByTime = (sessions: OgooChatSession[]): ChatSessionGroup[] => {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartMs = todayStart.getTime();

  const yesterdayStartMs = todayStartMs - oneDayMs;
  const sevenDaysAgoMs = todayStartMs - 7 * oneDayMs;
  const thirtyDaysAgoMs = todayStartMs - 30 * oneDayMs;

  const pinned: OgooChatSession[] = [];
  const today: OgooChatSession[] = [];
  const yesterday: OgooChatSession[] = [];
  const previous7Days: OgooChatSession[] = [];
  const previous30Days: OgooChatSession[] = [];
  const older: OgooChatSession[] = [];

  // Sort by updatedAt descending first
  const sorted = [...sessions].sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

  for (const s of sorted) {
    if (s.isPinned) {
      pinned.push(s);
      continue;
    }
    const time = s.updatedAt || s.createdAt || now;
    if (time >= todayStartMs) {
      today.push(s);
    } else if (time >= yesterdayStartMs) {
      yesterday.push(s);
    } else if (time >= sevenDaysAgoMs) {
      previous7Days.push(s);
    } else if (time >= thirtyDaysAgoMs) {
      previous30Days.push(s);
    } else {
      older.push(s);
    }
  }

  const groups: ChatSessionGroup[] = [];
  if (pinned.length > 0) groups.push({ label: 'Pinned', sessions: pinned });
  if (today.length > 0) groups.push({ label: 'Today', sessions: today });
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', sessions: yesterday });
  if (previous7Days.length > 0) groups.push({ label: 'Previous 7 Days', sessions: previous7Days });
  if (previous30Days.length > 0) groups.push({ label: 'Previous 30 Days', sessions: previous30Days });
  if (older.length > 0) groups.push({ label: 'Older', sessions: older });

  return groups;
};

