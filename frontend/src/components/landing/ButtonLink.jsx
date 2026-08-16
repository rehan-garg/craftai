import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const variants = {
  primary: cn(
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5',
    'bg-orange-500 text-sm font-semibold text-white',
    'shadow-md transition-all duration-200',
    'hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg',
    'active:translate-y-0 active:shadow-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
  ),
  secondary: cn(
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5',
    'border border-amber-200 bg-amber-100 text-sm font-semibold text-slate-900',
    'shadow-sm transition-all duration-200',
    'hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md',
    'active:translate-y-0 active:shadow-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
  ),
};

function ButtonLink({ to, href, children, variant = 'primary', className, ...props }) {
  const classes = cn(variants[variant], className);

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={classes} {...props}>
      {children}
    </Link>
  );
}

export default ButtonLink;
