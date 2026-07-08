import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ICONS = {
  dashboard: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z',
  categories: 'M4 6h16M4 12h16M4 18h7',
  assets: 'M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7',
  requests: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  damage: 'M12 9v3.75m0 3.75h.008M4.98 19h14.04c1.53 0 2.49-1.66 1.73-2.99L13.73 4.99c-.77-1.33-2.7-1.33-3.46 0L3.25 16.01C2.5 17.34 3.46 19 4.98 19z',
  users: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4',
  reports: 'M9 17V9m4 8V5m4 12v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z',
};

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super-admin' || user?.role === 'inventory-manager';

  const employeeLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
    { to: '/my-requests', label: 'My Requests', icon: ICONS.requests },
    { to: '/damage-reports', label: 'Damage Reports', icon: ICONS.damage },
  ];

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: ICONS.dashboard },
    { to: '/categories', label: 'Categories', icon: ICONS.categories },
    { to: '/assets', label: 'Assets', icon: ICONS.assets },
    { to: '/requests', label: 'Requests', icon: ICONS.requests },
    { to: '/damage-reports', label: 'Damage Reports', icon: ICONS.damage },
    { to: '/reports', label: 'Reports', icon: ICONS.reports },
    { to: '/users', label: 'Users', icon: ICONS.users },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <aside className="w-64 shrink-0 bg-[#10182B] text-[#EDEEF0] min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="h-8 w-8 rounded-[6px] bg-[#C99A4B] flex items-center justify-center">
          <span className="font-mono text-[13px] font-bold text-[#10182B]">A</span>
        </div>
        <span className="text-sm font-medium tracking-wide text-[#8891A3]">
          INVENTORY
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition ${
                isActive
                  ? 'bg-[#1B2540] text-[#EDEEF0] border-l-2 border-[#C99A4B]'
                  : 'text-[#8891A3] hover:bg-[#1B2540]/60 hover:text-[#EDEEF0]'
              }`
            }
          >
            <Icon path={link.icon} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-5 border-t border-[#2A3547]">
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <p className="text-xs text-[#8891A3] capitalize">{user?.role?.replace('-', ' ')}</p>
      </div>
    </aside>
  );
}