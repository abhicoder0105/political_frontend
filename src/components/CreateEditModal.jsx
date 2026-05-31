import { useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl, isValidImageFile } from '../lib/images'
import { digitsOnly, nameOnly } from '../utils/forms'
import { optionLabel as defaultOptionLabel } from '../utils/enums'
import FormField from './ui/FormField'
import Button from './ui/Button'

export default function CreateEditModal({ title, formFields, initial, onSave, onClose, submitting, optionLabel = defaultOptionLabel }) {
  const [form, setForm] = useState(initial || {})

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function nextValue(field, value) {
    if (field.type === 'tel' || field.name.includes('phone') || field.name.includes('mobile')) return digitsOnly(value, 10)
    if (field.name === 'name' || field.name === 'full_name') return nameOnly(value)
    return value
  }

  function handleImage(field, file) {
    if (!file) return
    if (!isValidImageFile(file)) {
      toast.error('कृपया वैध इमेज फाइल चुनें')
      return
    }
    update('uploaded_image', file)
    update(field.name, URL.createObjectURL(file))
  }

  function fieldSpan(field) {
    return field.type === 'textarea' || field.type === 'image' || field.name === 'description' || field.name === 'content' || field.name === 'remarks'
      ? 'md:col-span-2'
      : ''
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-lg bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="section-eyebrow">रिकॉर्ड</p>
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="बंद करें">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          {formFields.map((field) => {
            if (field.type === 'select') {
              return (
                <FormField key={field.name} label={field.label} required={field.required} className={fieldSpan(field)}>
                  <select value={form[field.name] || ''} onChange={(e) => update(field.name, e.target.value)} className="input">
                    <option value="">चुनें</option>
                    {field.options?.map((opt) => <option key={opt} value={opt}>{optionLabel(opt)}</option>)}
                  </select>
                </FormField>
              )
            }

            if (field.type === 'textarea') {
              return (
                <FormField key={field.name} label={field.label} required={field.required} className="md:col-span-2">
                  <textarea className="input min-h-28" value={form[field.name] || ''} onChange={(e) => update(field.name, e.target.value)} />
                </FormField>
              )
            }

            if (field.type === 'image') {
              return (
                <FormField key={field.name} label={field.label} className="md:col-span-2" helper="PNG, JPG, WEBP या GIF">
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                    {(form[field.name] || form.image_url) && (
                      <img src={getImageUrl(form[field.name] || form.image_url, 'thumbnail')} alt="" className="mb-3 h-28 w-44 rounded-lg object-cover ring-1 ring-slate-200" />
                    )}
                    <label className="btn-secondary cursor-pointer">
                      <ImagePlus size={16} />
                      इमेज चुनें
                      <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" className="hidden" onChange={(e) => handleImage(field, e.target.files?.[0])} />
                    </label>
                  </div>
                </FormField>
              )
            }

            return (
              <FormField key={field.name} label={field.label} required={field.required} className={fieldSpan(field)}>
                <input
                  type={field.type || 'text'}
                  className="input"
                  value={form[field.name] || ''}
                  onChange={(e) => update(field.name, nextValue(field, e.target.value))}
                />
              </FormField>
            )
          })}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
          <Button type="button" onClick={onClose} variant="secondary">रद्द करें</Button>
          <Button type="submit" disabled={submitting}>{submitting ? 'सेव हो रहा...' : 'सेव करें'}</Button>
        </div>
      </form>
    </div>
  )
}
