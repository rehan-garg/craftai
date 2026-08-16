import { cn } from '../../utils/cn';

function SecondaryButton({
  children,
  className,
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5',
        'border border-amber-200 bg-amber-100 text-sm font-semibold text-slate-900',
        'shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md',
        'active:translate-y-0 active:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
        'disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
