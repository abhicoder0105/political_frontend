import AdminTable from '../../components/AdminTable'
import { WORK_STATUSES } from '../../constants'

const FIELDS = [
  { name: 'image_url', label: 'मुख्य छवि', type: 'image' },
  { name: 'title', label: 'शीर्षक', type: 'text' },
  { name: 'work_type', label: 'कार्य प्रकार', type: 'text' },
  { name: 'status', label: 'स्थिति', type: 'select', options: WORK_STATUSES },
  { name: 'category', label: 'श्रेणी', type: 'text' },
  { name: 'area', label: 'क्षेत्र', type: 'text' },
  { name: 'village', label: 'गाँव', type: 'text' },
  { name: 'assigned_to', label: 'कार्यकर्ता', type: 'text' },
  { name: 'budget', label: 'बजट', type: 'number' },
  { name: 'description', label: 'विवरण', type: 'textarea' },
  { name: 'remarks', label: 'टिप्पणियाँ', type: 'textarea' },
]

const FILTERS = [
  { name: 'status', label: 'स्थिति', type: 'select', options: WORK_STATUSES },
]

export default function WorkDone() {
  return (
    <AdminTable
      title="कार्य प्रबंधन"
      endpoint="/api/work_dones"
      createPayloadKey="work_done"
      columns={[{ key: 'image_url', type: 'image' }, 'title', 'work_type', 'status', 'assigned_to']}
      formFields={FIELDS}
      filters={FILTERS}
      enableCreate
      enableEdit
      enableDelete
    />
  )
}
