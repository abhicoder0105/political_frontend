import AdminTable from '../../components/AdminTable'
import { USER_ROLES, AREA_TYPES } from '../../constants'

const FIELDS = [
  { name: 'name', label: 'नाम', type: 'text' },
  { name: 'mobile_number', label: 'मोबाइल नंबर', type: 'tel' },
  { name: 'role', label: 'भूमिका', type: 'select', options: USER_ROLES },
  { name: 'area', label: 'क्षेत्र', type: 'text' },
  { name: 'village_or_ward', label: 'गाँव / वार्ड', type: 'text' },
  { name: 'address', label: 'पता', type: 'textarea' },
  { name: 'rural_or_urban', label: 'ग्रामीण/शहरी', type: 'select', options: AREA_TYPES },
]

const FILTERS = [
  { name: 'role', label: 'भूमिका', type: 'select', options: USER_ROLES },
]

export default function Team() {
  return (
    <AdminTable
      title="टीम सदस्य"
      endpoint="/api/users"
      createPayloadKey="user"
      columns={['name', 'mobile_number', 'role', 'area']}
      formFields={FIELDS}
      filters={FILTERS}
      enableCreate
      enableEdit
      enableDelete
    />
  )
}
