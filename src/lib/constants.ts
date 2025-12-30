export const ISSUE_CATEGORIES = {
  registration_eligibility: 'Registration / Eligibility',
  payment_refund: 'Payment / Refund',
  activity_points: 'Activity Points',
  training_schedule: 'Training Schedule',
  portal_technical: 'Portal / Technical',
  level_3_one_on_one: 'Level 3 / 1-on-1',
  other: 'Other',
} as const;

export const EXCEPTION_TYPES = {
  medical_emergency: 'Medical Emergency',
  personal_unforeseen: 'Personal / Unforeseen Circumstance',
  missed_activity: 'Missed Activity',
  deadline_extension: 'Deadline Extension',
  reattempt_request: 'Reattempt Request',
} as const;

export const TRAINING_LEVELS = {
  level_1: 'Level 1',
  level_2: 'Level 2',
  level_3: 'Level 3',
} as const;

export const REQUEST_STATUSES = {
  open: 'Open',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  resolved: 'Resolved',
} as const;

export const STATUS_COLORS = {
  open: 'bg-status-open',
  under_review: 'bg-status-review',
  approved: 'bg-status-approved',
  rejected: 'bg-status-rejected',
  resolved: 'bg-status-resolved',
} as const;

export const PRIORITY_COLORS = {
  1: 'bg-priority-1',
  2: 'bg-priority-2',
  3: 'bg-priority-3',
  4: 'bg-priority-4',
  5: 'bg-priority-5',
} as const;

export const ESCALATION_COOLDOWN_MS = 60 * 60 * 1000; // 60 minutes
export const MAX_PRIORITY = 5;

export const ALLOWED_EMAIL_DOMAIN = '@ds.study.iitm.ac.in';
