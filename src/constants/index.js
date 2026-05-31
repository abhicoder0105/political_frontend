export const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'active', 'completed']

export const TARGET_SUPPORT_STATUSES = [
  'supporter',
  'neutral',
  'opposition',
  'unknown_support',
]

export const WORK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'rejected',
]

export const PR_STATUSES = ['draft', 'scheduled', 'published']

export const USER_ROLES = [
  'super_admin',
  'admin',
  'sub_admin',
  'district_manager',
  'area_manager',
  'field_worker',
  'volunteer',
  'pr_team',
  'data_entry_operator',
  'complaint_manager',
  'campaign_manager',
  'public_user',
]

export const AREA_TYPES = ['rural', 'urban']

export const GENDERS = ['unknown', 'male', 'female', 'other']

export const SUPPORT_STATUSES = [
  'supporter',
  'neutral',
  'opposition',
  'unknown_support',
]

export const REQUEST_STATUSES = [
  'pending',
  'in_progress',
  'escalated',
  'resolved',
  'closed',
]

export const SEVERITIES = ['low', 'medium', 'high', 'critical']

export const CATEGORIES = [
  'water',
  'road',
  'electricity',
  'sanitation',
  'health',
  'education',
  'land',
  'pension',
  'ration',
  'other',
]

export const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  escalated: 'bg-red-100 text-red-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-slate-100 text-slate-600',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  draft: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

export const SEVERITY_COLORS = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}
