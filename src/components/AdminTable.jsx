import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { apiRequest } from '../lib/api'
import { getImageUrl, isValidImageFile } from '../lib/images'
import { humanizeEnum, optionLabel } from '../utils/enums'
import { isValidEmail } from '../utils/forms'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import { TableSkeleton } from './Skeleton'
import Pagination from './Pagination'
import FilterBar from './FilterBar'
import CreateEditModal from './CreateEditModal'
import useApi from '../hooks/useApi'
import PageHeader from './ui/PageHeader'
import Button from './ui/Button'

export default function AdminTable({
  title,
  endpoint,
  columns,
  formFields = [],
  filters = [],
  createPayloadKey,
  enableCreate = false,
  enableEdit = false,
  enableDelete = false,
  detailPath,
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())
  const queryStr = new URLSearchParams(query).toString()
  const { data, loading, error, reload } = useApi(queryStr ? `${endpoint}?${queryStr}` : endpoint)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleFilter(name, value) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(name, value)
    else params.delete(name)
    params.set('page', '1')
    setSearchParams(params)
  }

  function validate(formData) {
    for (const field of formFields) {
      const value = formData[field.name]
      if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
        toast.error(`${field.label} आवश्यक है`)
        return false
      }
      if (field.type === 'select' && value && !field.options.includes(value)) {
        toast.error(`${field.label}: चुना गया मान सही नहीं है`)
        return false
      }
      if (field.type === 'email' && value && !isValidEmail(value)) {
        toast.error('कृपया सही ईमेल दर्ज करें')
        return false
      }
      if ((field.type === 'tel' || field.name.includes('phone') || field.name.includes('mobile')) && value && !/^\d{10}$/.test(String(value))) {
        toast.error('मोबाइल नंबर 10 अंकों का होना चाहिए')
        return false
      }
    }

    if (formData.uploaded_image instanceof File && !isValidImageFile(formData.uploaded_image)) {
      toast.error('कृपया वैध इमेज फाइल चुनें')
      return false
    }
    return true
  }

  function hasImageField(fields) {
    return fields.some((field) => field.type === 'image')
  }

  function buildFormData(formData) {
    const fd = new FormData()
    const prefix = createPayloadKey ? `${createPayloadKey}[` : ''
    const suffix = createPayloadKey ? `]` : ''
    for (const key of Object.keys(formData)) {
      if (key === 'uploaded_image' && formData[key] instanceof File) {
        fd.append(`${prefix}uploaded_image${suffix}`, formData[key])
      } else if (key === 'remove_image') {
        fd.append(`${prefix}remove_image${suffix}`, formData[key])
      } else if (formData[key] !== null && formData[key] !== undefined) {
        fd.append(`${prefix}${key}${suffix}`, String(formData[key]))
      }
    }
    return fd
  }

  function buildJson(formData) {
    return JSON.stringify(createPayloadKey ? { [createPayloadKey]: formData } : formData)
  }

  async function handleCreate(formData) {
    if (!validate(formData)) return
    setSubmitting(true)
    try {
      const body = hasImageField(formFields) ? buildFormData(formData) : buildJson(formData)
      await apiRequest(endpoint, { method: 'POST', body })
      toast.success('रिकॉर्ड सफलतापूर्वक बनाया गया')
      setShowCreate(false)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(id, formData) {
    if (!validate(formData)) return
    setSubmitting(true)
    try {
      const body = hasImageField(formFields) ? buildFormData(formData) : buildJson(formData)
      await apiRequest(`${endpoint}/${id}`, { method: 'PATCH', body })
      toast.success('रिकॉर्ड अपडेट हुआ')
      setEditing(null)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('क्या आप इस रिकॉर्ड को हटाना चाहते हैं?')) return
    try {
      await apiRequest(`${endpoint}/${id}`, { method: 'DELETE' })
      toast.success('रिकॉर्ड हटाया गया')
      reload()
    } catch (err) {
      toast.error(err.message)
    }
  }

  function colLabel(col) {
    return col.label || (typeof col === 'string' ? humanizeEnum(col) : humanizeEnum(col.key || ''))
  }

  function renderCell(record, col) {
    const key = col.key || col
    const label = colLabel(col)
    if (col.type === 'image') {
      return (
        <td key={key} data-label={label} className="whitespace-nowrap px-4 py-3">
          <img src={getImageUrl(record[key] || record.image_url, 'thumbnail')} alt="" className="h-12 w-16 rounded-lg object-cover ring-1 ring-slate-200" />
        </td>
      )
    }

    const value = record[key]
    return (
      <td key={key} data-label={label} className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
        {typeof value === 'string' ? humanizeEnum(value) : String(value ?? '')}
      </td>
    )
  }

  const records = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        eyebrow="प्रबंधन"
        title={title}
        description="खोज, फिल्टर, रिकॉर्ड संपादन और साफ स्थिति संकेतों के साथ।"
        actions={enableCreate && (
          <Button type="button" onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            नया बनाएं
          </Button>
        )}
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="input pl-10"
            placeholder="नाम, शीर्षक या मोबाइल से खोजें..."
            value={query.search || ''}
            onChange={(e) => handleFilter('search', e.target.value)}
          />
        </div>
      </div>

      {filters.length > 0 && <FilterBar filters={filters} query={query} onChange={handleFilter} />}

      {loading && <TableSkeleton columns={columns.length} />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && records.length === 0 && (
        <EmptyState title="कोई रिकॉर्ड नहीं मिला" message="फिल्टर बदलें या नया रिकॉर्ड बनाएं।" />
      )}

      {!loading && !error && records.length > 0 && (
        <div className="admin-table-card responsive-table">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {columns.map((col) => (
                    <th key={col.key || col} className="px-4 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                      {colLabel(col)}
                    </th>
                  ))}
                  {(enableEdit || enableDelete) && (
                    <th className="px-4 py-3.5 text-right text-xs font-black uppercase tracking-wider text-slate-500">क्रियाएं</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`border-b border-slate-100 transition-colors last:border-b-0 ${
                      detailPath ? 'cursor-pointer hover:bg-orange-50/50' : 'hover:bg-slate-50'
                    } ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}
                    onClick={() => detailPath && navigate(detailPath.replace(':id', record.id))}
                  >
                    {columns.map((col) => renderCell(record, col))}
                    {(enableEdit || enableDelete) && (
                      <td data-label="क्रियाएं" className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {enableEdit && (
                            <button className="btn-secondary min-h-9 px-3 py-1.5 text-xs" onClick={(e) => { e.stopPropagation(); setEditing(record) }}>
                              <Edit3 size={14} />
                              संपादित
                            </button>
                          )}
                          {enableDelete && (
                            <button className="btn-danger min-h-9 px-3 py-1.5 text-xs" onClick={(e) => { e.stopPropagation(); handleDelete(record.id) }}>
                              <Trash2 size={14} />
                              हटाएं
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={data?.meta} searchParams={searchParams} setSearchParams={setSearchParams} />
        </div>
      )}

      {showCreate && (
        <CreateEditModal
          title={`नया ${title}`}
          formFields={formFields}
          optionLabel={optionLabel}
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          submitting={submitting}
        />
      )}

      {editing && (
        <CreateEditModal
          title={`${title} संपादित करें`}
          formFields={formFields}
          initial={editing}
          optionLabel={optionLabel}
          onSave={(formData) => handleEdit(editing.id, formData)}
          onClose={() => setEditing(null)}
          submitting={submitting}
        />
      )}
    </div>
  )
}
