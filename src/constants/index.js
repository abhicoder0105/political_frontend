export const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'active', 'completed']
export const TARGET_SUPPORT_STATUSES = ['supporter', 'neutral', 'opposition', 'unknown_support']
export const WORK_STATUSES = ['pending', 'in_progress', 'completed', 'rejected']
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
export const SUPPORT_STATUSES = ['supporter', 'neutral', 'opposition', 'unknown_support']
export const REQUEST_STATUSES = ['new_request', 'assigned', 'in_progress', 'resolved', 'rejected', 'escalated']
export const SEVERITIES = ['low', 'medium', 'high', 'critical']

export const CATEGORIES = [
  'water',
  'electricity',
  'road',
  'hospital',
  'police',
  'pension',
  'government_scheme',
  'education',
  'sanitation',
  'corruption',
  'emergency',
  'other',
]

export const STATUS_COLORS = {
  new_request: 'bg-blue-100 text-blue-700',
  assigned: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-orange-100 text-orange-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  escalated: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  draft: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-purple-100 text-purple-700',
  published: 'bg-emerald-100 text-emerald-700',
}

export const SEVERITY_COLORS = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}
