import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type ButtonVariant = 'primary' | 'ghost'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90',
  ghost: 'bg-transparent border border-border text-text hover:bg-surface',
}

const baseClasses =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary'

type CommonProps = {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
}

type ButtonAsLink = CommonProps & {
  href: string
  openInNewTab?: boolean
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children' | 'className' | 'openInNewTab'
>

type ButtonAsButton = CommonProps & {
  href?: undefined
  openInNewTab?: never
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>

export type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button({
  variant = 'primary',
  href,
  openInNewTab = true,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]}${className ? ` ${className}` : ''}`

  if (href) {
    const anchorProps = props as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'children' | 'className' | 'openInNewTab'
    >
    return (
      <a
        href={href}
        className={classes}
        {...(openInNewTab
          ? { rel: 'noopener noreferrer', target: '_blank' }
          : {})}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  const buttonProps = props as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className'
  >
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
