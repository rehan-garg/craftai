import { cn } from '../../utils/cn';

function Container({ children, className, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
