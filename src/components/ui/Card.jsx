export default function Card({ className = '', children, elevated = false }) {
  return (
    <div className={`${elevated ? 'card-elevated' : 'card'} ${className}`}>
      {children}
    </div>
  )
}
