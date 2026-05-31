export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }
  const sizes = {
    sm: 'min-h-9 px-3 py-1.5 text-xs',
    md: '',
    lg: 'min-h-12 px-6 py-3 text-base',
  }

  return (
    <Component className={`${variants[variant] || variants.primary} ${sizes[size] || ''} ${className}`} {...props}>
      {children}
    </Component>
  )
}
