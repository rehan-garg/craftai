import { cn } from '../../utils/cn';

function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className,
}) {
  return (
    <div
      className={cn(
        'space-y-2',
        align === 'center' && 'text-center',
        className,
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base text-slate-600 sm:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
