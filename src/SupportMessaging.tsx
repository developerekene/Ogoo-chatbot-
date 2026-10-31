import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import {
  MessageSquare,
  ArrowLeft,
  Send,
  X,
  ShieldCheck,
  Stethoscope,
  Heart,
  Flame,
  Activity,
  Plus,
  Search,
  CheckCheck,
  Clock,
  Sparkles,
  Zap,
  Trash2,
  Calendar
} from 'lucide-react-native';

const COLORS = {
  bg: '#170128',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBgActive: 'rgba(92, 23, 148, 0.35)',
  deepViolet: '#5c1794',
  accent: '#e572a3',
  lightViolet: '#d8b4fe',
  textMain: '#FFFFFF',
  textSub: '#a78bfa',
  border: 'rgba(255, 255, 255, 0.1)',
  success: '#00C864',
  warning: '#fbbf24'
};

export interface DirectMessage {
  id: string;
  senderId: string; // 'user' or participantId
  senderName: string;
  senderRole?: string;
  text: string;
  timestamp: string;
  timeMs: number;
  status: 'sent' | 'delivered' | 'read';
  attachmentType?: 'vitals_snapshot' | 'milestone_card';
  attachmentData?: {
    title: string;
    metrics?: { label: string; value: string }[];
    notes?: string;
  };
}

export interface ConversationThread {
  id: string;
  participantType: 'peer' | 'expert';
  participantId: string;
  participantName: string;
  participantTitle: string;
  participantAvatar: string;
  participantAvatarEmoji?: string;
  isVerified?: boolean;
  status: 'online' | 'active_recently' | 'offline';
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  lastMessageMs: number;
  messages: DirectMessage[];
}

export const DEFAULT_THREADS: ConversationThread[] = [];


interface SupportMessagingViewProps {
  threads: ConversationThread[];
  setThreads: React.Dispatch<React.SetStateAction<ConversationThread[]>>;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  peers: any[];
  experts: any[];
  onOpenAppointmentBooking?: (expert: any) => void;
  onAskOgoo?: (prompt: string) => void;
}

