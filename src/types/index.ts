export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export type GradeLevel = 'primary' | 'middle' | 'high';

export type EmotionId =
  | 'vui_ve'
  | 'binh_yen'
  | 'buon_ba'
  | 'lo_lang'
  | 'tuc_gian'
  | 'that_vong'
  | 'co_don'
  | 'met_moi';

export type ActiveModule =
  | 'home'
  | 'my-feelings'
  | 'calm-corner'
  | 'buddy-talk'
  | 'emotion-diary'
  | 'get-support'
  | 'library'
  | 'parent-teacher'
  | 'admin-dashboard';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  gradeLevel?: GradeLevel;
  classLabel?: string;
  isDemoAccount?: boolean;
}

export interface EmotionCheckIn {
  id: string;
  studentId: string;
  gradeLevel: GradeLevel;
  emotion: EmotionId;
  intensity: number; // 1 to 5
  causePrompt: string;
  extraNote: string;
  createdAt: string;
  isDemoData?: boolean;
}

export interface DiaryEntry {
  id: string;
  studentId: string;
  emotion: EmotionId;
  sticker: string;
  feelingToday: string;
  whatHappened: string;
  joyOrSadness: string;
  howICoped: string;
  gratitude: string;
  positiveNote: string;
  createdAt: string;
  isDemoData?: boolean;
}

export type SupportTopic =
  | 'cam_xuc'
  | 'hoc_tap'
  | 'ban_be'
  | 'gia_dinh'
  | 'ap_luc'
  | 'ca_nhan'
  | 'khac';

export type ContactMethod =
  | 'phong_tam_ly'
  | 'teams_hoc_duong'
  | 'dien_thoai'
  | 'qua_gvcn';

export interface SupportRequest {
  id: string;
  studentId: string;
  studentName: string;
  gradeLevel: GradeLevel;
  classLabel: string;
  requestType: 'ho_tro' | 'tham_van_ca_nhan';
  topic: SupportTopic;
  contactMethod: ContactMethod;
  contactDetail: string;
  description: string;
  status: 'moi_tiep_nhan' | 'dang_lien_he' | 'da_ket_noi';
  createdAt: string;
  isDemoData?: boolean;
}

export type LibraryFormat = 'bai_viet' | 'video' | 'infographic' | 'tinh_huong' | 'bai_tap';

export interface LibraryResource {
  id: string;
  title: string;
  gradeLevel: GradeLevel;
  topic: string;
  format: LibraryFormat;
  readTime: string;
  summary: string;
  content: string[];
  interactiveQuestion: string;
  interactiveChoices: string[];
  practiceExercise: string;
  imageUrl?: string;
  isDemoData?: boolean;
}

export interface BuddyTalkOption {
  id: string;
  label: string;
  nextStepId: string | 'finish' | 'support_redirect';
  empathyReply: string;
  suggestedAction?: string;
}

export interface BuddyTalkStep {
  id: string;
  stepOrder: number;
  gradeLevel: GradeLevel | 'all';
  question: string;
  options: BuddyTalkOption[];
}

export interface SafetyAlert {
  id: string;
  studentId: string;
  studentAlias: string;
  gradeLevel: GradeLevel;
  source: 'buddy_talk' | 'manual_help_button';
  triggerSummary: string;
  studentMessageExcerpt: string;
  status: 'can_xac_minh' | 'dang_ho_tro' | 'da_xac_minh';
  createdAt: string;
  verifiedBy?: string;
  isDemoData?: boolean;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'support_request' | 'safety_alert' | 'statistics_export';
  targetId: string;
  timestamp: string;
}

export interface AdminOverviewData {
  totalStudentAccounts: number;
  totalCheckIns: number;
  totalSupportRequests: number;
  totalCounselingRegistrations: number;
  pendingSafetyAlerts: number;
  emotionDistribution: { emotion: EmotionId; count: number }[];
  gradeBreakdown: { gradeLevel: GradeLevel; checkIns: number; supportRequests: number }[];
  dailyTrend: { date: string; positive: number; neutralOrLow: number; total: number }[];
  containsDemoData: boolean;
}
