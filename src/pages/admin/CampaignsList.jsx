import AdminTable from '../../components/AdminTable'
import { CAMPAIGN_STATUSES, TARGET_SUPPORT_STATUSES } from '../../constants'

const FIELDS = [
  { name: 'image_url', label: 'मुख्य छवि', type: 'image' },
  { name: 'title', label: 'शीर्षक', type: 'text' },
  { name: 'language', label: 'भाषा', type: 'text' },
  { name: 'campaign_status', label: 'स्थिति', type: 'select', options: CAMPAIGN_STATUSES },
  { name: 'target_support_status', label: 'लक्षित समर्थन स्थिति', type: 'select', options: TARGET_SUPPORT_STATUSES },
  { name: 'target_area', label: 'लक्षित क्षेत्र', type: 'text' },
  { name: 'target_village', label: 'लक्षित गाँव', type: 'text' },
  { name: 'scheduled_at', label: 'निर्धारित दिनांक', type: 'text' },
  { name: 'description', label: 'विवरण', type: 'textarea' },
]

const FILTERS = [
  { name: 'campaign_status', label: 'स्थिति', type: 'select', options: CAMPAIGN_STATUSES },
]

export default function AdminCampaignsList() {
  return (
    <AdminTable
      title="अभियान प्रबंधन"
      endpoint="/api/campaigns"
      createPayloadKey="campaign"
      columns={[{ key: 'image_url', type: 'image' }, 'title', 'campaign_status', 'target_area', 'target_village']}
      formFields={FIELDS}
      filters={FILTERS}
      enableCreate
      enableEdit
      enableDelete
      detailPath="/admin/campaigns/:id"
    />
  )
}
