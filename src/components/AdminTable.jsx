import { useState } from 'react'
import { apiRequest } from '../lib/api'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import { TableSkeleton } from './Skeleton'
import Pagination from './Pagination'
import FilterBar from './FilterBar'
import CreateEditModal from './CreateEditModal'
import useApi from '../hooks/useApi'
import { toast } from 'sonner'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
      if (field.type === 'select') {
        const val = formData[field.name]
        if (val && !field.options.includes(val)) {
          toast.error(`${field.label}: "${val}" मान्य नहीं है`)
          return false
        }
      }
    }
    return true
  }

  function hasImageField(fields) {
    return fields.some((f) => f.type === 'image')
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
      } else if (formData[key] != null && formData[key] !== undefined) {
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
      toast.success('सफलतापूर्वक बनाया गया')
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
      toast.success('सफलतापूर्वक अपडेट किया गया')
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
      toast.success('सफलतापूर्वक हटाया गया')
      reload()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const records = Array.isArray(data) ? data : data?.data || []

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900">{title}</h1>
      </div>

      {filters.length > 0 && (
        <FilterBar filters={filters} query={query} onChange={handleFilter} />
      )}

      {enableCreate && (
        <div className="mb-5">
          <button onClick={() => setShowCreate(true)} className="btn-secondary">
            नया बनाएं
          </button>
        </div>
      )}

      {loading && <TableSkeleton columns={columns.length} />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && records.length === 0 && (
        <EmptyState message="कोई रिकॉर्ड नहीं मिला" />
      )}
      {!loading && !error && records.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {columns.map((col) => (
                    <th
                      key={col.key || col}
                      className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {col.label || (typeof col === 'string' ? col : col.key || '')}
                    </th>
                  ))}
                  {(enableEdit || enableDelete) && (
                    <th className="px-4 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      क्रियाएँ
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr
                    key={record.id}
                    className={`border-b border-slate-100 transition-colors last:border-b-0 ${
                      detailPath ? 'cursor-pointer hover:bg-orange-50/50' : 'hover:bg-emerald-50/50'
                    } ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}
                    onClick={() => detailPath && navigate(detailPath.replace(':id', record.id))}
                  >
                    {columns.map((col) => {
                      const key = col.key || col
                      if (col.type === 'image') {
                        return (
                          <td key={key} className="whitespace-nowrap px-4 py-3">
                            <img
                              src={record[key] || record.image_url}
                              alt=""
                              className="h-10 w-14 rounded object-cover"
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          </td>
                        )
                      }
                      return (
                        <td key={key} className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-700">
                          {String(record[key] ?? '')}
                        </td>
                      )
                    })}
                    {(enableEdit || enableDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {enableEdit && (
                            <button
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-orange-600 transition-all hover:border-orange-300 hover:bg-orange-50"
                              onClick={(e) => { e.stopPropagation(); setEditing(record) }}
                            >
                              Edit
                            </button>
                          )}
                          {enableDelete && (
                            <button
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:border-red-300 hover:bg-red-50"
                              onClick={(e) => { e.stopPropagation(); handleDelete(record.id) }}
                            >
                              Delete
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
          onSave={(formData) => handleEdit(editing.id, formData)}
          onClose={() => setEditing(null)}
          submitting={submitting}
        />
      )}
    </div>
  )
}
