import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, PieChart, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../../store/slices/userSlice';

const SidebarItem = ({ icon: Icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
        isActive
          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
};
import { Logo } from '../ui/Logo';
import AddExpenseModal from '../modals/AddExpenseModal';
import TamboChat from '../tambo/TamboChat';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="mb-10 px-2">
          <Logo />
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/app" end />
          <SidebarItem icon={CreditCard} label="Expenses" to="/app/expenses" />
          <SidebarItem icon={Users} label="Groups" to="/app/groups" />
          <SidebarItem icon={PieChart} label="Analytics" to="/app/analytics" />
        </nav>

        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3 px-2 mb-4">
            <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center px-4 justify-between">
        <Logo showText={true} className="scale-90 origin-left" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-8">
          <Outlet />
        </div>
      </main>

      <button
        onClick={() => setAddExpenseOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <span className="text-3xl font-light mb-1">+</span>
      </button>

      <AddExpenseModal isOpen={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />

      <TamboChat />

      {/* Mobile Sidebar Overlay (Simplified) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className="bg-white dark:bg-slate-900 w-3/4 h-full p-6" onClick={e => e.stopPropagation()}>
            {/* Repeat Nav */}
            <nav className="space-y-4 pt-10">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/app" end />
              <SidebarItem icon={CreditCard} label="Expenses" to="/app/expenses" />
              <SidebarItem icon={Users} label="Groups" to="/app/groups" />
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
