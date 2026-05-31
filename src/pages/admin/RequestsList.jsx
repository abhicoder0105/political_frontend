import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import useApi from '../../hooks/useApi'
import { apiRequest } from '../../lib/api'
import { TableSkeleton } from '../../components/Skeleton'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'
import Pagination from '../../components/Pagination'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import { CATEGORIES, SEVERITIES, REQUEST_STATUSES } from '../../constants'
import { digitsOnly, nameOnly } from '../../utils/forms'
import { humanizeEnum, optionLabel } from '../../utils/enums'

const FIELD_LABELS = {
  request_title: 'शीर्षक',
  name: 'नाम',
  phone_number: 'मोबाइल नंबर',
  area: 'क्षेत्र',
  village_or_ward: 'गांव / वार्ड',
  assigned_to: 'कार्यकर्ता',
  expected_resolution_date: 'अपेक्षित समाधान तिथि',
}

export default function AdminRequestsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = Object.fromEntries(searchParams.entries())
  const queryStr = new URLSearchParams({ per_page: '25', sort: 'newest', ...query }).toString()
  const { data, loading, error, reload } = useApi(`/api/admin/requests?${queryStr}`)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleFilter(name, value) {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(name, value)
    else params.delete(name)
    params.set('page', '1')
    setSearchParams(params)
  }

  async function handleQuickUpdate(endpoint, body, successMsg) {
    setSubmitting(true)
    try {
      await apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
      toast.success(successMsg)
      reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('क्या आप इस अनुरोध को हटाना चाहते हैं?')) return
    try {
      await apiRequest(`/api/admin/requests/${id}`, { method: 'DELETE' })
      toast.success('अनुरोध हटाया गया')
      reload()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900">अनुरोध</h1>
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input
          className="input"
          placeholder="खोजें..."
          value={query.search || ''}
          onChange={(e) => handleFilter('search', e.target.value)}
        />
        <select className="input" value={query.status || ''} onChange={(e) => handleFilter('status', e.target.value)}>
          <option value="">स्थिति</option>
          {REQUEST_STATUSES.map((status) => <option key={status} value={status}>{optionLabel(status)}</option>)}
        </select>
        <select className="input" value={query.severity || ''} onChange={(e) => handleFilter('severity', e.target.value)}>
          <option value="">गंभीरता</option>
          {SEVERITIES.map((severity) => <option key={severity} value={severity}>{optionLabel(severity)}</option>)}
        </select>
        <select className="input" value={query.category || ''} onChange={(e) => handleFilter('category', e.target.value)}>
          <option value="">श्रेणी</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{optionLabel(category)}</option>)}
        </select>
        <input className="input" placeholder="क्षेत्र" value={query.area_id || ''} onChange={(e) => handleFilter('area_id', e.target.value)} />
        <input className="input" placeholder="गांव / वार्ड" value={query.village_id || ''} onChange={(e) => handleFilter('village_id', e.target.value)} />
        <input className="input" placeholder="कार्यकर्ता" value={query.assigned_worker || ''} onChange={(e) => handleFilter('assigned_worker', e.target.value)} />
        <select className="input" value={query.sort || 'newest'} onChange={(e) => handleFilter('sort', e.target.value)}>
          <option value="newest">नवीनतम</option>
          <option value="oldest">पुराना</option>
          <option value="severity">गंभीरता</option>
          <option value="status">स्थिति</option>
          <option value="area">क्षेत्र</option>
          <option value="assigned_worker">कार्यकर्ता</option>
        </select>
      </div>

      {loading && <TableSkeleton columns={11} />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (!data?.data || data.data.length === 0) && <EmptyState message="कोई अनुरोध नहीं मिला" />}

      {!loading && !error && data?.data?.length > 0 && (
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                {['आईडी', 'नाम', 'फोन', 'क्षेत्र', 'गांव/वार्ड', 'श्रेणी', 'गंभीरता', 'स्थिति', 'कार्यकर्ता', 'दिनांक', 'क्रियाएं'].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((req) => (
                <tr key={req.id} className="border-t hover:bg-orange-50/40">
                  <td className="px-3 py-3">{req.id}</td>
                  <td className="px-3 py-3 font-medium">{req.name}</td>
                  <td className="px-3 py-3">{req.phone_number}</td>
                  <td className="px-3 py-3">{req.area}</td>
                  <td className="px-3 py-3">{req.village_or_ward}</td>
                  <td className="px-3 py-3">{humanizeEnum(req.category)}</td>
                  <td className="px-3 py-3"><SeverityBadge value={req.severity} /></td>
                  <td className="px-3 py-3"><StatusBadge value={req.status} /></td>
                  <td className="px-3 py-3">{req.assigned_to_user?.name || req.assigned_to || '-'}</td>
                  <td className="px-3 py-3">{new Date(req.created_at).toLocaleDateString('hi-IN')}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/requests/${req.id}`} className="font-bold text-emerald-700 hover:underline">देखें</Link>
                      <button className="font-bold text-orange-600 hover:underline" onClick={() => setEditing(req)}>संपादित करें</button>
                      <button className="font-bold text-red-600 hover:underline" onClick={() => handleDelete(req.id)}>हटाएं</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination meta={data?.meta} searchParams={searchParams} setSearchParams={setSearchParams} />
        </div>
      )}

      {editing && (
        <EditRequestModal
          request={editing}
          submitting={submitting}
          onClose={() => setEditing(null)}
          onSave={async (formData) => {
            await handleQuickUpdate(`/api/admin/requests/${editing.id}`, { public_request: formData }, 'अनुरोध अपडेट हुआ')
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

function EditRequestModal({ request, onSave, onClose, submitting }) {
  const [form, setForm] = useState(request)

  function update(field, value) {
    if (field === 'phone_number') value = digitsOnly(value).slice(0, 10)
    if (field === 'name') value = nameOnly(value)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4">
      <form
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-5 shadow-xl"
        onSubmit={(e) => { e.preventDefault(); onSave(form) }}
      >
        <h2 className="text-xl font-black">अनुरोध संपादित करें</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {['request_title', 'name', 'phone_number', 'area', 'village_or_ward', 'assigned_to', 'expected_resolution_date'].map((field) => (
            <label key={field}>
              <span className="label">{FIELD_LABELS[field]}</span>
              <input className="input" value={form[field] || ''} onChange={(e) => update(field, e.target.value)} />
            </label>
          ))}
          <label>
            <span className="label">श्रेणी</span>
            <select className="input" value={form.category || ''} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((category) => <option key={category} value={category}>{optionLabel(category)}</option>)}
            </select>
          </label>
          <label>
            <span className="label">गंभीरता</span>
            <select className="input" value={form.severity || ''} onChange={(e) => update('severity', e.target.value)}>
              {SEVERITIES.map((severity) => <option key={severity} value={severity}>{optionLabel(severity)}</option>)}
            </select>
          </label>
          <label>
            <span className="label">स्थिति</span>
            <select className="input" value={form.status || ''} onChange={(e) => update('status', e.target.value)}>
              {REQUEST_STATUSES.map((status) => <option key={status} value={status}>{optionLabel(status)}</option>)}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="label">विवरण</span>
            <textarea className="input min-h-24" value={form.description || ''} onChange={(e) => update('description', e.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="label">आंतरिक नोट्स</span>
            <textarea className="input min-h-20" value={form.internal_notes || ''} onChange={(e) => update('internal_notes', e.target.value)} />
          </label>
          <label className="md:col-span-2">
            <span className="label">सार्वजनिक प्रतिक्रिया</span>
            <textarea className="input min-h-20" value={form.public_response || ''} onChange={(e) => update('public_response', e.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md bg-slate-100 px-4 py-2 font-bold">रद्द करें</button>
          <button type="submit" disabled={submitting} className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50">
            {submitting ? 'सेव हो रहा...' : 'सेव करें'}
          </button>
        </div>
      </form>
    </div>
  )
}
