import AdminTable from '../../components/AdminTable'

const FIELDS = [
  { name: 'name', label: 'नाम', type: 'text', required: true },
  { name: 'vidhansabha_id', label: 'विधानसभा ID', type: 'text' },
]

export default function Areas() {
  return (
    <AdminTable
      title="क्षेत्र / गांव"
      endpoint="/api/areas"
      createPayloadKey="area"
      columns={['name']}
      formFields={FIELDS}
      enableCreate
      enableEdit
      enableDelete
    />
  )
}
