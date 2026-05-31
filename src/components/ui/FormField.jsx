export default function FormField({ label, error, helper, required, children, className = '' }) {
  return (
    <label className={className}>
      <span className="label">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
      {error ? <p className="field-error">{error}</p> : helper ? <p className="helper-text">{helper}</p> : null}
    </label>
  )
}
