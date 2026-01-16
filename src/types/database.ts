export type AppRole = 'student' | 'admin';
export type RequestType = 'issue' | 'exception';
export type RequestStatus = 'open' | 'under_review' | 'approved' | 'rejected' | 'resolved';
export type IssueCategory = 
  | 'registration_eligibility'
  | 'payment_refund'
  | 'activity_points'
  | 'training_schedule'
  | 'portal_technical'
  | 'level_3_one_on_one'
  | 'other';
export type ExceptionType = 
  | 'medical_emergency'
  | 'personal_unforeseen'
  | 'missed_activity'
  | 'deadline_extension'
  | 'reattempt_request';
export type TrainingLevel = 'level_1' | 'level_2' | 'level_3';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Request {
  id: string;
  student_id: string;
  request_type: RequestType;
  issue_category: IssueCategory | null;
  exception_type: ExceptionType | null;
  training_level: TrainingLevel;
  affected_activity: string | null;
  title: string;
  description: string;
  priority: number;
  status: RequestStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface Escalation {
  id: string;
  request_id: string;
  reason: string;
  created_at: string;
}

export interface AdminNote {
  id: string;
  request_id: string;
  admin_id: string;
  note: string;
  visible_to_student: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  category: IssueCategory;
  question: string;
  answer: string;
  keywords: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type ActivityAction = 
  | 'STATUS_UPDATED'
  | 'ROLE_CHANGED'
  | 'ANNOUNCEMENT_CREATED'
  | 'ANNOUNCEMENT_UPDATED'
  | 'ANNOUNCEMENT_DELETED'
  | 'FAQ_CREATED'
  | 'FAQ_EDITED'
  | 'FAQ_DELETED'
  | 'REQUEST_ASSIGNED'
  | 'NOTE_ADDED';

export type ActivityTargetType = 'request' | 'user' | 'announcement' | 'faq';

export interface ActivityLog {
  id: string;
  actor_email: string;
  action_type: ActivityAction;
  target_id: string;
  target_type: ActivityTargetType;
  metadata: Record<string, any>;
  created_at: string;
}
