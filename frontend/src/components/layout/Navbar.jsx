import { Bell, CircleUserRound } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';

function Navbar() {
  const location = useLocation();
  const user = getCurrentUser();

  const pageTitle = location.pathname
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' '))
    .join(' / ') || 'Home';

  return (
    <header className="border-b border-stone-200/80 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">CraftAI</p>
          <h2 className="mt-1 text-xl font-semibold capitalize text-stone-800">{pageTitle}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-full border border-stone-200 bg-stone-50 p-2.5 text-stone-600 transition hover:border-amber-500 hover:text-amber-700">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-stone-800">{user?.name || 'Guest User'}</p>
              <p className="text-xs text-stone-500">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
