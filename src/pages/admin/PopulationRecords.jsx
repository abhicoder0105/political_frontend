import AdminTable from '../../components/AdminTable'
import { SUPPORT_STATUSES, GENDERS, AREA_TYPES } from '../../constants'

const FIELDS = [
  { name: 'name', label: 'नाम', type: 'text' },
  { name: 'full_name', label: 'पूरा नाम', type: 'text' },
  { name: 'phone_number', label: 'मोबाइल नंबर', type: 'tel' },
  { name: 'age', label: 'आयु', type: 'number' },
  { name: 'gender', label: 'लिंग', type: 'select', options: GENDERS },
  { name: 'area', label: 'क्षेत्र', type: 'text' },
  { name: 'village', label: 'गाँव', type: 'text' },
  { name: 'ward', label: 'वार्ड', type: 'text' },
  { name: 'village_or_ward', label: 'गाँव / वार्ड', type: 'text' },
  { name: 'rural_or_urban', label: 'ग्रामीण/शहरी', type: 'select', options: AREA_TYPES },
  { name: 'political_support_status', label: 'राजनीतिक समर्थन स्थिति', type: 'select', options: SUPPORT_STATUSES },
  { name: 'address', label: 'पता', type: 'textarea' },
  { name: 'notes', label: 'नोट्स', type: 'textarea' },
]

const FILTERS = [
  { name: 'political_support_status', label: 'समर्थन स्थिति', type: 'select', options: SUPPORT_STATUSES },
  { name: 'gender', label: 'लिंग', type: 'select', options: GENDERS },
  { name: 'area', label: 'क्षेत्र', type: 'text' },
]

export default function PopulationRecords() {
  return (
    <AdminTable
      title="जनसंख्या रिकॉर्ड"
      endpoint="/api/population_records"
      createPayloadKey="population_record"
      columns={['name', 'phone_number', 'area', 'village', 'ward', 'political_support_status']}
      formFields={FIELDS}
      filters={FILTERS}
      enableCreate
      enableEdit
      enableDelete
    />
  )
}
