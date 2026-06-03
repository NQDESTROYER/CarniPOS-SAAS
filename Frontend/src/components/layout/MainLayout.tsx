import { Sidebar } from '../layout/Sidebar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Header Placeholder if needed */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