export const SupportMessagingView: React.FC<SupportMessagingViewProps> = ({
  threads,
  setThreads,
  activeThreadId,
  setActiveThreadId,
  peers,
  experts,
  onOpenAppointmentBooking,
  onAskOgoo
}) => {
  const [filterType, setFilterType] = useState<'all' | 'experts' | 'peers' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showShareVitalsModal, setShowShareVitalsModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeThread) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeThread?.messages.length, isTyping]);

  // Mark active thread as read
  useEffect(() => {
    if (activeThreadId) {
      setThreads(prev =>
        prev.map(t =>
          t.id === activeThreadId && t.unreadCount > 0
            ? { ...t, unreadCount: 0 }
            : t
        )
      );
    }
  }, [activeThreadId]);

  const handleSendMessage = (customText?: string, attachmentData?: any) => {
    const textToSend = customText !== undefined ? customText : inputText.trim();
    if (!textToSend && !attachmentData) return;
    if (!activeThread) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: 'user',
      senderName: 'You',
      text: textToSend,
      timestamp: 'Just now',
      timeMs: Date.now(),
      status: 'sent',
      attachmentType: attachmentData ? 'vitals_snapshot' : undefined,
      attachmentData: attachmentData
    };

    const currentThreadId = activeThread.id;
    const threadParticipant = { ...activeThread };

    setThreads(prev =>
      prev.map(t => {
        if (t.id === currentThreadId) {
          return {
            ...t,
            lastMessageSnippet: textToSend || (attachmentData ? 'Shared Vitals Snapshot' : 'Message'),
            lastMessageTime: 'Just now',
            lastMessageMs: Date.now(),
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );

    if (customText === undefined) {
      setInputText('');
    }
  };

  const handleStartChatWith = (type: 'peer' | 'expert', item: any) => {
    const existing = threads.find(t => t.participantId === item.id && t.participantType === type);
    if (existing) {
      setActiveThreadId(existing.id);
      setShowNewChatModal(false);
      return;
    }

    const newThreadId = `thread_${type}_${item.id}`;
    const initialGreeting =
      type === 'expert'
        ? `Hello! I am ${item.name} (${item.specialty}). Feel free to ask clinical questions, share vitals updates, or inquire about telehealth appointments.`
        : `Hey there! I am ${item.name}. Excited to connect with someone working through ${item.struggle}!`;

    const newThread: ConversationThread = {
      id: newThreadId,
      participantType: type,
      participantId: item.id,
      participantName: item.name,
      participantTitle: type === 'expert' ? item.specialty : item.struggle,
      participantAvatar: item.name.split(' ').map((n: string) => n[0]).join(''),
      isVerified: type === 'expert',
      status: 'online',
      unreadCount: 0,
      lastMessageSnippet: initialGreeting,
      lastMessageTime: 'Just now',
      lastMessageMs: Date.now(),
      messages: [
        {
          id: `init-${Date.now()}`,
          senderId: item.id,
          senderName: item.name,
          senderRole: type === 'expert' ? item.specialty : 'Peer Member',
          text: initialGreeting,
          timestamp: 'Just now',
          timeMs: Date.now(),
          status: 'read'
        }
      ]
    };

    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setShowNewChatModal(false);
  };

  const handleDeleteThread = (threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      setActiveThreadId(null);
    }
  };

  // Filter threads
  const filteredThreads = threads.filter(t => {
    if (filterType === 'experts' && t.participantType !== 'expert') return false;
    if (filterType === 'peers' && t.participantType !== 'peer') return false;
    if (filterType === 'unread' && t.unreadCount === 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.participantName.toLowerCase().includes(q) ||
        t.participantTitle.toLowerCase().includes(q) ||
        t.lastMessageSnippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Quick suggestion chips based on active participant
  const quickSuggestions = activeThread?.participantType === 'expert'
    ? [
        'Could you review my latest blood pressure logs?',
        'Is mild morning dizziness common with hydration changes?',
        'What foods help keep blood sugar and BP flat?',
        'How does morning cortisol impact resting heart rate?'
      ]
    : [
        'How did your daily walking goals go today?',
        'Box breathing has been a huge help for my stress!',
        'Loved your milestone post—keep inspiring us!',
        'Any tips for staying consistent during busy work weeks?'
      ];

  // VIEW 1: THREAD LIST
  if (!activeThread) {
    return (
      <View style={styles.container}>
        {/* Header Actions */}
        <View style={styles.listHeaderRow}>
          <View>
            <Text style={styles.sectionHeading}>Direct Health Conversations</Text>
            <Text style={styles.sectionSub}>Private, two-way messaging with clinicians & peer champions</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowNewChatModal(true)}
            style={styles.newChatBtn}
            activeOpacity={0.8}
          >
            <Plus color="#FFF" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.newChatBtnText}>New Message</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarBox}>
          <Search color={COLORS.textSub} size={16} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, specialty, or condition..."
            placeholderTextColor={COLORS.textSub}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={COLORS.textSub} size={16} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterBarRow}>
          {[
            { key: 'all', label: `All (${threads.length})` },
            { key: 'experts', label: `🩺 Clinicians (${threads.filter(t => t.participantType === 'expert').length})` },
            { key: 'peers', label: `🤝 Peers (${threads.filter(t => t.participantType === 'peer').length})` },
            { key: 'unread', label: `🔴 Unread (${threads.filter(t => t.unreadCount > 0).length})` }
          ].map(f => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilterType(f.key as any)}
              style={[
                styles.filterPill,
                filterType === f.key && styles.filterPillActive
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterType === f.key && styles.filterPillTextActive
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Thread List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {filteredThreads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageSquare color={COLORS.textSub} size={40} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No conversations found</Text>
              <Text style={styles.emptySubtitle}>
                Start a private health conversation with a verified clinician or peer match.
              </Text>
              <TouchableOpacity
                onPress={() => setShowNewChatModal(true)}
                style={styles.emptyButton}
              >
                <Plus color="#FFF" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.emptyButtonText}>Start First Conversation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredThreads.map(thread => (
              <TouchableOpacity
                key={thread.id}
                onPress={() => setActiveThreadId(thread.id)}
                style={[
                  styles.threadCard,
                  thread.unreadCount > 0 && styles.threadCardUnread
                ]}
                activeOpacity={0.7}
              >
                <View style={styles.threadAvatarBox}>
                  <Text style={styles.threadAvatarText}>{thread.participantAvatar}</Text>
                  {thread.status === 'online' && <View style={styles.onlineBadge} />}
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.threadName}>{thread.participantName}</Text>
                      {thread.isVerified && (
                        <ShieldCheck color="#00C864" size={15} style={{ marginLeft: 5 }} />
                      )}
                    </View>
                    <Text style={styles.threadTime}>{thread.lastMessageTime}</Text>
                  </View>

                  <Text style={styles.threadTitle} numberOfLines={1}>
                    {thread.participantTitle}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <Text
                      style={[
                        styles.threadSnippet,
                        thread.unreadCount > 0 && styles.threadSnippetUnread
                      ]}
                      numberOfLines={1}
                    >
                      {thread.lastMessageSnippet}
                    </Text>

                    {thread.unreadCount > 0 && (
                      <View style={styles.unreadCountBadge}>
                        <Text style={styles.unreadCountText}>{thread.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteThread(thread.id);
                  }}
                  style={styles.threadDeleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 color="rgba(255,255,255,0.3)" size={14} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}

          {/* Privacy & Legal Disclaimer Note */}
          <View style={styles.privacyNoteBox}>
            <Sparkles color="#fbbf24" size={14} style={{ marginRight: 8 }} />
            <Text style={styles.privacyNoteText}>
              ⚠️ Legal Disclaimer: Experts, peers, and advice across the Support Network are independent and not our legal responsibility or related to Ogoo. Messages are stored locally on your device.
            </Text>
          </View>
        </ScrollView>

        {/* MODAL: START NEW CHAT */}
        <Modal visible={showNewChatModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentBox}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#5c1794', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <MessageSquare color="#FFF" size={18} />
                  </View>
                  <View>
                    <Text style={styles.modalTitle}>Choose Who to Message</Text>
                    <Text style={{ color: COLORS.textSub, fontSize: 12 }}>Pick a clinician or peer</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setShowNewChatModal(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#dc2626',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 22,
                    minHeight: 44,
                    minWidth: 84,
                    borderWidth: 1.5,
                    borderColor: '#fca5a5',
                    shadowColor: '#dc2626',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                  accessibilityLabel="Close"
                >
                  <X color="#FFF" size={18} style={{ marginRight: 4 }} />
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '800' }}>Close</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 12 }}>
                Tap on any doctor or peer below to start your conversation:
              </Text>

              <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.pickerSectionTitle}>🩺 Verified Clinicians & Providers</Text>
                {experts.map(exp => (
                  <TouchableOpacity
                    key={exp.id}
                    onPress={() => handleStartChatWith('expert', exp)}
                    style={styles.pickerItemCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerAvatarBox}>
                      <Stethoscope color={COLORS.accent} size={20} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.pickerItemName}>{exp.name}</Text>
                        <ShieldCheck color="#00C864" size={15} style={{ marginLeft: 5 }} />
                      </View>
                      <Text style={styles.pickerItemSub}>{exp.specialty}</Text>
                    </View>
                    <View style={{ backgroundColor: '#5c1794', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Chat →</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <Text style={[styles.pickerSectionTitle, { marginTop: 16 }]}>🤝 Peers with Shared Health Goals</Text>
                {peers.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => handleStartChatWith('peer', p)}
                    style={styles.pickerItemCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pickerAvatarBox}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 13 }}>
                        {p.name.split(' ').map((n: string) => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.pickerItemName}>{p.name}</Text>
                      <Text style={styles.pickerItemSub}>{p.struggle}</Text>
                    </View>
                    <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Chat →</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // VIEW 2: ACTIVE 1-ON-1 CHAT
  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.chatTopBar}>
        <TouchableOpacity
          onPress={() => setActiveThreadId(null)}
          style={styles.chatBackBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#FFF" size={20} />
          <Text style={styles.chatBackText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.chatHeaderInfo}>
          <View style={styles.chatHeaderAvatar}>
            <Text style={styles.chatHeaderAvatarText}>{activeThread.participantAvatar}</Text>
            {activeThread.status === 'online' && <View style={styles.onlineBadgeSmall} />}
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.chatHeaderName} numberOfLines={1}>{activeThread.participantName}</Text>
              {activeThread.isVerified && (
                <ShieldCheck color="#00C864" size={14} style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={styles.chatHeaderRole} numberOfLines={1}>
              {activeThread.participantTitle}
            </Text>
          </View>
        </View>

        <View style={styles.chatHeaderActions}>
          <TouchableOpacity
            onPress={() => setShowShareVitalsModal(true)}
            style={styles.shareVitalsBtn}
            accessibilityLabel="Share Vitals"
          >
            <Activity color="#d8b4fe" size={14} style={{ marginRight: 4 }} />
            <Text style={styles.shareVitalsBtnText}>Share Vitals</Text>
          </TouchableOpacity>

          {activeThread.participantType === 'expert' && onOpenAppointmentBooking && (
            <TouchableOpacity
              onPress={() => {
                const exp = experts.find(e => e.id === activeThread.participantId) || experts[0];
                onOpenAppointmentBooking(exp);
              }}
              style={styles.consultBookingHeaderBtn}
            >
              <Calendar color="#FFF" size={14} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Security & Legal Responsibility Banner */}
      <View style={styles.securityBanner}>
        <Text style={styles.securityBannerText}>
          ⚠️ Legal Notice: Advice and messages from experts and peers in this chat are independent community exchanges and are not our legal responsibility or related to Ogoo. Always consult a certified doctor for medical treatment.
        </Text>
      </View>

      {/* Messages Timeline */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatMessagesArea}
        contentContainerStyle={{ paddingVertical: 14 }}
      >
        {activeThread.messages.map((msg, index) => {
          const isUser = msg.senderId === 'user';
          return (
            <View
              key={msg.id || index}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowPartner
              ]}
            >
              {!isUser && (
                <View style={styles.partnerBubbleAvatar}>
                  <Text style={styles.partnerBubbleAvatarText}>{activeThread.participantAvatar}</Text>
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.messageBubbleUser : styles.messageBubblePartner
                ]}
              >
                {!isUser && (
                  <Text style={styles.messageSenderLabel}>
                    {msg.senderName} {activeThread.isVerified ? '• Clinician' : '• Peer'}
                  </Text>
                )}

                {/* Optional Attachment Card */}
                {msg.attachmentData && (
                  <View style={styles.attachmentCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Activity color={COLORS.accent} size={15} style={{ marginRight: 6 }} />
                      <Text style={styles.attachmentTitle}>{msg.attachmentData.title}</Text>
                    </View>
                    {msg.attachmentData.metrics && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 }}>
                        {msg.attachmentData.metrics.map(m => (
                          <View key={m.label} style={styles.metricChip}>
                            <Text style={styles.metricLabel}>{m.label}:</Text>
                            <Text style={styles.metricValue}>{m.value}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {msg.attachmentData.notes && (
                      <Text style={styles.attachmentNotes}>{msg.attachmentData.notes}</Text>
                    )}
                  </View>
                )}

                <Text style={isUser ? styles.messageTextUser : styles.messageTextPartner}>
                  {msg.text}
                </Text>

                <View style={styles.messageFooterRow}>
                  <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
                  {isUser && (
                    <CheckCheck color="#a78bfa" size={13} style={{ marginLeft: 4 }} />
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {/* Real-time Typing Indicator */}
        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowPartner]}>
            <View style={styles.partnerBubbleAvatar}>
              <Text style={styles.partnerBubbleAvatarText}>{activeThread.participantAvatar}</Text>
            </View>
            <View style={[styles.messageBubble, styles.messageBubblePartner, { paddingVertical: 8 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles color={COLORS.accent} size={14} style={{ marginRight: 6 }} />
                <Text style={{ color: COLORS.textSub, fontSize: 12, fontStyle: 'italic' }}>
                  {activeThread.participantName} is drafting a response...
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Suggestion Chips */}
      <View style={styles.quickPromptsBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {quickSuggestions.map((prompt, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSendMessage(prompt)}
              style={styles.quickPromptChip}
            >
              <Text style={styles.quickPromptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.chatInputBar}>
        <TouchableOpacity
          onPress={() => setShowShareVitalsModal(true)}
          style={styles.chatAttachBtn}
          accessibilityLabel="Attach vitals"
        >
          <Activity color={COLORS.accent} size={18} />
        </TouchableOpacity>

        <TextInput
          style={styles.chatTextInput}
          placeholder={`Message ${activeThread.participantName}...`}
          placeholderTextColor={COLORS.textSub}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim()}
          style={[
            styles.chatSendBtn,
            inputText.trim() ? styles.chatSendBtnActive : styles.chatSendBtnDisabled
          ]}
        >
          <Send color="#FFF" size={16} />
        </TouchableOpacity>
      </View>

      {/* MODAL: SHARE VITALS */}
      <Modal visible={showShareVitalsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Activity color="#FFF" size={18} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Share Health Numbers</Text>
                  <Text style={{ color: COLORS.textSub, fontSize: 12 }}>1-tap easy sharing</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowShareVitalsModal(false)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#dc2626',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 22,
                  minHeight: 44,
                  minWidth: 84,
                  borderWidth: 1.5,
                  borderColor: '#fca5a5',
                  shadowColor: '#dc2626',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                accessibilityLabel="Close"
              >
                <X color="#FFF" size={18} style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '800' }}>Close</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 14 }}>
              Tap any card below to share your record into this chat:
            </Text>

            <TouchableOpacity
              onPress={() => {
                handleSendMessage('Here are my latest blood pressure and heart rate logs for clinical review:', {
                  title: '📊 Clinical Vitals Snapshot',
                  metrics: [
                    { label: 'Morning BP', value: '118/76 mmHg' },
                    { label: 'Resting HR', value: '70 BPM' },
                    { label: '7-Day Trend', value: 'Normal / Stable' }
                  ],
                  notes: 'Recorded after morning 10-minute box breathing routine'
                });
                setShowShareVitalsModal(false);
              }}
              style={[styles.vitalsShareOptionCard, { paddingVertical: 14 }]}
              activeOpacity={0.7}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(229, 114, 163, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Heart color="#e572a3" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>Blood Pressure & Pulse</Text>
                <Text style={{ color: '#d8b4fe', fontSize: 12, marginTop: 2 }}>118/76 mmHg • 70 BPM resting (Optimal)</Text>
              </View>
              <View style={{ backgroundColor: '#5c1794', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Send →</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleSendMessage('Sharing my 14-day daily movement and hydration tracking summary:', {
                  title: '🏃 Activity & Hydration Snapshot',
                  metrics: [
                    { label: 'Daily Steps', value: '10,240' },
                    { label: 'Hydration', value: '2.5 Liters' },
                    { label: 'Active Streak', value: '14 Days' }
                  ],
                  notes: 'Broken into three 20-minute daily walks'
                });
                setShowShareVitalsModal(false);
              }}
              style={[styles.vitalsShareOptionCard, { paddingVertical: 14 }]}
              activeOpacity={0.7}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(251, 191, 36, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Flame color="#fbbf24" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>Daily Steps & Water Drank</Text>
                <Text style={{ color: '#d8b4fe', fontSize: 12, marginTop: 2 }}>10,240 steps • 2.5L water • 14 days in a row</Text>
              </View>
              <View style={{ backgroundColor: '#5c1794', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Send →</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleSendMessage('Sharing my timed schedule adherence report:', {
                  title: '⏱️ Medication & Protocol Adherence',
                  metrics: [
                    { label: 'Adherence', value: '98%' },
                    { label: 'Schedule', value: 'Waking Hours Only' },
                    { label: 'PRN Lockout', value: 'Active / Safe' }
                  ],
                  notes: 'All doses logged on time with zero double-dosing alerts'
                });
                setShowShareVitalsModal(false);
              }}
              style={[styles.vitalsShareOptionCard, { paddingVertical: 14 }]}
              activeOpacity={0.7}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(167, 139, 250, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Clock color="#d8b4fe" size={24} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>Medicine On-Time Record</Text>
                <Text style={{ color: '#d8b4fe', fontSize: 12, marginTop: 2 }}>98% on-time • Doses safe from double-dosing</Text>
              </View>
              <View style={{ backgroundColor: '#5c1794', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>Send →</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8
  },
  sectionHeading: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800'
  },
  sectionSub: {
    color: COLORS.textSub,
    fontSize: 12,
    marginTop: 2
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.deepViolet,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7c3aed'
  },
  newChatBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700'
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13
  },
  filterBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 10,
    gap: 6
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  filterPillActive: {
    backgroundColor: 'rgba(229, 114, 163, 0.2)',
    borderColor: COLORS.accent
  },
  filterPillText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '600'
  },
  filterPillTextActive: {
    color: '#FFF',
    fontWeight: '700'
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  threadCardUnread: {
    backgroundColor: 'rgba(92, 23, 148, 0.25)',
    borderColor: COLORS.accent
  },
  threadAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#7c3aed'
  },
  threadAvatarText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800'
  },
  onlineBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C864',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.bg
  },
  onlineBadgeSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C864',
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  threadName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700'
  },
  threadTime: {
    color: COLORS.textSub,
    fontSize: 11
  },
  threadTitle: {
    color: COLORS.lightViolet,
    fontSize: 11,
    marginTop: 2
  },
  threadSnippet: {
    color: COLORS.textSub,
    fontSize: 12,
    flex: 1
  },
  threadSnippetUnread: {
    color: '#FFF',
    fontWeight: '600'
  },
  unreadCountBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6
  },
  unreadCountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800'
  },
  threadDeleteBtn: {
    padding: 6,
    marginLeft: 6
  },
  privacyNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  privacyNoteText: {
    color: COLORS.textSub,
    fontSize: 11,
    flex: 1
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  emptySubtitle: {
    color: COLORS.textSub,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700'
  },
  chatTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#200438',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  chatBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8
  },
  chatBackText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 6
  },
  chatHeaderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  chatHeaderAvatarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  chatHeaderName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700'
  },
  chatHeaderRole: {
    color: COLORS.lightViolet,
    fontSize: 10
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  shareVitalsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(216, 180, 254, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed'
  },
  shareVitalsBtnText: {
    color: COLORS.lightViolet,
    fontSize: 11,
    fontWeight: '700'
  },
  consultBookingHeaderBtn: {
    backgroundColor: COLORS.deepViolet,
    padding: 6,
    borderRadius: 8
  },
  securityBanner: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(251, 191, 36, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center'
  },
  securityBannerText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14
  },
  chatMessagesArea: {
    flex: 1,
    paddingHorizontal: 14
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  messageRowUser: {
    justifyContent: 'flex-end'
  },
  messageRowPartner: {
    justifyContent: 'flex-start'
  },
  partnerBubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    alignSelf: 'flex-end'
  },
  partnerBubbleAvatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 14
  },
  messageBubbleUser: {
    backgroundColor: '#380c66',
    borderBottomRightRadius: 2,
    borderWidth: 1,
    borderColor: '#7c3aed'
  },
  messageBubblePartner: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  messageSenderLabel: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4
  },
  messageTextUser: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18
  },
  messageTextPartner: {
    color: '#f3e8ff',
    fontSize: 13,
    lineHeight: 18
  },
  messageFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4
  },
  messageTimestamp: {
    color: COLORS.textSub,
    fontSize: 9
  },
  attachmentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  attachmentTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700'
  },
  metricChip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  metricLabel: {
    color: COLORS.textSub,
    fontSize: 10,
    marginRight: 3
  },
  metricValue: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700'
  },
  attachmentNotes: {
    color: COLORS.lightViolet,
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic'
  },
  quickPromptsBar: {
    paddingVertical: 6,
    backgroundColor: 'rgba(23, 1, 40, 0.95)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  quickPromptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(216, 180, 254, 0.2)'
  },
  quickPromptText: {
    color: COLORS.lightViolet,
    fontSize: 11
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#200438',
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  chatAttachBtn: {
    padding: 6,
    marginRight: 6
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    color: '#FFF',
    fontSize: 13,
    maxHeight: 80
  },
  chatSendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6
  },
  chatSendBtnActive: {
    backgroundColor: COLORS.accent
  },
  chatSendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  instantTestBtn: {
    padding: 6,
    marginLeft: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 0, 14, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContentBox: {
    backgroundColor: '#1b0730',
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    borderRadius: 24,
    padding: 22,
    borderWidth: 2,
    borderColor: '#a855f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 14,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  pickerSectionTitle: {
    color: '#d8b4fe',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 10
  },
  pickerItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    minHeight: 56,
  },
  pickerAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickerItemName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  pickerItemSub: {
    color: '#e9d5ff',
    fontSize: 13,
    marginTop: 2
  },
  pickerStartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  vitalsShareOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    minHeight: 58,
  },
  vitalsShareOptionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  vitalsShareOptionSub: {
    color: '#e9d5ff',
    fontSize: 13,
    marginTop: 2
  },
  vitalsShareSendText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});

