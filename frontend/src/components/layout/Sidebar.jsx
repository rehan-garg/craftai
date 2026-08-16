import { NavLink, useNavigate } from 'react-router-dom';
import { House, LayoutGrid, Palette, Package, ShoppingBag, BarChart3, UserRound, LogOut, Sparkles } from 'lucide-react';
import { getCurrentUser, logout } from '../../services/authService';

function Sidebar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role?.toLowerCase();

  const items = role === 'seller'
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: House },
        { to: '/product-studio', label: 'Product Studio', icon: Palette },
        { to: '/saved-products', label: 'Saved Products', icon: Package },
        { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/profile', label: 'Profile', icon: UserRound },
      ]
    : [
        { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { to: '/profile', label: 'Profile', icon: UserRound },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="flex h-full flex-col rounded-r-[2rem] border border-stone-200 bg-white shadow-[0_20px_45px_-20px_rgba(120,53,15,0.18)]">
      <div className="border-b border-stone-200/70 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-stone-800">CraftAI</p>
            <p className="text-xs text-stone-500">From Local Hands to Global Brands</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-semibold text-stone-800">{user?.name || 'Guest User'}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${role === 'seller' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {role === 'seller' ? 'Seller' : 'Buyer'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition hover:bg-amber-50 hover:text-amber-700 ${isActive ? 'bg-amber-50 text-amber-700 shadow-sm' : 'text-stone-600'}`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-stone-200/70 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm font-medium text-stone-700 transition hover:border-amber-500 hover:text-amber-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
