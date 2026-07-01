import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const maxWidth = {
  sm: 'max-w-2xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
}

export function PageShell({ children, size = 'lg', className = '' }: PageShellProps) {
  return (
    <div
      className={`mx-auto w-full min-w-0 ${maxWidth[size]} box-border px-4 py-5 sm:px-6 sm:py-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  )
}
