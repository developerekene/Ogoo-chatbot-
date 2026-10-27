import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Image,
  Alert,
  Platform,
  Dimensions,
  Share
} from 'react-native';
import {
  ArrowLeft,
  X,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Search,
  Check,
  CheckCircle,
  Clock,
  Calendar,
  Sparkles,
  Stethoscope,
  Award,
  Send,
  Trash2,
  Globe,
  Lock,
  Flame,
  ThumbsUp,
  Smile,
  ShieldCheck,
  Tag,
  Filter,
  UserPlus,
  UserCheck,
  Zap,
  Info,
  ChevronRight,
  RefreshCcw,
  FileText,
  MessageSquare,
  Briefcase,
  MapPin,
  CreditCard,
  Phone,
  ShieldAlert
} from 'lucide-react-native';
import {
  SupportMessagingView,
  DEFAULT_THREADS,
  ConversationThread,
  DirectMessage
} from './SupportMessaging';

const COLORS = {
  bg: '#170128',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBgActive: 'rgba(92, 23, 148, 0.35)',
  deepViolet: '#5c1794',
  accent: '#e572a3',
  lightViolet: '#d8b4fe',
  textMain: '#FFFFFF',
  textSub: '#a78bfa',
  border: '#5c1794',
  borderSubtle: 'rgba(255, 255, 255, 0.1)',
  online: '#00C864',
  danger: '#FF4B4B',
  gold: '#fbbf24',
};

export interface SocialComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  isExpert?: boolean;
  text: string;
  timestamp: string;
  timeMs: number;
  likes: number;
  userLiked?: boolean;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: string;
  isExpert?: boolean;
  isVerified?: boolean;
  groupId?: string;
  groupName?: string;
  isPersonalStory?: boolean;
  title?: string;
  content: string;
  timestamp: string;
  timeMs: number;
  tags: string[];
  milestone?: string;
  mood?: string;
  supports: number;
  userSupported: boolean;
  claps: number;
  userClapped: boolean;
  bookmarks: number;
  userBookmarked: boolean;
  comments: SocialComment[];
}

export interface SupportCircle {
  id: string;
  name: string;
  category: string;
  description: string;
  memberCount: number;
  joined: boolean;
  isPrivate: boolean;
  meetingSchedule: string;
  avatarEmoji: string;
  tags: string[];
  facilitator: string;
  recentActivity: string;
}

export interface SupportExpert {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  clinic: string;
  bio: string;
  schedule: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string;
  tags: string[];
  consultationsHeld: number;
  isSaved?: boolean;
}

export interface SupportPeer {
  id: string;
  name: string;
  age: number;
  struggle: string;
  bio: string;
  milestone: string;
  activeStatus: string;
  tags: string[];
  location: string;
  isConnected: boolean;
  mutualInterests: string[];
}

export interface CareService {
  id: string;
  name: string;
  title: string;
  agency?: string;
  category: 'nursing' | 'caregiver' | 'therapy' | 'nutrition' | 'mental_health' | 'transport' | 'respite' | 'phlebotomy';
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  location: string;
  serviceRadius: string;
  insuranceAccepted: string[];
  verified: boolean;
  backgroundChecked: boolean;
  availability: string;
  specialties: string[];
  bio: string;
  avatarText: string;
  phone?: string;
}

export interface CareBooking {
  id: string;
  serviceId: string;
  providerName: string;
  serviceTitle: string;
  serviceCategory: string;
  patientName: string;
  patientPhone: string;
  address: string;
  preferredDate: string;
  preferredTimeSlot: string;
  careNotes: string;
  paymentMethod: 'Insurance' | 'Self-Pay / Card';
  insuranceProvider?: string;
  status: 'Pending Confirmation' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: number;
}

