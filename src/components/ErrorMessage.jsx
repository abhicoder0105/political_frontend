export default function ErrorMessage({ message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
      <p className="text-sm font-bold text-red-700">{message || 'कोई त्रुटि हुई'}</p>
    </div>
  )
}
