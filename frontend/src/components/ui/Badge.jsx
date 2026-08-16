import { cn } from '../../utils/cn';

const variants = {
  amber: 'bg-amber-100 text-orange-600 ring-amber-200',
  orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  brown: 'bg-amber-100 text-slate-900 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
};

function Badge({ children, variant = 'amber', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        'transition-colors duration-200',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
