import { useState } from 'react'

export default function CreateEditModal({ title, formFields, initial, onSave, onClose, submitting }) {
  const [form, setForm] = useState(initial || {})

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-5 shadow-xl"
      >
        <h2 className="text-xl font-black">{title}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {formFields.map((field) => {
            if (field.type === 'select') {
              return (
                <label key={field.name} className={field.name === 'description' || field.name === 'content' || field.name === 'remarks' ? 'md:col-span-2' : ''}>
                  <span className="label">{field.label}</span>
                  <select
                    value={form[field.name] || ''}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="input"
                  >
                    <option value="">चुनें</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              )
            }
            if (field.type === 'textarea') {
              return (
                <label key={field.name} className="md:col-span-2">
                  <span className="label">{field.label}</span>
                  <textarea
                    className="input min-h-24"
                    value={form[field.name] || ''}
                    onChange={(e) => update(field.name, e.target.value)}
                  />
                </label>
              )
            }
            if (field.type === 'image') {
              return (
                <label key={field.name} className="md:col-span-2">
                  <span className="label">{field.label}</span>
                  {form[field.name] && (
                    <img src={form[field.name]} alt="" className="mb-2 h-20 w-32 rounded object-cover" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="input"
                    onChange={(e) => update('uploaded_image', e.target.files[0])}
                  />
                </label>
              )
            }
            return (
              <label key={field.name}>
                <span className="label">{field.label}</span>
                <input
                  type={field.type || 'text'}
                  className="input"
                  value={form[field.name] || ''}
                  onChange={(e) => update(field.name, e.target.value)}
                />
              </label>
            )
          })}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md bg-slate-100 px-4 py-2 font-bold">
            रद्द करें
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50"
          >
            {submitting ? 'सेव हो रहा...' : 'सेव करें'}
          </button>
        </div>
      </form>
    </div>
  )
}
