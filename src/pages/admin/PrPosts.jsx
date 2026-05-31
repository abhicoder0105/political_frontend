import AdminTable from '../../components/AdminTable'
import { PR_STATUSES } from '../../constants'

const FIELDS = [
  { name: 'image_url', label: 'मुख्य छवि', type: 'image' },
  { name: 'title', label: 'शीर्षक', type: 'text', required: true },
  { name: 'content', label: 'सामग्री', type: 'textarea' },
  { name: 'language', label: 'भाषा', type: 'text' },
  { name: 'status', label: 'स्थिति', type: 'select', options: PR_STATUSES },
  { name: 'scheduled_at', label: 'निर्धारित दिनांक', type: 'text' },
  { name: 'published_at', label: 'प्रकाशन दिनांक', type: 'text' },
]

const FILTERS = [
  { name: 'status', label: 'स्थिति', type: 'select', options: PR_STATUSES },
]

export default function PrPosts() {
  return (
    <AdminTable
      title="समाचार प्रबंधन"
      endpoint="/api/pr_posts"
      createPayloadKey="pr_post"
      columns={[{ key: 'image_url', label: 'छवि', type: 'image' }, 'title', 'language', 'status', 'scheduled_at']}
      formFields={FIELDS}
      filters={FILTERS}
      enableCreate
      enableEdit
      enableDelete
    />
  )
}
