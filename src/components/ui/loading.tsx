interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Loading({ size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-32 w-32', 
    lg: 'h-48 w-48'
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-white via-orange-50 to-orange-100 flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-orange-500 ${sizeClasses[size]}`}></div>
    </div>
  )
} 