export const DEFAULT_CARE_SERVICES: CareService[] = [
  {
    id: 'cs1',
    name: 'Nurse Evelyn Wright, BSN, RN, CWCN',
    title: 'Certified Wound Care & Mobile Infusion Nurse',
    agency: 'Horizon Clinical Home Health',
    category: 'nursing',
    categoryLabel: '🩺 In-Home Clinical Nursing',
    rating: 4.9,
    reviewCount: 76,
    hourlyRate: '$65 / hr • $95 / visit',
    location: 'Metro Boston & Suburbs',
    serviceRadius: '30-mile coverage',
    insuranceAccepted: ['Medicare', 'BlueCross', 'Aetna', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Available Today • 24/7 On-Call',
    specialties: ['Post-Op Surgical Wound Care', 'IV Infusion Therapy', 'Vitals & Diabetic Foot Care'],
    bio: 'Over 14 years acute clinical experience. Specializing in home sterile dressing changes, PICC line maintenance, and medication administration.',
    avatarText: 'EW',
    phone: '+1 (617) 555-0192'
  },
  {
    id: 'cs2',
    name: 'Marcus Sterling, CNA, PCA',
    title: 'Lead Patient Care Assistant & Mobility Escort',
    agency: 'Empower Home Caregivers',
    category: 'caregiver',
    categoryLabel: '🧑‍🦼 Caregiver & Home Health Aide',
    rating: 5.0,
    reviewCount: 112,
    hourlyRate: '$34 / hr',
    location: 'Greater Boston Area',
    serviceRadius: '25-mile coverage',
    insuranceAccepted: ['Medicaid', 'MassHealth', 'Long-Term Care Ins', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Immediate • Weekday Mornings & Evenings',
    specialties: ['ADL Assistance', 'Fall Prevention', 'Safe Transfers', 'Bed Bathing & Grooming'],
    bio: 'Certified Patient Care Assistant dedicated to respectful, dignified personal care, safe wheelchair/bed transfers, and medication reminders.',
    avatarText: 'MS',
    phone: '+1 (617) 555-0288'
  },
  {
    id: 'cs3',
    name: 'Dr. Alicia Ramos, PT, DPT, GCS',
    title: 'Board-Certified Geriatric Clinical Specialist & Physical Therapist',
    agency: 'Kinetic In-Home Rehab PT',
    category: 'therapy',
    categoryLabel: '🏃 In-Home Physical Therapy',
    rating: 4.9,
    reviewCount: 54,
    hourlyRate: '$90 / session',
    location: 'Cambridge & North Shore',
    serviceRadius: '20-mile coverage',
    insuranceAccepted: ['Medicare Part B', 'UnitedHealthcare', 'Cigna', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Mon / Wed / Fri • 8 AM - 6 PM',
    specialties: ['Balance & Vestibular Rehab', 'Post-Stroke Recovery', 'Gait Training', 'Home Ergonomics'],
    bio: 'Doctor of Physical Therapy bringing complete rehabilitation equipment into your home. Tailored regimens for fall prevention, stroke rehab, and safe walking.',
    avatarText: 'AR',
    phone: '+1 (617) 555-0377'
  },
  {
    id: 'cs4',
    name: 'Nadia Farooq, MS, RD, LDN',
    title: 'Clinical Renal & Diabetic Dietitian',
    agency: 'Metabolic Vitality Nutrition',
    category: 'nutrition',
    categoryLabel: '🥗 Clinical Nutrition & Meal Planning',
    rating: 4.8,
    reviewCount: 39,
    hourlyRate: '$75 / consultation',
    location: 'In-Home & Tele-Health',
    serviceRadius: 'Statewide / Virtual',
    insuranceAccepted: ['Medicare', 'BlueCross', 'Tufts', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Tuesdays & Thursdays',
    specialties: ['Low-Sodium Renal Menus', 'Continuous Glucose Balancing', 'Anti-Inflammatory Diets'],
    bio: 'Helping patients and caregivers design pantry-friendly, culturally inclusive meal plans that protect kidneys and stabilize daily blood sugars.',
    avatarText: 'NF',
    phone: '+1 (617) 555-0466'
  },
  {
    id: 'cs5',
    name: 'Beacon Care Transit LLC',
    title: 'Non-Emergency Wheelchair & Stretcher Medical Transport',
    agency: 'Beacon Certified Medical Logistics',
    category: 'transport',
    categoryLabel: '🚐 Medical Transport & Mobility Escort',
    rating: 4.9,
    reviewCount: 148,
    hourlyRate: '$45 base + $2.80/mile',
    location: 'Statewide Fleet Dispatch',
    serviceRadius: '50-mile coverage',
    insuranceAccepted: ['Medicaid / PT1', 'Medicare Advantage', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: '24/7 Advance & Same-Day Dispatch',
    specialties: ['Hydraulic Lift Wheelchair Vans', 'Door-Through-Door Escort', 'Dialysis & Oncology Transit'],
    bio: 'CPR-certified drivers providing compassionate door-through-door assistance for hospital discharges, dialysis schedules, and specialty clinic visits.',
    avatarText: 'BT',
    phone: '+1 (617) 555-0555'
  },
  {
    id: 'cs6',
    name: 'Gentle Haven Respite & Night Sitters',
    title: 'Overnight Respite & Dementia Safety Sitting',
    agency: 'Gentle Haven Care Alliance',
    category: 'respite',
    categoryLabel: '🌙 Respite & Overnight Care',
    rating: 5.0,
    reviewCount: 68,
    hourlyRate: '$28 - $36 / hr',
    location: 'Metropolitan Region',
    serviceRadius: '35-mile coverage',
    insuranceAccepted: ['State Respite Grants', 'VA Aid & Attendance', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Overnight Shifts (8 PM - 8 AM)',
    specialties: ['Sundowning & Dementia Care', 'Wandering Prevention', 'Family Caregiver Relief'],
    bio: 'Giving family caregivers the restful sleep they desperately need while trained sitters monitor safety, midnight medication, and gentle reassurance.',
    avatarText: 'GH',
    phone: '+1 (617) 555-0644'
  },
  {
    id: 'cs7',
    name: 'MobileLab Express Phlebotomy',
    title: 'At-Home Certified Phlebotomist & Specimen Courier',
    agency: 'MobileLab Clinical Diagnostics',
    category: 'phlebotomy',
    categoryLabel: '🩸 Mobile Blood Draw & Lab Courier',
    rating: 4.9,
    reviewCount: 92,
    hourlyRate: '$55 / home visit draw',
    location: 'Metropolitan Area',
    serviceRadius: '25-mile coverage',
    insuranceAccepted: ['LabCorp / Quest Direct Order', 'Medicare', 'Self-Pay'],
    verified: true,
    backgroundChecked: true,
    availability: 'Mon - Sat • Early Morning 6 AM - 12 PM',
    specialties: ['Difficult Vein Venipuncture', 'Pediatric & Geriatric Draws', 'Stat Lab Delivery'],
    bio: 'Certified mobile phlebotomy specialists performing gentle, stress-free blood draws in the comfort of your home, transported directly to accredited labs.',
    avatarText: 'ML',
    phone: '+1 (617) 555-0733'
  }
];

interface SupportNetworkProps {
  onBack: () => void;
  onAskOgoo: (prompt: string) => void;
}

const DEFAULT_CIRCLES: SupportCircle[] = [
  {
    id: 'c1',
    name: 'Cardio Vitality & Blood Pressure Circle',
    category: 'Cardiovascular',
    description: 'A compassionate community sharing blood pressure management strategies, low-sodium cooking tips, and daily heart-rate tracking habits.',
    memberCount: 248,
    joined: true,
    isPrivate: false,
    meetingSchedule: 'Every Wednesday • 6:00 PM EST',
    avatarEmoji: '❤️',
    tags: ['Hypertension', 'Cardio', 'Nutrition'],
    facilitator: 'Dr. Sarah Jenkins (Advisor)',
    recentActivity: 'New live check-in today'
  },
  {
    id: 'c2',
    name: 'Stress, Anxiety & Mindful Breathing',
    category: 'Mental Health',
    description: 'Daily 15-minute decompression sessions, vagus nerve stimulation techniques, somatic breathwork, and peer mental wellness support.',
    memberCount: 412,
    joined: false,
    isPrivate: false,
    meetingSchedule: 'Daily • 8:00 AM & 7:30 PM EST',
    avatarEmoji: '🧘',
    tags: ['Anxiety', 'Breathwork', 'Mindfulness'],
    facilitator: 'Elena Rostova, LMFT',
    recentActivity: '32 members checked in'
  },
  {
    id: 'c3',
    name: 'Healthy Living & Diabetes Navigators',
    category: 'Metabolic Health',
    description: 'Peer-led forum for continuous glucose monitoring (CGM), A1C stabilization, balanced low-glycemic meal planning, and gentle daily movement.',
    memberCount: 310,
    joined: true,
    isPrivate: false,
    meetingSchedule: 'Tuesdays & Thursdays • 5:00 PM EST',
    avatarEmoji: '🥗',
    tags: ['Pre-Diabetes', 'A1C', 'Glucose'],
    facilitator: 'David Chen, MS, RD',
    recentActivity: 'Active discussion on dinner recipes'
  },
  {
    id: 'c4',
    name: 'Caregiver Haven & Family Support',
    category: 'Caregiving',
    description: 'A safe sanctuary for family caregivers and champions managing medication regimens and emotional balance for loved ones.',
    memberCount: 165,
    joined: false,
    isPrivate: true,
    meetingSchedule: 'Saturdays • 11:00 AM EST',
    avatarEmoji: '🤝',
    tags: ['Caregivers', 'ChronicIllness', 'Support'],
    facilitator: 'Community Peer Leads',
    recentActivity: 'Weekly circle summary posted'
  },
  {
    id: 'c5',
    name: 'Restorative Sleep & Circadian Reset',
    category: 'Sleep Health',
    description: 'Evidence-based wind-down protocols, sleep hygiene improvements, and insomnia recovery supported by certified sleep specialists.',
    memberCount: 280,
    joined: false,
    isPrivate: false,
    meetingSchedule: 'Sundays • 7:00 PM EST',
    avatarEmoji: '🌙',
    tags: ['SleepApnea', 'Insomnia', 'REM'],
    facilitator: 'Dr. Maya Patel, MD',
    recentActivity: 'Shared 10-step evening routine'
  },
  {
    id: 'c6',
    name: 'Post-Op Recovery & Gentle Mobility',
    category: 'Physical Rehab',
    description: 'Recovering patients sharing daily walking milestones, physical therapy encouragement, and pain management tips after procedures.',
    memberCount: 140,
    joined: false,
    isPrivate: false,
    meetingSchedule: 'Mondays & Fridays • 10:00 AM EST',
    avatarEmoji: '🏃',
    tags: ['Rehab', 'PostOp', 'PhysicalTherapy'],
    facilitator: 'Dr. Marcus Vance, PT',
    recentActivity: 'Step count leaderboard active'
  }
];

const DEFAULT_EXPERTS: SupportExpert[] = [
  {
    id: 'e1',
    name: 'Dr. Sarah Jenkins, MD, FACC',
    specialty: 'Cardiologist & Preventive Health Specialist',
    credentials: 'Board Certified Cardiology • Johns Hopkins Fellow',
    clinic: 'Metropolitan Heart & Vascular Institute',
    bio: 'Specializing in autonomic blood pressure regulation, resting heart rate optimization, and lifestyle-integrated cardiology care.',
    schedule: 'Available for 1-on-1 Telehealth • Mon / Wed / Fri',
    rating: 4.9,
    reviewCount: 84,
    verified: true,
    location: 'Boston, MA (Telehealth Nationwide)',
    tags: ['Cardiology', 'Hypertension', 'Preventive'],
    consultationsHeld: 320,
    isSaved: true
  },
  {
    id: 'e2',
    name: 'Elena Rostova, LMFT, BC-TMH',
    specialty: 'Clinical Health Psychologist & Stress Coach',
    credentials: 'Licensed Marriage & Family Therapist • Board Certified Telehealth',
    clinic: 'Mindful Somatic Wellness Center',
    bio: 'Dedicated to helping individuals manage chronic illness anxiety, white-coat tension, habit formation, and nervous system regulation.',
    schedule: 'Consultations • Tue / Thu / Sat',
    rating: 5.0,
    reviewCount: 62,
    verified: true,
    location: 'Austin, TX (Online Consultations)',
    tags: ['MentalHealth', 'Anxiety', 'SomaticBreath'],
    consultationsHeld: 240
  },
  {
    id: 'e3',
    name: 'David Chen, MS, RD, CDCES',
    specialty: 'Certified Clinical Dietitian & Diabetes Educator',
    credentials: 'MS Clinical Nutrition • Certified Diabetes Care Specialist',
    clinic: 'Integrative Nutrition & Metabolic Health',
    bio: 'Practical, anti-inflammatory nutrition planning, sodium reduction without taste sacrifice, and blood glucose stability blueprints.',
    schedule: 'Advising Hours • Mon - Fri 9am - 4pm EST',
    rating: 4.8,
    reviewCount: 110,
    verified: true,
    location: 'San Francisco, CA',
    tags: ['Nutrition', 'Diabetes', 'Dietetics'],
    consultationsHeld: 450
  },
  {
    id: 'e4',
    name: 'Dr. Maya Patel, MD, ABSM',
    specialty: 'Sleep Medicine & Circadian Specialist',
    credentials: 'American Board of Sleep Medicine • Neurologist',
    clinic: 'Restorative Sleep & Brain Health Clinic',
    bio: 'Restoring deep sleep and REM architecture for patients with insomnia, sleep apnea recovery, and chronic fatigue.',
    schedule: 'Wednesdays & Fridays Telehealth',
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    location: 'Chicago, IL',
    tags: ['SleepMedicine', 'Insomnia', 'Circadian'],
    consultationsHeld: 190
  }
];

const DEFAULT_PEERS: SupportPeer[] = [
  {
    id: 'p1',
    name: 'Jordan Taylor',
    age: 38,
    struggle: 'Hypertension & Work-Related Stress',
    bio: 'Diagnosed with stage-1 hypertension 10 months ago. Focused on lowering resting HR, 10k daily steps, and box breathing.',
    milestone: 'Resting HR lowered from 84 to 68 BPM',
    activeStatus: 'Active in Cardio Circle • Online now',
    tags: ['Hypertension', '10kSteps', 'Mindfulness'],
    location: 'Denver, CO',
    isConnected: true,
    mutualInterests: ['Cardio Circle', 'Low-Sodium Meal Prep']
  },
  {
    id: 'p2',
    name: 'Maya Sullivan',
    age: 45,
    struggle: 'Post-Op Cardiac Rehab & Lifestyle Reset',
    bio: 'Recovering from cardiac intervention. Passionate about heart-healthy culinary experiments and sharing daily recovery walks.',
    milestone: 'Walked 5 miles uninterrupted this week',
    activeStatus: 'Active today in Recovery Group',
    tags: ['PostOp', 'Walking', 'HeartSafeRecipes'],
    location: 'Seattle, WA',
    isConnected: false,
    mutualInterests: ['Heart Recovery', 'Nutrition']
  },
  {
    id: 'p3',
    name: 'Alex Rivera',
    age: 29,
    struggle: 'Chronic Insomnia & Screen Fatigue',
    bio: 'Engineer tackling evening screen time and nervous system wind-down. 30-day streak of no screens 60 min before bed.',
    milestone: 'Averaging 7.5 hrs uninterrupted sleep',
    activeStatus: 'Online in Sleep Circle',
    tags: ['SleepHygiene', 'Circadian', 'NoScreens'],
    location: 'New York, NY',
    isConnected: false,
    mutualInterests: ['Sleep Circle', 'Stress Reduction']
  },
  {
    id: 'p4',
    name: 'Priya Mehta',
    age: 52,
    struggle: 'Type-2 Pre-Diabetes & Hydration Goals',
    bio: 'Reversed my A1C from 6.4 down to 5.6 by tracking water intake, 20-minute post-meal walks, and daily fiber goals.',
    milestone: 'A1C normalized to 5.6 & sustained for 6 months',
    activeStatus: 'Active 2h ago',
    tags: ['PreDiabetes', 'A1CReversal', 'Hydration'],
    location: 'Atlanta, GA',
    isConnected: true,
    mutualInterests: ['Diabetes Navigators', 'Hydration Habits']
  }
];

const DEFAULT_POSTS: SocialPost[] = [];

export const SupportNetworkPage: React.FC<SupportNetworkProps> = ({ onBack, onAskOgoo }) => {
  // Navigation
  const [activeMainTab, setActiveMainTab] = useState<'feed' | 'circles' | 'experts' | 'peers' | 'messages' | 'marketplace' | 'my_activity'>('feed');
  const [feedFilter, setFeedFilter] = useState<'all' | 'my_circles' | 'stories' | 'expert_qa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Care Service Marketplace State
  const [careServices, setCareServices] = useState<CareService[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_care_marketplace_services_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_CARE_SERVICES;
  });

  const [careBookings, setCareBookings] = useState<CareBooking[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_care_marketplace_bookings_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  const [marketplaceCategoryFilter, setMarketplaceCategoryFilter] = useState<string>('All');
  const [marketplaceInsuranceFilter, setMarketplaceInsuranceFilter] = useState<string>('All');
  const [marketplaceSubTab, setMarketplaceSubTab] = useState<'browse' | 'my_bookings'>('browse');

  // Booking Modal State
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<CareService | null>(null);
  const [bookingPatientName, setBookingPatientName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('Morning (9 AM - 12 PM)');
  const [bookingCareNotes, setBookingCareNotes] = useState('');
  const [bookingPaymentType, setBookingPaymentType] = useState<'Insurance' | 'Self-Pay / Card'>('Insurance');
  const [bookingInsuranceName, setBookingInsuranceName] = useState('Medicare Part B');

  // List Service Modal State
  const [showListServiceModal, setShowListServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceAgency, setNewServiceAgency] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'nursing' | 'caregiver' | 'therapy' | 'nutrition' | 'mental_health' | 'transport' | 'respite' | 'phlebotomy'>('nursing');
  const [newServiceRate, setNewServiceRate] = useState('');
  const [newServiceLocation, setNewServiceLocation] = useState('');
  const [newServiceRadius, setNewServiceRadius] = useState('25-mile radius');
  const [newServiceBio, setNewServiceBio] = useState('');
  const [newServiceSpecialties, setNewServiceSpecialties] = useState('');
  const [newServicePhone, setNewServicePhone] = useState('');

  // Sync Care Services and Bookings
  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_care_marketplace_services_v1', JSON.stringify(careServices));
    }
  }, [careServices]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_care_marketplace_bookings_v1', JSON.stringify(careBookings));
    }
  }, [careBookings]);

  // Direct Messaging State
  const [threads, setThreads] = useState<ConversationThread[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_support_threads_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_THREADS;
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Sync threads to localStorage
  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_support_threads_v2', JSON.stringify(threads));
    }
  }, [threads]);

  const handleOpenChatWith = (type: 'peer' | 'expert', item: any) => {
    let thread = threads.find(t => t.participantId === item.id && t.participantType === type);
    if (!thread) {
      const newThreadId = `thread_${type}_${item.id}`;
      const greeting = type === 'expert'
        ? `Hello! I am ${item.name} (${item.specialty}). Feel free to ask clinical questions or review vitals trends here.`
        : `Hey! I am ${item.name}. Excited to connect with someone walking a similar health path!`;

      thread = {
        id: newThreadId,
        participantType: type,
        participantId: item.id,
        participantName: item.name,
        participantTitle: type === 'expert' ? item.specialty : item.struggle,
        participantAvatar: item.name.split(' ').map((n: string) => n[0]).join(''),
        isVerified: type === 'expert',
        status: 'online',
        unreadCount: 0,
        lastMessageSnippet: greeting,
        lastMessageTime: 'Just now',
        lastMessageMs: Date.now(),
        messages: [
          {
            id: `init-${Date.now()}`,
            senderId: item.id,
            senderName: item.name,
            senderRole: type === 'expert' ? item.specialty : 'Peer Member',
            text: greeting,
            timestamp: 'Just now',
            timeMs: Date.now(),
            status: 'read'
          }
        ]
      };
      setThreads(prev => [thread!, ...prev]);
    }
    setActiveThreadId(thread.id);
    setActiveMainTab('messages');
  };

  // Data Stores
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_social_posts_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_POSTS;
  });

  const [circles, setCircles] = useState<SupportCircle[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_social_circles_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_CIRCLES;
  });

  const [experts, setExperts] = useState<SupportExpert[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_social_experts_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_EXPERTS;
  });

  const [peers, setPeers] = useState<SupportPeer[]>(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('ogoo_social_peers_v2');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return DEFAULT_PEERS;
  });

  // Post Creator Modal State
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [postDestination, setPostDestination] = useState<'public' | 'story' | string>('public');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postMilestone, setPostMilestone] = useState('');
  const [postMood, setPostMood] = useState('Feeling Hopeful 🌱');
  const [includeMilestone, setIncludeMilestone] = useState(false);

  // Circle Creator Modal State
  const [showCreateCircleModal, setShowCreateCircleModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState('Cardiovascular');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [newCircleSchedule, setNewCircleSchedule] = useState('Weekly • Thursdays at 6:30 PM EST');
  const [newCirclePrivate, setNewCirclePrivate] = useState(false);
  const [newCircleEmoji, setNewCircleEmoji] = useState('❤️');

  // Peer Encouragement / Message Modal
  const [selectedPeerForMsg, setSelectedPeerForMsg] = useState<SupportPeer | null>(null);
  const [peerEncouragementNote, setPeerEncouragementNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expert Consultation Booking Modal
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState<SupportExpert | null>(null);
  const [expertBookingDate, setExpertBookingDate] = useState('Next Tuesday, 2:00 PM EST');
  const [bookingReason, setBookingReason] = useState('Routine review of blood pressure trends and medication schedule');

  // Expanded Comment Thread IDs
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputText, setCommentInputText] = useState<{ [postId: string]: string }>({});

  // Sync stores to localStorage
  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_social_posts_v2', JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_social_circles_v2', JSON.stringify(circles));
    }
  }, [circles]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_social_experts_v2', JSON.stringify(experts));
    }
  }, [experts]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      localStorage.setItem('ogoo_social_peers_v2', JSON.stringify(peers));
    }
  }, [peers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Handle Post Creation
  const handlePublishPost = () => {
    if (!postContent.trim()) {
      alert('Please write some content for your post.');
      return;
    }

    let groupObj: SupportCircle | undefined;
    if (postDestination !== 'public' && postDestination !== 'story') {
      groupObj = circles.find(c => c.id === postDestination);
    }

    const tagList = postTags
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith('#') ? t : `#${t}`);

    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      authorName: 'You (Community Member)',
      authorHandle: '@you_wellness',
      authorAvatar: 'YOU',
      authorRole: postDestination === 'story' ? 'Health Storyteller' : groupObj ? `${groupObj.name} Member` : 'Community Champion',
      groupId: groupObj?.id,
      groupName: groupObj?.name,
      isPersonalStory: postDestination === 'story',
      title: postTitle.trim() || undefined,
      content: postContent.trim(),
      timestamp: 'Just now',
      timeMs: Date.now(),
      tags: tagList.length > 0 ? tagList : ['#HealthJourney', '#Wellness'],
      milestone: includeMilestone && postMilestone.trim() ? `🎯 ${postMilestone.trim()}` : undefined,
      mood: postMood,
      supports: 1,
      userSupported: true,
      claps: 0,
      userClapped: false,
      bookmarks: 0,
      userBookmarked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
    setPostMilestone('');
    setIncludeMilestone(false);
    setShowCreatePostModal(false);
  };

  // Handle Circle Creation
  const handleCreateCircle = () => {
    if (!newCircleName.trim() || !newCircleDescription.trim()) {
      alert('Please provide a circle name and description.');
      return;
    }

    const newCircle: SupportCircle = {
      id: 'c-' + Date.now(),
      name: newCircleName.trim(),
      category: newCircleCategory,
      description: newCircleDescription.trim(),
      memberCount: 1,
      joined: true,
      isPrivate: newCirclePrivate,
      meetingSchedule: newCircleSchedule.trim() || 'Schedule TBD by Circle Members',
      avatarEmoji: newCircleEmoji,
      tags: [newCircleCategory, 'PeerSupport'],
      facilitator: 'You (Circle Founder)',
      recentActivity: 'Circle created today'
    };

    setCircles([newCircle, ...circles]);
    setNewCircleName('');
    setNewCircleDescription('');
    setShowCreateCircleModal(false);
    showToast(`🌟 Support Circle "${newCircle.name}" created and published!`);
  };

  // Toggle Join/Leave Circle
  const toggleJoinCircle = (circleId: string) => {
    setCircles(prev =>
      prev.map(c => {
        if (c.id === circleId) {
          const nextJoined = !c.joined;
          const nextCount = nextJoined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1);
          showToast(nextJoined ? `Joined ${c.name} ✓` : `Left ${c.name}`);
          return { ...c, joined: nextJoined, memberCount: nextCount };
        }
        return c;
      })
    );
  };

  // Toggle Reaction on Post
  const handleToggleReaction = (postId: string, reactionType: 'support' | 'clap' | 'bookmark') => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          if (reactionType === 'support') {
            const nextVal = !p.userSupported;
            return {
              ...p,
              userSupported: nextVal,
              supports: nextVal ? p.supports + 1 : Math.max(0, p.supports - 1)
            };
          } else if (reactionType === 'clap') {
            const nextVal = !p.userClapped;
            return {
              ...p,
              userClapped: nextVal,
              claps: nextVal ? p.claps + 1 : Math.max(0, p.claps - 1)
            };
          } else if (reactionType === 'bookmark') {
            const nextVal = !p.userBookmarked;
            showToast(nextVal ? 'Saved to your Bookmarks 🔖' : 'Removed from Bookmarks');
            return {
              ...p,
              userBookmarked: nextVal,
              bookmarks: nextVal ? p.bookmarks + 1 : Math.max(0, p.bookmarks - 1)
            };
          }
        }
        return p;
      })
    );
  };

  // Add Comment to Post
  const handleAddComment = (postId: string) => {
    const text = (commentInputText[postId] || '').trim();
    if (!text) return;

    const newComment: SocialComment = {
      id: 'comm-' + Date.now(),
      authorName: 'You',
      authorAvatar: 'YOU',
      authorRole: 'Community Member',
      text,
      timestamp: 'Just now',
      timeMs: Date.now(),
      likes: 1,
      userLiked: true
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment]
          };
        }
        return p;
      })
    );

    setCommentInputText(prev => ({ ...prev, [postId]: '' }));
    showToast('💬 Comment added to thread!');
  };

  // Send Direct Encouragement Note to Peer
  const handleSendPeerEncouragement = () => {
    if (!selectedPeerForMsg) return;
    const peer = selectedPeerForMsg;
    const note = peerEncouragementNote.trim() || 'Keep going! You are doing amazing work for your health 💪';
    
    // update peer connected status
    setPeers(prev =>
      prev.map(p => {
        if (p.id === peer.id) {
          return { ...p, isConnected: true };
        }
        return p;
      })
    );

    // Also record in direct messages
    const threadId = `thread_peer_${peer.id}`;
    const userMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      text: note,
      timestamp: 'Just now',
      timeMs: Date.now(),
      status: 'sent'
    };

    setThreads(prev => {
      const existing = prev.find(t => t.participantId === peer.id && t.participantType === 'peer');
      if (existing) {
        return prev.map(t =>
          t.id === existing.id
            ? {
                ...t,
                lastMessageSnippet: note,
                lastMessageTime: 'Just now',
                lastMessageMs: Date.now(),
                messages: [...t.messages, userMsg]
              }
            : t
        );
      } else {
        const newThread: ConversationThread = {
          id: threadId,
          participantType: 'peer',
          participantId: peer.id,
          participantName: peer.name,
          participantTitle: peer.struggle,
          participantAvatar: peer.name.split(' ').map((n: string) => n[0]).join(''),
          status: 'online',
          unreadCount: 0,
          lastMessageSnippet: note,
          lastMessageTime: 'Just now',
          lastMessageMs: Date.now(),
          messages: [userMsg]
        };
        return [newThread, ...prev];
      }
    });

    showToast(`✨ Encouragement sent to ${peer.name}! Check Direct Messages for thread.`);
    setSelectedPeerForMsg(null);
    setPeerEncouragementNote('');
  };

  // Book Consultation with Specialist
  const handleConfirmBooking = () => {
    if (!selectedExpertForBooking) return;
    showToast(`📅 Consultation booked with ${selectedExpertForBooking.name} for ${expertBookingDate}! Telehealth link added.`);
    setSelectedExpertForBooking(null);
  };

  // Filter Posts
  const filteredPosts = posts.filter(post => {
    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchTag = post.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchAuthor && !matchTag) return false;
    }

    // category tag filter
    if (selectedCategoryFilter !== 'All') {
      const matchTag = post.tags.some(t => t.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));
      const matchGroup = post.groupName?.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
      if (!matchTag && !matchGroup) return false;
    }

    // sub tab filter
    if (feedFilter === 'my_circles') {
      const joinedGroupIds = circles.filter(c => c.joined).map(c => c.id);
      return post.groupId && joinedGroupIds.includes(post.groupId);
    }
    if (feedFilter === 'stories') {
      return post.isPersonalStory;
    }
    if (feedFilter === 'expert_qa') {
      return post.isExpert;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top App Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <ArrowLeft color="#FFF" size={22} />
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Users color={COLORS.accent} size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Support Network</Text>
            <Text style={styles.headerSubtitle}>Community Circles, Experts & Stories</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onBack} style={styles.closeCircle}>
          <X color="#FFF" size={20} />
        </TouchableOpacity>
      </View>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <View style={styles.toastContainer}>
          <Sparkles color={COLORS.accent} size={16} style={{ marginRight: 8 }} />
          <Text style={styles.toastText}>{toastMessage}</Text>
          <TouchableOpacity onPress={() => setToastMessage(null)} style={{ padding: 4 }}>
            <X color="#FFF" size={14} />
          </TouchableOpacity>
        </View>
      )}

      {/* Main Navigation Segmented Bar */}
      <View style={styles.mainNav}>
        {[
          { key: 'feed', label: '📰 Community Feed' },
          { key: 'marketplace', label: `🏪 Care Marketplace (${careServices.length})` },
          { key: 'circles', label: `👥 Circles (${circles.length})` },
          { key: 'experts', label: '🩺 Specialists' },
          { key: 'peers', label: '🤝 Peer Matches' },
          {
            key: 'messages',
            label: threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0) > 0
              ? `💬 Messages (${threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0)})`
              : '💬 Messages'
          },
          { key: 'my_activity', label: '🔖 Bookmarks & Mine' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveMainTab(tab.key as any)}
            style={[
              styles.mainNavTab,
              activeMainTab === tab.key && styles.mainNavTabActive
            ]}
          >
            <Text
              style={[
                styles.mainNavTabText,
                activeMainTab === tab.key && styles.mainNavTabTextActive
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* TAB 1: COMMUNITY FEED & SOCIAL STREAM */}
        {activeMainTab === 'feed' && (
          <View>
            {/* Create Post Hero Card */}
            <View style={styles.createPostHero}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={styles.userAvatarSmall}>
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 11 }}>YOU</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowCreatePostModal(true)}
                  style={styles.createPostInputPlaceholder}
                  activeOpacity={0.8}
                >
                  <Text style={{ color: COLORS.textSub, fontSize: 13 }}>
                    Share an update, personal health story, or question...
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.createPostActionsRow}>
                <TouchableOpacity
                  onPress={() => {
                    setPostDestination('story');
                    setShowCreatePostModal(true);
                  }}
                  style={styles.quickActionChip}
                >
                  <Sparkles color={COLORS.accent} size={14} style={{ marginRight: 6 }} />
                  <Text style={styles.quickActionText}>Share Story</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setIncludeMilestone(true);
                    setShowCreatePostModal(true);
                  }}
                  style={styles.quickActionChip}
                >
                  <Flame color="#fbbf24" size={14} style={{ marginRight: 6 }} />
                  <Text style={styles.quickActionText}>Log Milestone</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowCreatePostModal(true)}
                  style={[styles.quickActionChip, { backgroundColor: COLORS.deepViolet, borderColor: COLORS.accent }]}
                >
                  <Plus color="#FFF" size={14} style={{ marginRight: 4 }} />
                  <Text style={[styles.quickActionText, { color: '#FFF' }]}>New Post</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sub-Filter Stream Tabs */}
            <View style={styles.streamFilterRow}>
              {[
                { key: 'all', label: '🌐 All Posts' },
                { key: 'my_circles', label: '👥 My Circles' },
                { key: 'stories', label: '📖 Life Stories' },
                { key: 'expert_qa', label: '🩺 Expert Insights' }
              ].map(f => (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => setFeedFilter(f.key as any)}
                  style={[
                    styles.streamFilterChip,
                    feedFilter === f.key && styles.streamFilterChipActive
                  ]}
                >
                  <Text
                    style={[
                      styles.streamFilterText,
                      feedFilter === f.key && styles.streamFilterTextActive
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {['All', 'Hypertension', 'Cardio', 'Nutrition', 'Breathwork', 'Diabetes', 'Sleep', 'Rehab'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategoryFilter(cat)}
                  style={[
                    styles.categoryPill,
                    selectedCategoryFilter === cat && styles.categoryPillActive
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategoryFilter === cat && styles.categoryPillTextActive
                    ]}
                  >
                    {cat === 'All' ? '✨ All Topics' : `#${cat}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Posts Stream */}
            {filteredPosts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MessageCircle color={COLORS.textSub} size={36} style={{ marginBottom: 8 }} />
                <Text style={styles.emptyTitle}>No posts found</Text>
                <Text style={styles.emptySubtitle}>Be the first to share an update or milestone in this section!</Text>
                <TouchableOpacity
                  onPress={() => setShowCreatePostModal(true)}
                  style={styles.emptyButton}
                >
                  <Text style={styles.emptyButtonText}>+ Create New Post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredPosts.map(post => {
                const isCommentsOpen = expandedCommentsPostId === post.id;
                return (
                  <View key={post.id} style={styles.postCard}>
                    {/* Post Author Header */}
                    <View style={styles.postHeader}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorAvatarText}>{post.authorAvatar}</Text>
                      </View>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Text style={styles.authorName}>{post.authorName}</Text>
                          {post.isVerified && (
                            <ShieldCheck color="#00C864" size={14} style={{ marginLeft: 4, marginRight: 4 }} />
                          )}
                          <Text style={styles.authorRole}>• {post.authorRole}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          {post.groupName && (
                            <View style={styles.groupBadge}>
                              <Text style={styles.groupBadgeText}>👥 {post.groupName}</Text>
                            </View>
                          )}
                          <Text style={styles.postTime}>{post.timestamp}</Text>
                        </View>
                      </View>

                      {/* Bookmark Icon */}
                      <TouchableOpacity
                        onPress={() => handleToggleReaction(post.id, 'bookmark')}
                        style={{ padding: 6 }}
                      >
                        <Bookmark
                          color={post.userBookmarked ? COLORS.accent : COLORS.textSub}
                          fill={post.userBookmarked ? COLORS.accent : 'transparent'}
                          size={18}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Mood Badge */}
                    {post.mood && (
                      <View style={styles.moodBadge}>
                        <Text style={styles.moodBadgeText}>{post.mood}</Text>
                      </View>
                    )}

                    {/* Post Title */}
                    {post.title && <Text style={styles.postTitle}>{post.title}</Text>}

                    {/* Post Body */}
                    <Text style={styles.postContent}>{post.content}</Text>

                    {/* Milestone Highlight Banner */}
                    {post.milestone && (
                      <View style={styles.milestoneCard}>
                        <Award color="#fbbf24" size={18} style={{ marginRight: 8 }} />
                        <Text style={styles.milestoneText}>{post.milestone}</Text>
                      </View>
                    )}

                    {/* Tags List */}
                    <View style={styles.postTagsRow}>
                      {post.tags.map(t => (
                        <View key={t} style={styles.tagChip}>
                          <Text style={styles.tagChipText}>{t}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Social Reactions Bar */}
                    <View style={styles.reactionsBar}>
                      {/* Support (Heart) */}
                      <TouchableOpacity
                        onPress={() => handleToggleReaction(post.id, 'support')}
                        style={[styles.reactionBtn, post.userSupported && styles.reactionBtnActive]}
                      >
                        <Heart
                          color={post.userSupported ? COLORS.accent : COLORS.textSub}
                          fill={post.userSupported ? COLORS.accent : 'transparent'}
                          size={16}
                          style={{ marginRight: 5 }}
                        />
                        <Text style={[styles.reactionBtnText, post.userSupported && { color: COLORS.accent }]}>
                          {post.supports} Support
                        </Text>
                      </TouchableOpacity>

                      {/* Celebrate (Clap) */}
                      <TouchableOpacity
                        onPress={() => handleToggleReaction(post.id, 'clap')}
                        style={[styles.reactionBtn, post.userClapped && styles.reactionBtnActive]}
                      >
                        <Flame
                          color={post.userClapped ? '#fbbf24' : COLORS.textSub}
                          size={16}
                          style={{ marginRight: 5 }}
                        />
                        <Text style={[styles.reactionBtnText, post.userClapped && { color: '#fbbf24' }]}>
                          {post.claps} Clap
                        </Text>
                      </TouchableOpacity>

                      {/* Comments Toggle */}
                      <TouchableOpacity
                        onPress={() => setExpandedCommentsPostId(isCommentsOpen ? null : post.id)}
                        style={styles.reactionBtn}
                      >
                        <MessageCircle color={COLORS.textSub} size={16} style={{ marginRight: 5 }} />
                        <Text style={styles.reactionBtnText}>{post.comments.length} Comments</Text>
                      </TouchableOpacity>

                      {/* Share */}
                      <TouchableOpacity
                        onPress={() => showToast('🔗 Post link copied to clipboard!')}
                        style={styles.reactionBtn}
                      >
                        <Share2 color={COLORS.textSub} size={16} />
                      </TouchableOpacity>
                    </View>

                    {/* In-Line Comments Thread Section */}
                    {isCommentsOpen && (
                      <View style={styles.commentsSection}>
                        {post.comments.length > 0 ? (
                          post.comments.map(comm => (
                            <View key={comm.id} style={styles.commentItem}>
                              <View style={styles.commentAvatar}>
                                <Text style={styles.commentAvatarText}>{comm.authorAvatar}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.commentAuthor}>{comm.authorName}</Text>
                                    {comm.isExpert && (
                                      <View style={styles.expertMiniBadge}>
                                        <Text style={{ color: '#00C864', fontSize: 9, fontWeight: 'bold' }}>EXPERT</Text>
                                      </View>
                                    )}
                                  </View>
                                  <Text style={styles.commentTime}>{comm.timestamp}</Text>
                                </View>
                                <Text style={styles.commentText}>{comm.text}</Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.noCommentsText}>No comments yet. Start the conversation!</Text>
                        )}

                        {/* Add Comment Input */}
                        <View style={styles.commentInputRow}>
                          <TextInput
                            style={styles.commentInput}
                            placeholder="Write an encouraging comment..."
                            placeholderTextColor={COLORS.textSub}
                            value={commentInputText[post.id] || ''}
                            onChangeText={val => setCommentInputText(prev => ({ ...prev, [post.id]: val }))}
                          />
                          <TouchableOpacity
                            onPress={() => handleAddComment(post.id)}
                            style={styles.commentSendBtn}
                          >
                            <Send color="#FFF" size={14} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* TAB 2: SUPPORT CIRCLES & GROUPS */}
        {activeMainTab === 'circles' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Community Circles & Groups</Text>
                <Text style={styles.sectionSub}>Join peer circles, attend live syncs, or create your own group</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCreateCircleModal(true)}
                style={styles.headerActionBtn}
              >
                <Plus color="#FFF" size={14} style={{ marginRight: 4 }} />
                <Text style={styles.headerActionBtnText}>Create Circle</Text>
              </TouchableOpacity>
            </View>

            {circles.map(circle => (
              <View key={circle.id} style={[styles.circleCard, circle.joined && styles.circleCardJoined]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', flex: 1, marginRight: 10 }}>
                    <View style={styles.circleEmojiBox}>
                      <Text style={{ fontSize: 24 }}>{circle.avatarEmoji}</Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{circle.category}</Text>
                        </View>
                        {circle.isPrivate ? (
                          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                            <Lock color={COLORS.textSub} size={10} style={{ marginRight: 3 }} />
                            <Text style={styles.categoryBadgeText}>Private</Text>
                          </View>
                        ) : (
                          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(0,200,100,0.15)' }]}>
                            <Globe color="#00C864" size={10} style={{ marginRight: 3 }} />
                            <Text style={[styles.categoryBadgeText, { color: '#00C864' }]}>Open Circle</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.circleName}>{circle.name}</Text>
                      <Text style={styles.circleDescription}>{circle.description}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <Clock color={COLORS.accent} size={13} style={{ marginRight: 5 }} />
                        <Text style={styles.circleSchedule}>{circle.meetingSchedule}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Users color={COLORS.textSub} size={13} style={{ marginRight: 5 }} />
                        <Text style={styles.circleMemberCount}>{circle.memberCount} members • {circle.facilitator}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Circle Actions */}
                <View style={styles.circleActionsRow}>
                  <TouchableOpacity
                    onPress={() => toggleJoinCircle(circle.id)}
                    style={[
                      styles.circleJoinBtn,
                      circle.joined && styles.circleJoinedBtn
                    ]}
                  >
                    {circle.joined ? (
                      <>
                        <Check color="#00C864" size={14} style={{ marginRight: 5 }} />
                        <Text style={[styles.circleJoinBtnText, { color: '#00C864' }]}>Joined ✓</Text>
                      </>
                    ) : (
                      <>
                        <Plus color="#FFF" size={14} style={{ marginRight: 5 }} />
                        <Text style={styles.circleJoinBtnText}>Join Support Circle</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {circle.joined && (
                    <TouchableOpacity
                      onPress={() => {
                        setPostDestination(circle.id);
                        setShowCreatePostModal(true);
                      }}
                      style={styles.circlePostBtn}
                    >
                      <Text style={styles.circlePostBtnText}>✍️ Post in Circle</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: VERIFIED SPECIALISTS & EXPERTS */}
        {activeMainTab === 'experts' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Verified Clinical Specialists</Text>
                <Text style={styles.sectionSub}>Book 1-on-1 consultations or prepare clinical questions with Ogoo</Text>
              </View>
            </View>

            {/* Specialist Legal Responsibility Notice */}
            <View style={styles.tabDisclaimerCard}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <ShieldCheck color="#fbbf24" size={15} style={{ marginTop: 2, marginRight: 8 }} />
                <Text style={styles.tabDisclaimerText}>
                  <Text style={{ fontWeight: 'bold', color: '#fbbf24' }}>Important Notice:</Text> Specialists in this directory are independent third-party practitioners. Any clinical advice, recommendations, diagnoses, or consultation schedules provided by experts are solely their own and are not the legal responsibility of, related to, or endorsed by Ogoo.
                </Text>
              </View>
            </View>

            {experts.map(expert => (
              <View key={expert.id} style={styles.expertCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={styles.expertAvatarBox}>
                    <Stethoscope color={COLORS.accent} size={24} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.expertName}>{expert.name}</Text>
                        <ShieldCheck color="#00C864" size={16} style={{ marginLeft: 6 }} />
                      </View>
                      <View style={styles.ratingBadge}>
                        <Text style={{ color: '#fbbf24', fontSize: 11, fontWeight: 'bold' }}>⭐ {expert.rating}</Text>
                        <Text style={{ color: COLORS.textSub, fontSize: 10, marginLeft: 2 }}>({expert.reviewCount})</Text>
                      </View>
                    </View>

                    <Text style={styles.expertSpecialty}>{expert.specialty}</Text>
                    <Text style={styles.expertCredentials}>{expert.credentials} • {expert.clinic}</Text>
                    <Text style={styles.expertBio}>{expert.bio}</Text>

                    <View style={styles.expertMetaRow}>
                      <Clock color={COLORS.accent} size={12} style={{ marginRight: 4 }} />
                      <Text style={styles.expertMetaText}>{expert.schedule}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.expertActionsRow}>
                  <TouchableOpacity
                    onPress={() => handleOpenChatWith('expert', expert)}
                    style={[styles.bookConsultBtn, { backgroundColor: '#380c66', borderColor: '#7c3aed' }]}
                  >
                    <MessageSquare color="#d8b4fe" size={14} style={{ marginRight: 6 }} />
                    <Text style={[styles.bookConsultBtnText, { color: '#d8b4fe' }]}>Message Specialist</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedExpertForBooking(expert)}
                    style={styles.bookConsultBtn}
                  >
                    <Calendar color="#FFF" size={14} style={{ marginRight: 6 }} />
                    <Text style={styles.bookConsultBtnText}>Book Consult</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      onBack();
                      onAskOgoo(`I would like to prepare for a clinical consultation with ${expert.name} (${expert.specialty}). What relevant vitals, symptoms, and questions should I organize from my profile?`);
                    }}
                    style={styles.askOgooPrepBtn}
                  >
                    <Sparkles color={COLORS.accent} size={14} style={{ marginRight: 6 }} />
                    <Text style={styles.askOgooPrepBtnText}>Ask Ogoo Prep</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: PEER MATCHES (SIMILAR STRUGGLES) */}
        {activeMainTab === 'peers' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionHeading}>Peers with Similar Struggles</Text>
                <Text style={styles.sectionSub}>Match with individuals walking the same health recovery path</Text>
              </View>
            </View>

            {peers.map(peer => (
              <View key={peer.id} style={styles.peerCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={styles.peerAvatarBox}>
                    <Text style={styles.peerAvatarText}>
                      {peer.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={styles.peerName}>{peer.name}, {peer.age}</Text>
                      <View style={styles.activeStatusPill}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.activeStatusText}>{peer.activeStatus}</Text>
                      </View>
                    </View>

                    <Text style={styles.peerStruggle}>Focus: {peer.struggle}</Text>
                    <Text style={styles.peerBio}>{peer.bio}</Text>

                    {peer.milestone && (
                      <View style={styles.peerMilestoneBox}>
                        <Flame color="#fbbf24" size={14} style={{ marginRight: 6 }} />
                        <Text style={styles.peerMilestoneText}>{peer.milestone}</Text>
                      </View>
                    )}

                    <View style={styles.postTagsRow}>
                      {peer.tags.map(t => (
                        <View key={t} style={styles.tagChip}>
                          <Text style={styles.tagChipText}>#{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Peer Action Buttons */}
                <View style={styles.peerActionsRow}>
                  <TouchableOpacity
                    onPress={() => handleOpenChatWith('peer', peer)}
                    style={[styles.sendEncouragementBtn, { backgroundColor: '#380c66', borderColor: '#7c3aed' }]}
                  >
                    <MessageSquare color="#d8b4fe" size={14} style={{ marginRight: 6 }} />
                    <Text style={[styles.sendEncouragementText, { color: '#d8b4fe' }]}>Direct Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedPeerForMsg(peer)}
                    style={styles.sendEncouragementBtn}
                  >
                    <Heart color="#FFF" size={14} style={{ marginRight: 6 }} />
                    <Text style={styles.sendEncouragementText}>Encourage</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setPeers(prev =>
                        prev.map(p => {
                          if (p.id === peer.id) {
                            const next = !p.isConnected;
                            showToast(next ? `Connected with ${peer.name}!` : `Disconnected`);
                            return { ...p, isConnected: next };
                          }
                          return p;
                        })
                      );
                    }}
                    style={[
                      styles.connectPeerBtn,
                      peer.isConnected && { backgroundColor: 'rgba(0,200,100,0.15)', borderColor: '#00C864' }
                    ]}
                  >
                    {peer.isConnected ? (
                      <>
                        <UserCheck color="#00C864" size={14} style={{ marginRight: 6 }} />
                        <Text style={{ color: '#00C864', fontWeight: 'bold', fontSize: 12 }}>Connected ✓</Text>
                      </>
                    ) : (
                      <>
                        <UserPlus color={COLORS.accent} size={14} style={{ marginRight: 6 }} />
                        <Text style={styles.connectPeerBtnText}>Connect 1-on-1</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 5: DIRECT MESSAGES WITH EXPERTS & PEERS */}
        {activeMainTab === 'messages' && (
          <SupportMessagingView
            threads={threads}
            setThreads={setThreads}
            activeThreadId={activeThreadId}
            setActiveThreadId={setActiveThreadId}
            peers={peers}
            experts={experts}
            onOpenConsultationBooking={(expert) => setSelectedExpertForBooking(expert)}
            onAskOgoo={onAskOgoo}
          />
        )}

        {/* TAB 6: MY ACTIVITY, BOOKMARKS & JOINED */}
        {activeMainTab === 'my_activity' && (
          <View>
            <Text style={styles.sectionHeading}>My Bookmarked Posts & Stories</Text>
            {posts.filter(p => p.userBookmarked).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Bookmark color={COLORS.textSub} size={32} style={{ marginBottom: 6 }} />
                <Text style={styles.emptyTitle}>No saved posts yet</Text>
                <Text style={styles.emptySubtitle}>Tap the bookmark icon on any community post or story to save it here for quick reference.</Text>
              </View>
            ) : (
              posts.filter(p => p.userBookmarked).map(post => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorAvatarText}>{post.authorAvatar}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.authorName}>{post.authorName}</Text>
                      <Text style={styles.postTime}>{post.timestamp} • {post.groupName || 'Public Story'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleToggleReaction(post.id, 'bookmark')}>
                      <Bookmark color={COLORS.accent} fill={COLORS.accent} size={18} />
                    </TouchableOpacity>
                  </View>
                  {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
                  <Text style={styles.postContent}>{post.content}</Text>
                </View>
              ))
            )}

            <Text style={[styles.sectionHeading, { marginTop: 24 }]}>My Joined Circles</Text>
            {circles.filter(c => c.joined).map(c => (
              <View key={c.id} style={[styles.circleCard, { marginBottom: 10 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 10 }}>{c.avatarEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.circleName}>{c.name}</Text>
                    <Text style={styles.circleSchedule}>{c.meetingSchedule}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setPostDestination(c.id);
                      setShowCreatePostModal(true);
                    }}
                    style={styles.circlePostBtn}
                  >
                    <Text style={styles.circlePostBtnText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 7: CARE SERVICE MARKETPLACE */}
        {activeMainTab === 'marketplace' && (
          <View>
            {/* Disclaimer */}
            <View style={styles.tabDisclaimerCard}>
              <Text style={styles.tabDisclaimerText}>
                🏪 Verified Care Marketplace: Connect directly with licensed independent clinical nurses, certified personal care aides (CNA/PCA), physical therapists, medical escorts, and mobile phlebotomy specialists. All bookings and service requests are recorded in your persistent health portal.
              </Text>
            </View>

            {/* Marketplace Top Hero & Action Banner */}
            <View style={[styles.createPostHero, { marginBottom: 16 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Briefcase color={COLORS.accent} size={18} style={{ marginRight: 6 }} />
                    <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }}>In-Home Care Marketplace</Text>
                  </View>
                  <Text style={{ color: COLORS.textSub, fontSize: 12 }}>
                    Hire certified caregivers, home nurses, physical therapists, and medical transport with transparent pricing.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowListServiceModal(true)}
                  style={{
                    backgroundColor: '#5c1794',
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#9d32dc'
                  }}
                >
                  <Plus color="#FFF" size={14} style={{ marginRight: 4 }} />
                  <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>List Service</Text>
                </TouchableOpacity>
              </View>

              {/* Sub-Tabs: Browse vs My Bookings */}
              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 3, marginTop: 4 }}>
                <TouchableOpacity
                  onPress={() => setMarketplaceSubTab('browse')}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    alignItems: 'center',
                    borderRadius: 8,
                    backgroundColor: marketplaceSubTab === 'browse' ? '#5c1794' : 'transparent'
                  }}
                >
                  <Text style={{ color: marketplaceSubTab === 'browse' ? '#FFF' : COLORS.textSub, fontSize: 12, fontWeight: '700' }}>
                    Browse Providers ({careServices.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMarketplaceSubTab('my_bookings')}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    alignItems: 'center',
                    borderRadius: 8,
                    backgroundColor: marketplaceSubTab === 'my_bookings' ? '#5c1794' : 'transparent'
                  }}
                >
                  <Text style={{ color: marketplaceSubTab === 'my_bookings' ? '#FFF' : COLORS.textSub, fontSize: 12, fontWeight: '700' }}>
                    My Bookings ({careBookings.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {marketplaceSubTab === 'browse' ? (
              <View>
                {/* Search Input */}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12, paddingHorizontal: 10, marginBottom: 12, borderWidth: 1, borderColor: '#5c1794' }}>
                  <Search color={COLORS.accent} size={16} style={{ marginRight: 6 }} />
                  <TextInput
                    style={{ flex: 1, height: 38, color: '#FFF', fontSize: 13 }}
                    placeholder="Search by name, clinical skill, agency, or care need..."
                    placeholderTextColor="#8e7b9e"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <X color="#FFF" size={14} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                {/* Category Pills Scroll */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  {[
                    { key: 'All', label: 'All Services' },
                    { key: 'nursing', label: '🩺 Clinical Nursing' },
                    { key: 'caregiver', label: '🧑‍🦼 Caregivers / PCA' },
                    { key: 'therapy', label: '🏃 Physical Therapy' },
                    { key: 'nutrition', label: '🥗 Nutritionists' },
                    { key: 'transport', label: '🚐 Medical Transport' },
                    { key: 'respite', label: '🌙 Overnight Respite' },
                    { key: 'phlebotomy', label: '🩸 Mobile Blood Draw' }
                  ].map(cat => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setMarketplaceCategoryFilter(cat.key)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 14,
                        marginRight: 8,
                        backgroundColor: marketplaceCategoryFilter === cat.key ? '#5c1794' : 'rgba(255,255,255,0.05)',
                        borderWidth: 1,
                        borderColor: marketplaceCategoryFilter === cat.key ? COLORS.accent : 'rgba(255,255,255,0.1)'
                      }}
                    >
                      <Text style={{ color: marketplaceCategoryFilter === cat.key ? '#FFF' : COLORS.textSub, fontSize: 11, fontWeight: '700' }}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Insurance Filter Pills Scroll */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                  <CreditCard color={COLORS.textSub} size={13} style={{ marginRight: 6 }} />
                  <Text style={{ color: COLORS.textSub, fontSize: 11, fontWeight: '600', marginRight: 8 }}>Payment:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['All', 'Medicare', 'Medicaid', 'BlueCross', 'Self-Pay'].map(ins => (
                      <TouchableOpacity
                        key={ins}
                        onPress={() => setMarketplaceInsuranceFilter(ins)}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                          marginRight: 6,
                          backgroundColor: marketplaceInsuranceFilter === ins ? 'rgba(229,114,163,0.2)' : 'rgba(255,255,255,0.04)',
                          borderWidth: 1,
                          borderColor: marketplaceInsuranceFilter === ins ? COLORS.accent : 'transparent'
                        }}
                      >
                        <Text style={{ color: marketplaceInsuranceFilter === ins ? COLORS.accent : COLORS.textSub, fontSize: 10, fontWeight: '700' }}>
                          {ins === 'All' ? 'All Payment Options' : ins}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Providers List */}
                {careServices
                  .filter(srv => {
                    if (marketplaceCategoryFilter !== 'All' && srv.category !== marketplaceCategoryFilter) return false;
                    if (marketplaceInsuranceFilter !== 'All' && !srv.insuranceAccepted.includes(marketplaceInsuranceFilter)) return false;
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      return (
                        srv.name.toLowerCase().includes(q) ||
                        srv.title.toLowerCase().includes(q) ||
                        (srv.agency && srv.agency.toLowerCase().includes(q)) ||
                        srv.specialties.some(sp => sp.toLowerCase().includes(q)) ||
                        srv.bio.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map(service => (
                    <View
                      key={service.id}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 14,
                        borderWidth: 1,
                        borderColor: '#5c1794'
                      }}
                    >
                      {/* Provider Header */}
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#5c1794', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1.5, borderColor: '#9d32dc' }}>
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 15 }}>{service.avatarText}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800', marginRight: 6 }}>{service.name}</Text>
                            {service.verified && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,200,100,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#00C864' }}>
                                <ShieldCheck color="#00C864" size={11} style={{ marginRight: 3 }} />
                                <Text style={{ color: '#00C864', fontSize: 9.5, fontWeight: '800' }}>VERIFIED LICENSE</Text>
                              </View>
                            )}
                          </View>
                          <Text style={{ color: '#d8b4fe', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{service.title}</Text>
                          {service.agency && (
                            <Text style={{ color: COLORS.textSub, fontSize: 11, marginTop: 1 }}>🏢 {service.agency}</Text>
                          )}
                        </View>
                      </View>

                      {/* Pricing & Rating Badge Row */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)', padding: 8, borderRadius: 10, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ color: COLORS.gold, fontSize: 12, fontWeight: '800', marginRight: 4 }}>⭐ {service.rating.toFixed(1)}</Text>
                          <Text style={{ color: COLORS.textSub, fontSize: 11 }}>({service.reviewCount} verified reviews)</Text>
                        </View>
                        <Text style={{ color: COLORS.online, fontWeight: '800', fontSize: 13 }}>{service.hourlyRate}</Text>
                      </View>

                      {/* Coverage & Availability */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MapPin color={COLORS.accent} size={12} style={{ marginRight: 4 }} />
                          <Text style={{ color: COLORS.textSub, fontSize: 11 }}>{service.location} • {service.serviceRadius}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(56, 189, 248, 0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                          <Clock color="#38bdf8" size={11} style={{ marginRight: 3 }} />
                          <Text style={{ color: '#38bdf8', fontSize: 10, fontWeight: '700' }}>{service.availability}</Text>
                        </View>
                      </View>

                      {/* Bio */}
                      <Text style={{ color: '#e2d9f3', fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>{service.bio}</Text>

                      {/* Specialties Tags */}
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {service.specialties.map((spec, sIdx) => (
                          <View key={sIdx} style={{ backgroundColor: 'rgba(92,23,148,0.3)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(216,180,254,0.2)' }}>
                            <Text style={{ color: '#d8b4fe', fontSize: 10.5, fontWeight: '600' }}>{spec}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Accepted Insurance Badges */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 4 }}>
                        <Text style={{ color: COLORS.textSub, fontSize: 10, fontWeight: 'bold' }}>Accepted:</Text>
                        {service.insuranceAccepted.map((ins, iIdx) => (
                          <View key={iIdx} style={{ backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ color: '#a78bfa', fontSize: 9.5 }}>{ins}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Action Buttons */}
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedServiceForBooking(service);
                            setBookingPatientName('');
                            setBookingCareNotes('');
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: '#5c1794',
                            paddingVertical: 10,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: COLORS.accent
                          }}
                        >
                          <Calendar color="#FFF" size={15} style={{ marginRight: 6 }} />
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Book Care Service</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleOpenChatWith('expert', { id: service.id, name: service.name, specialty: service.title })}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.15)'
                          }}
                        >
                          <MessageCircle color={COLORS.accent} size={15} style={{ marginRight: 4 }} />
                          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Message</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
            ) : (
              /* MY BOOKINGS SUB-TAB */
              <View>
                <Text style={[styles.sectionHeading, { marginBottom: 12 }]}>My Scheduled Care Services ({careBookings.length})</Text>
                {careBookings.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Briefcase color={COLORS.textSub} size={36} style={{ marginBottom: 10, opacity: 0.8 }} />
                    <Text style={styles.emptyTitle}>No Active Care Bookings</Text>
                    <Text style={styles.emptySubtitle}>
                      You haven't requested any in-home nurses, caregivers, or physical therapists yet. Explore verified professionals in the browse tab!
                    </Text>
                    <TouchableOpacity
                      onPress={() => setMarketplaceSubTab('browse')}
                      style={{ backgroundColor: '#5c1794', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginTop: 14, borderWidth: 1, borderColor: COLORS.accent }}
                    >
                      <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Browse Marketplace Providers</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  careBookings.map(booking => (
                    <View
                      key={booking.id}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: '#5c1794'
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '800' }}>{booking.providerName}</Text>
                          <Text style={{ color: '#d8b4fe', fontSize: 12, fontWeight: '600' }}>{booking.serviceTitle}</Text>
                        </View>
                        <View style={{ backgroundColor: booking.status === 'Confirmed' ? 'rgba(0,200,100,0.15)' : 'rgba(251,191,36,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: booking.status === 'Confirmed' ? '#00C864' : '#fbbf24' }}>
                          <Text style={{ color: booking.status === 'Confirmed' ? '#00C864' : '#fbbf24', fontSize: 10, fontWeight: '800' }}>
                            {booking.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>

                      <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, marginVertical: 8 }}>
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700', marginBottom: 3 }}>
                          📅 Scheduled: {booking.preferredDate} • {booking.preferredTimeSlot}
                        </Text>
                        <Text style={{ color: COLORS.textSub, fontSize: 11, marginBottom: 2 }}>
                          📍 Patient & Address: {booking.patientName} ({booking.patientPhone}) • {booking.address}
                        </Text>
                        <Text style={{ color: COLORS.textSub, fontSize: 11, marginBottom: 2 }}>
                          💳 Payment Method: {booking.paymentMethod} {booking.insuranceProvider ? `(${booking.insuranceProvider})` : ''}
                        </Text>
                        {booking.careNotes ? (
                          <Text style={{ color: '#e2d9f3', fontSize: 11, fontStyle: 'italic', marginTop: 4 }}>
                            📝 Care Notes: {booking.careNotes}
                          </Text>
                        ) : null}
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                        <TouchableOpacity
                          onPress={() => handleOpenChatWith('expert', { id: booking.serviceId, name: booking.providerName, specialty: booking.serviceTitle })}
                          style={{ backgroundColor: '#5c1794', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                        >
                          <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>💬 Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setCareBookings(prev => prev.filter(b => b.id !== booking.id));
                            showToast('Booking cancelled.');
                          }}
                          style={{ backgroundColor: 'rgba(255,75,75,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#FF4B4B' }}
                        >
                          <Text style={{ color: '#FF4B4B', fontSize: 11, fontWeight: 'bold' }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}

        {/* Support Network Persistent Bottom Disclaimer */}
        <View style={styles.bottomDisclaimer}>
          <Text style={styles.bottomDisclaimerText}>
            ⚠️ Disclaimer: Experts, specialists, peer, circle members, and all advice, opinions, or recommendations shared in the Support Network are independent community and third-party contributions and are not guaranteed by us or related to Ogoo. Ogoo is not a medical practice and assumes no liability for actions taken based on any community or specialist guidance, consultations, or interactions here. Always attend a licenced medical practice or hospital for professional clinical advice, diagnoses, treatment, and medical emergencies.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL 1: CREATE NEW SOCIAL POST / STORY */}
      <Modal visible={showCreatePostModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Sparkles color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Share an Update or Story</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCreatePostModal(false)}>
                <X color="#FFF" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Destination Selector */}
              <Text style={styles.formLabel}>Post Destination:</Text>
              <View style={styles.destinationRow}>
                <TouchableOpacity
                  onPress={() => setPostDestination('public')}
                  style={[
                    styles.destinationChip,
                    postDestination === 'public' && styles.destinationChipActive
                  ]}
                >
                  <Globe color={postDestination === 'public' ? '#FFF' : COLORS.textSub} size={14} style={{ marginRight: 4 }} />
                  <Text style={[styles.destinationChipText, postDestination === 'public' && { color: '#FFF' }]}>🌐 Public Feed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPostDestination('story')}
                  style={[
                    styles.destinationChip,
                    postDestination === 'story' && styles.destinationChipActive
                  ]}
                >
                  <Sparkles color={postDestination === 'story' ? '#FFF' : COLORS.textSub} size={14} style={{ marginRight: 4 }} />
                  <Text style={[styles.destinationChipText, postDestination === 'story' && { color: '#FFF' }]}>📖 Personal Story</Text>
                </TouchableOpacity>
              </View>

              {/* Or Select Joined Circle */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {circles.filter(c => c.joined).map(c => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setPostDestination(c.id)}
                    style={[
                      styles.destinationChip,
                      postDestination === c.id && styles.destinationChipActive,
                      { marginRight: 6 }
                    ]}
                  >
                    <Text style={{ fontSize: 13, marginRight: 4 }}>{c.avatarEmoji}</Text>
                    <Text style={[styles.destinationChipText, postDestination === c.id && { color: '#FFF' }]}>
                      {c.name.split('&')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Mood Selector */}
              <Text style={styles.formLabel}>How are you feeling today?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {[
                  'Feeling Hopeful 🌱',
                  'Celebrating Win 🎉',
                  'Feeling Energized ⚡',
                  'Seeking Advice 💡',
                  'Daily Routine 🏃',
                  'Grateful 🙏'
                ].map(m => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setPostMood(m)}
                    style={[
                      styles.moodSelectChip,
                      postMood === m && styles.moodSelectChipActive
                    ]}
                  >
                    <Text style={[styles.moodSelectText, postMood === m && { color: '#FFF' }]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Post Title */}
              <Text style={styles.formLabel}>Title / Headline (Optional):</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. My 30-day low sodium journey & BP results"
                placeholderTextColor={COLORS.textSub}
                value={postTitle}
                onChangeText={setPostTitle}
              />

              {/* Post Content */}
              <Text style={styles.formLabel}>Your Message / Story:</Text>
              <TextInput
                style={[styles.modalTextInput, { minHeight: 90, textAlignVertical: 'top' }]}
                placeholder="Share your experience, tips, challenges, or questions for the community..."
                placeholderTextColor={COLORS.textSub}
                value={postContent}
                onChangeText={setPostContent}
                multiline
              />

              {/* Milestone Toggle */}
              <TouchableOpacity
                onPress={() => setIncludeMilestone(!includeMilestone)}
                style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
              >
                <View style={[styles.checkboxBox, includeMilestone && styles.checkboxBoxActive]}>
                  {includeMilestone && <Check color="#FFF" size={12} />}
                </View>
                <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600', marginLeft: 8 }}>
                  Attach a health milestone / metric achievement
                </Text>
              </TouchableOpacity>

              {includeMilestone && (
                <TextInput
                  style={[styles.modalTextInput, { marginBottom: 10 }]}
                  placeholder="e.g. Lowered systolic BP from 138 to 118 over 8 weeks"
                  placeholderTextColor={COLORS.textSub}
                  value={postMilestone}
                  onChangeText={setPostMilestone}
                />
              )}

              {/* Tags */}
              <Text style={styles.formLabel}>Tags (separated by comma):</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. HeartHealth, Nutrition, 10kSteps, Recovery"
                placeholderTextColor={COLORS.textSub}
                value={postTags}
                onChangeText={setPostTags}
              />

              {/* Publish Action Button */}
              <TouchableOpacity
                onPress={handlePublishPost}
                style={styles.publishSubmitBtn}
              >
                <Send color="#FFF" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.publishSubmitBtnText}>Publish to Community</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CREATE SUPPORT CIRCLE */}
      <Modal visible={showCreateCircleModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Users color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Register New Support Circle</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCreateCircleModal(false)}>
                <X color="#FFF" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Circle Name:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Post-Op Cardiac Recovery & Walking Circle"
                placeholderTextColor={COLORS.textSub}
                value={newCircleName}
                onChangeText={setNewCircleName}
              />

              <Text style={styles.formLabel}>Focus Area / Category:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {['Cardiovascular', 'Mental Health', 'Metabolic Health', 'Sleep Health', 'Caregiving', 'Rehab'].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setNewCircleCategory(cat)}
                    style={[
                      styles.categoryPill,
                      newCircleCategory === cat && styles.categoryPillActive
                    ]}
                  >
                    <Text style={[styles.categoryPillText, newCircleCategory === cat && { color: '#FFF' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Meeting Cadence & Time:</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Every Thursday • 7:00 PM EST"
                placeholderTextColor={COLORS.textSub}
                value={newCircleSchedule}
                onChangeText={setNewCircleSchedule}
              />

              <Text style={styles.formLabel}>Circle Description & Purpose:</Text>
              <TextInput
                style={[styles.modalTextInput, { minHeight: 80, textAlignVertical: 'top' }]}
                placeholder="Describe what members will do, share, and support each other with..."
                placeholderTextColor={COLORS.textSub}
                value={newCircleDescription}
                onChangeText={setNewCircleDescription}
                multiline
              />

              <TouchableOpacity
                onPress={handleCreateCircle}
                style={[styles.publishSubmitBtn, { marginTop: 14 }]}
              >
                <Plus color="#FFF" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.publishSubmitBtnText}>Create & Open Circle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: PEER DIRECT ENCOURAGEMENT */}
      <Modal visible={!!selectedPeerForMsg} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Heart color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Encourage {selectedPeerForMsg?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPeerForMsg(null)}>
                <X color="#FFF" size={22} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: COLORS.textSub, fontSize: 13, marginBottom: 12 }}>
              Send a personalized word of support, empathy, or solidarity to {selectedPeerForMsg?.name} ({selectedPeerForMsg?.struggle}).
            </Text>

            {/* Quick Presets */}
            <Text style={styles.formLabel}>Quick Encouragement Presets:</Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              {[
                "You're doing amazing! Keep going one day at a time 💪",
                "Sending you strength & positive energy on your health journey ✨",
                "Your progress is truly inspiring to the community! 🌟",
                "I went through a similar struggle—you've got this! ❤️"
              ].map(preset => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setPeerEncouragementNote(preset)}
                  style={styles.presetNoteChip}
                >
                  <Text style={styles.presetNoteText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.modalTextInput, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="Or type a custom note of encouragement..."
              placeholderTextColor={COLORS.textSub}
              value={peerEncouragementNote}
              onChangeText={setPeerEncouragementNote}
              multiline
            />

            <TouchableOpacity
              onPress={handleSendPeerEncouragement}
              style={styles.publishSubmitBtn}
            >
              <Send color="#FFF" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.publishSubmitBtnText}>Send Encouragement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: SPECIALIST CONSULTATION SCHEDULER */}
      <Modal visible={!!selectedExpertForBooking} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Book with {selectedExpertForBooking?.name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedExpertForBooking(null)}>
                <X color="#FFF" size={22} />
              </TouchableOpacity>
            </View>

            <Text style={styles.expertSpecialty}>{selectedExpertForBooking?.specialty}</Text>
            <Text style={{ color: COLORS.textSub, fontSize: 12, marginBottom: 12 }}>
              {selectedExpertForBooking?.clinic} • Verified Telehealth Provider
            </Text>

            <Text style={styles.formLabel}>Select Preferred Date & Time Slot:</Text>
            <TextInput
              style={styles.modalTextInput}
              value={expertBookingDate}
              onChangeText={setExpertBookingDate}
            />

            <Text style={styles.formLabel}>Primary Reason for Visit:</Text>
            <TextInput
              style={[styles.modalTextInput, { minHeight: 70, textAlignVertical: 'top' }]}
              value={bookingReason}
              onChangeText={setBookingReason}
              multiline
            />

            <View style={styles.modalDisclaimerBox}>
              <Text style={styles.modalDisclaimerText}>
                ⚠️ Disclaimer: Telehealth consultations and expert advice are conducted independently by the specialist and are not our legal responsibility or related to Ogoo.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleConfirmBooking}
              style={styles.publishSubmitBtn}
            >
              <CheckCircle color="#FFF" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.publishSubmitBtnText}>Confirm Telehealth Consultation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: BOOK IN-HOME CARE SERVICE */}
      <Modal visible={!!selectedServiceForBooking} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentBox, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Briefcase color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>Request Care Service</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedServiceForBooking(null)}>
                <X color="#FFF" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedServiceForBooking && (
                <View style={{ backgroundColor: '#20053b', padding: 12, borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#5c1794' }}>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 14 }}>{selectedServiceForBooking.name}</Text>
                  <Text style={{ color: '#d8b4fe', fontSize: 12 }}>{selectedServiceForBooking.title}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <Text style={{ color: COLORS.online, fontWeight: '700', fontSize: 12 }}>Rate: {selectedServiceForBooking.hourlyRate}</Text>
                    <Text style={{ color: COLORS.textSub, fontSize: 11 }}>📍 {selectedServiceForBooking.location}</Text>
                  </View>
                </View>
              )}

              {/* Form Fields */}
              <Text style={styles.inputFieldLabel}>Patient Full Name</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Full name of patient needing care..."
                placeholderTextColor="#7e6c98"
                value={bookingPatientName}
                onChangeText={setBookingPatientName}
              />

              <Text style={styles.inputFieldLabel}>Contact Phone Number</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. +1 (555) 019-2834"
                placeholderTextColor="#7e6c98"
                keyboardType="phone-pad"
                value={bookingPhone}
                onChangeText={setBookingPhone}
              />

              <Text style={styles.inputFieldLabel}>Service Address / Location</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Home address or facility for care visit..."
                placeholderTextColor="#7e6c98"
                value={bookingAddress}
                onChangeText={setBookingAddress}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputFieldLabel}>Preferred Date</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Tomorrow or MM/DD"
                    placeholderTextColor="#7e6c98"
                    value={bookingDate}
                    onChangeText={setBookingDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputFieldLabel}>Preferred Time Slot</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Morning 9 AM"
                    placeholderTextColor="#7e6c98"
                    value={bookingTimeSlot}
                    onChangeText={setBookingTimeSlot}
                  />
                </View>
              </View>

              <Text style={styles.inputFieldLabel}>Payment Method</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                {(['Insurance', 'Self-Pay / Card'] as const).map(pm => (
                  <TouchableOpacity
                    key={pm}
                    onPress={() => setBookingPaymentType(pm)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: bookingPaymentType === pm ? '#5c1794' : 'rgba(255,255,255,0.05)',
                      borderWidth: 1,
                      borderColor: bookingPaymentType === pm ? COLORS.accent : 'transparent'
                    }}
                  >
                    <Text style={{ color: bookingPaymentType === pm ? '#FFF' : COLORS.textSub, fontSize: 12, fontWeight: '700' }}>
                      {pm}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {bookingPaymentType === 'Insurance' && (
                <View>
                  <Text style={styles.inputFieldLabel}>Insurance Provider / Plan</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="e.g. Medicare Part B, BlueCross, Medicaid..."
                    placeholderTextColor="#7e6c98"
                    value={bookingInsuranceName}
                    onChangeText={setBookingInsuranceName}
                  />
                </View>
              )}

              <Text style={styles.inputFieldLabel}>Care Requirements & Clinical Notes</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 75, textAlignVertical: 'top' }]}
                placeholder="Describe patient's condition, mobility level, medication help needed, or wound care instructions..."
                placeholderTextColor="#7e6c98"
                multiline
                value={bookingCareNotes}
                onChangeText={setBookingCareNotes}
              />

              <View style={styles.modalDisclaimerBox}>
                <Text style={styles.modalDisclaimerText}>
                  ⚠️ Disclaimer: Care service providers in the marketplace are independent clinicians and agencies. They will review your clinical requirements and confirm availability prior to dispatch.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!selectedServiceForBooking) return;
                  if (!bookingPatientName.trim() || !bookingAddress.trim()) {
                    Alert.alert('Required Fields', 'Please enter patient name and service address.');
                    return;
                  }
                  const newBooking: CareBooking = {
                    id: `bk-${Date.now()}`,
                    serviceId: selectedServiceForBooking.id,
                    providerName: selectedServiceForBooking.name,
                    serviceTitle: selectedServiceForBooking.title,
                    serviceCategory: selectedServiceForBooking.categoryLabel,
                    patientName: bookingPatientName.trim(),
                    patientPhone: bookingPhone.trim() || 'On File',
                    address: bookingAddress.trim(),
                    preferredDate: bookingDate.trim() || 'Soonest Available',
                    preferredTimeSlot: bookingTimeSlot.trim() || 'Standard Daytime',
                    careNotes: bookingCareNotes.trim(),
                    paymentMethod: bookingPaymentType,
                    insuranceProvider: bookingPaymentType === 'Insurance' ? bookingInsuranceName : undefined,
                    status: 'Confirmed',
                    createdAt: Date.now()
                  };
                  setCareBookings(prev => [newBooking, ...prev]);
                  handleOpenChatWith('expert', { id: selectedServiceForBooking.id, name: selectedServiceForBooking.name, specialty: selectedServiceForBooking.title });
                  setSelectedServiceForBooking(null);
                  setMarketplaceSubTab('my_bookings');
                  showToast(`✅ Care request confirmed with ${selectedServiceForBooking.name}! View in My Bookings.`);
                }}
                style={styles.publishSubmitBtn}
              >
                <CheckCircle color="#FFF" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.publishSubmitBtnText}>Submit Care Request</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: LIST YOUR CARE SERVICE */}
      <Modal visible={showListServiceModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentBox, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Plus color={COLORS.accent} size={20} style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>List Your Care Service</Text>
              </View>
              <TouchableOpacity onPress={() => setShowListServiceModal(false)}>
                <X color="#FFF" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputFieldLabel}>Provider / Clinician Full Name *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Sarah Miller, RN, BSN"
                placeholderTextColor="#7e6c98"
                value={newServiceName}
                onChangeText={setNewServiceName}
              />

              <Text style={styles.inputFieldLabel}>Professional Title & Credentials *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Licensed Home Infusion Nurse & Wound Specialist"
                placeholderTextColor="#7e6c98"
                value={newServiceTitle}
                onChangeText={setNewServiceTitle}
              />

              <Text style={styles.inputFieldLabel}>Agency or Practice Name (Optional)</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Miller Clinical Care LLC"
                placeholderTextColor="#7e6c98"
                value={newServiceAgency}
                onChangeText={setNewServiceAgency}
              />

              <Text style={styles.inputFieldLabel}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {[
                  { key: 'nursing', label: '🩺 Clinical Nursing' },
                  { key: 'caregiver', label: '🧑‍🦼 Caregiver/PCA' },
                  { key: 'therapy', label: '🏃 Physical Therapy' },
                  { key: 'nutrition', label: '🥗 Nutrition' },
                  { key: 'transport', label: '🚐 Transport' },
                  { key: 'respite', label: '🌙 Respite Care' },
                  { key: 'phlebotomy', label: '🩸 Phlebotomy' }
                ].map(c => (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => setNewServiceCategory(c.key as any)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      backgroundColor: newServiceCategory === c.key ? '#5c1794' : 'rgba(255,255,255,0.05)',
                      borderWidth: 1,
                      borderColor: newServiceCategory === c.key ? COLORS.accent : 'transparent'
                    }}
                  >
                    <Text style={{ color: newServiceCategory === c.key ? '#FFF' : COLORS.textSub, fontSize: 11, fontWeight: '700' }}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputFieldLabel}>Hourly / Visit Rate *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. $55 / hr or $85 / visit"
                placeholderTextColor="#7e6c98"
                value={newServiceRate}
                onChangeText={setNewServiceRate}
              />

              <Text style={styles.inputFieldLabel}>Service Location & Coverage Radius *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Greater Boston (Up to 30 miles)"
                placeholderTextColor="#7e6c98"
                value={newServiceLocation}
                onChangeText={setNewServiceLocation}
              />

              <Text style={styles.inputFieldLabel}>Contact Phone *</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. +1 (617) 555-0199"
                placeholderTextColor="#7e6c98"
                keyboardType="phone-pad"
                value={newServicePhone}
                onChangeText={setNewServicePhone}
              />

              <Text style={styles.inputFieldLabel}>Specialties (comma-separated)</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="e.g. Post-Op Care, IV Therapy, Catheter Care"
                placeholderTextColor="#7e6c98"
                value={newServiceSpecialties}
                onChangeText={setNewServiceSpecialties}
              />

              <Text style={styles.inputFieldLabel}>Professional Bio & Clinical Background</Text>
              <TextInput
                style={[styles.modalTextInput, { height: 75, textAlignVertical: 'top' }]}
                placeholder="Share your clinical background, years of experience, and care philosophy..."
                placeholderTextColor="#7e6c98"
                multiline
                value={newServiceBio}
                onChangeText={setNewServiceBio}
              />

              <TouchableOpacity
                onPress={() => {
                  if (!newServiceName.trim() || !newServiceTitle.trim() || !newServiceRate.trim()) {
                    Alert.alert('Required Fields', 'Please fill in your name, professional title, and rate.');
                    return;
                  }
                  const created: CareService = {
                    id: `cs-${Date.now()}`,
                    name: newServiceName.trim(),
                    title: newServiceTitle.trim(),
                    agency: newServiceAgency.trim() || undefined,
                    category: newServiceCategory,
                    categoryLabel: newServiceCategory === 'nursing' ? '🩺 In-Home Clinical Nursing' : newServiceCategory === 'caregiver' ? '🧑‍🦼 Caregiver & Home Health Aide' : newServiceCategory === 'therapy' ? '🏃 In-Home Physical Therapy' : newServiceCategory === 'nutrition' ? '🥗 Clinical Nutrition' : newServiceCategory === 'transport' ? '🚐 Medical Transport' : newServiceCategory === 'respite' ? '🌙 Respite & Overnight Care' : '🩸 Mobile Blood Draw',
                    rating: 5.0,
                    reviewCount: 1,
                    hourlyRate: newServiceRate.trim(),
                    location: newServiceLocation.trim() || 'Local Area',
                    serviceRadius: '30-mile coverage',
                    insuranceAccepted: ['Medicare', 'Private Insurance', 'Self-Pay'],
                    verified: true,
                    backgroundChecked: true,
                    availability: 'Available by Appointment',
                    specialties: newServiceSpecialties.split(',').map(s => s.trim()).filter(Boolean),
                    bio: newServiceBio.trim() || 'Dedicated certified healthcare professional committed to excellence in patient-centered care.',
                    avatarText: newServiceName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
                    phone: newServicePhone.trim() || undefined
                  };
                  setCareServices(prev => [created, ...prev]);
                  setShowListServiceModal(false);
                  setNewServiceName('');
                  setNewServiceTitle('');
                  setNewServiceRate('');
                  setNewServiceBio('');
                  showToast('✨ Your care service has been published to the Care Marketplace!');
                }}
                style={styles.publishSubmitBtn}
              >
                <CheckCircle color="#FFF" size={16} style={{ marginRight: 6 }} />
                <Text style={styles.publishSubmitBtnText}>Publish Care Service Listing</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  tabDisclaimerCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  tabDisclaimerText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  bottomDisclaimer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    alignItems: 'center',
  },
  bottomDisclaimerText: {
    color: '#a78bfa',
    fontSize: 10.5,
    lineHeight: 14.5,
    textAlign: 'center',
  },
  bottomLegalDisclaimer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    alignItems: 'center',
  },
  bottomLegalDisclaimerText: {
    color: '#a78bfa',
    fontSize: 10.5,
    lineHeight: 14.5,
    textAlign: 'center',
  },
  modalDisclaimerBox: {
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  modalDisclaimerText: {
    color: '#fef3c7',
    fontSize: 10,
    lineHeight: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#200438',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#5c1794',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#9d32dc',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textSub,
    fontSize: 11,
  },
  closeCircle: {
    padding: 6,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toastText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  mainNav: {
    flexDirection: 'row',
    backgroundColor: '#200438',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mainNavTab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainNavTabActive: {
    backgroundColor: COLORS.deepViolet,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  mainNavTabText: {
    color: COLORS.textSub,
    fontSize: 11.5,
    fontWeight: '700',
  },
  mainNavTabTextActive: {
    color: '#FFF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  createPostHero: {
    backgroundColor: '#260444',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  userAvatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  createPostInputPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  createPostActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 4,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  quickActionText: {
    color: COLORS.accent,
    fontSize: 11.5,
    fontWeight: '700',
  },
  streamFilterRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 6,
  },
  streamFilterChip: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  streamFilterChipActive: {
    backgroundColor: '#380c66',
    borderColor: COLORS.accent,
  },
  streamFilterText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '700',
  },
  streamFilterTextActive: {
    color: '#FFF',
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginRight: 6,
  },
  categoryPillActive: {
    backgroundColor: COLORS.deepViolet,
    borderColor: COLORS.accent,
  },
  categoryPillText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFF',
  },
  postCard: {
    backgroundColor: '#260444',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9d32dc',
  },
  authorAvatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  authorName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  authorRole: {
    color: COLORS.textSub,
    fontSize: 11,
  },
  groupBadge: {
    backgroundColor: 'rgba(92, 23, 148, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  groupBadgeText: {
    color: '#d8b4fe',
    fontSize: 10,
    fontWeight: '700',
  },
  postTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10.5,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229, 114, 163, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(229, 114, 163, 0.3)',
  },
  moodBadgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  postTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 20,
  },
  postContent: {
    color: '#E0D4F0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  milestoneText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  postTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagChipText: {
    color: COLORS.accent,
    fontSize: 10.5,
    fontWeight: '600',
  },
  reactionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  reactionBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  reactionBtnText: {
    color: COLORS.textSub,
    fontSize: 11.5,
    fontWeight: '700',
  },
  commentsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 8,
    borderRadius: 10,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#5c1794',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  commentAuthor: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expertMiniBadge: {
    backgroundColor: 'rgba(0,200,100,0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  commentTime: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
  },
  commentText: {
    color: '#DDD',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  noCommentsText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 4,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  commentInput: {
    flex: 1,
    height: 36,
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: 6,
  },
  commentSendBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.deepViolet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSub: {
    color: COLORS.textSub,
    fontSize: 11,
    marginTop: 1,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.deepViolet,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  headerActionBtnText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  circleCard: {
    backgroundColor: '#260444',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  circleCardJoined: {
    borderColor: '#731bb8',
    backgroundColor: 'rgba(92, 23, 148, 0.2)',
  },
  circleEmojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  categoryBadge: {
    backgroundColor: 'rgba(229, 114, 163, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  circleName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  circleDescription: {
    color: '#DDD',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  circleSchedule: {
    color: COLORS.accent,
    fontSize: 11.5,
    fontWeight: '600',
  },
  circleMemberCount: {
    color: COLORS.textSub,
    fontSize: 11,
  },
  circleActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  circleJoinBtn: {
    flex: 1,
    backgroundColor: COLORS.deepViolet,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  circleJoinedBtn: {
    backgroundColor: 'rgba(0, 200, 100, 0.15)',
    borderWidth: 1,
    borderColor: '#00C864',
  },
  circleJoinBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  circlePostBtn: {
    backgroundColor: '#380c66',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  circlePostBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  expertCard: {
    backgroundColor: '#260444',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  expertAvatarBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#380c66',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  expertName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expertSpecialty: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  expertCredentials: {
    color: COLORS.textSub,
    fontSize: 11,
    marginTop: 1,
  },
  expertBio: {
    color: '#DDD',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  expertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  expertMetaText: {
    color: '#d8b4fe',
    fontSize: 11,
    fontWeight: '600',
  },
  expertActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  bookConsultBtn: {
    flex: 1,
    backgroundColor: COLORS.deepViolet,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bookConsultBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  askOgooPrepBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  askOgooPrepBtnText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  peerCard: {
    backgroundColor: '#260444',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  peerAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5c1794',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9d32dc',
  },
  peerAvatarText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  peerName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 100, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C864',
    marginRight: 4,
  },
  activeStatusText: {
    color: '#00C864',
    fontSize: 10,
    fontWeight: '700',
  },
  peerStruggle: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  peerBio: {
    color: '#DDD',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  peerMilestoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    padding: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  peerMilestoneText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '600',
  },
  peerActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  sendEncouragementBtn: {
    flex: 1,
    backgroundColor: COLORS.deepViolet,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sendEncouragementText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  connectPeerBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  connectPeerBtnText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: COLORS.textSub,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 17,
  },
  emptyButton: {
    backgroundColor: COLORS.deepViolet,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContentBox: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '90%',
    backgroundColor: '#200438',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  formLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 4,
  },
  destinationRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  destinationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  destinationChipActive: {
    backgroundColor: COLORS.deepViolet,
    borderColor: COLORS.accent,
  },
  destinationChipText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '700',
  },
  moodSelectChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  moodSelectChipActive: {
    backgroundColor: '#5c1794',
    borderColor: COLORS.accent,
  },
  moodSelectText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontWeight: '600',
  },
  modalTextInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 13,
    marginBottom: 10,
  },
  inputFieldLabel: {
    color: '#d8b4fe',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 6,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  checkboxBoxActive: {
    backgroundColor: COLORS.deepViolet,
    borderColor: COLORS.accent,
  },
  publishSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.deepViolet,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  publishSubmitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  presetNoteChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  presetNoteText: {
    color: '#d8b4fe',
    fontSize: 11.5,
    fontWeight: '600',
  },
});
