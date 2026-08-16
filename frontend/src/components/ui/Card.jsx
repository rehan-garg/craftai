import { cn } from '../../utils/cn';

function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-amber-200 bg-white p-6 shadow-lg',
        'transition-shadow duration-200 hover:shadow-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
