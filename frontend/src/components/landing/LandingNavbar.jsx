import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import ButtonLink from './ButtonLink';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Marketplace', href: '/marketplace' },
];

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900">CraftAI</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
              >
                {link.label}
              </Link>
            )
          ))}
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
          >
            Login
          </Link>
          <ButtonLink to="/signup">Get Started</ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-slate-900 transition-colors hover:bg-amber-100 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={cn(
          'overflow-hidden border-t border-amber-200 bg-amber-50 transition-all duration-300 md:hidden',
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            link.href.startsWith('#') ? (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-slate-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          ))}
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <ButtonLink to="/signup" className="w-full text-center">
            Get Started
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;
