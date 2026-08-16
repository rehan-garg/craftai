import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-stone-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <Sidebar />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
