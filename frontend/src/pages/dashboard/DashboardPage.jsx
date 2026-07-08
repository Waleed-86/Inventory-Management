import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';

function StatCard({ label, value, accent = false }) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E2E4E8] px-5 py-4">
      <p className="text-[13px] text-[#5B6472]">{label}</p>
      <p
        className={`mt-1.5 text-2xl font-[Space_Grotesk] font-medium ${
          accent ? 'text-[#C99A4B]' : 'text-[#10182B]'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="h-12 w-12 rounded-full bg-[#EDEEF0] flex items-center justify-center mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-[#8891A3]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h8m6-6l-3-3m0 0l-3 3m3-3v9" />
        </svg>
      </div>
      <p className="text-[15px] font-medium text-[#10182B]">{title}</p>
      <p className="mt-1 text-sm text-[#5B6472] max-w-xs">{description}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Placeholder: once the Asset Assignment API exists, this will fetch
    // GET /api/my-assignments. For now we simulate the "no data yet" state
    // so the empty state is visible and honest rather than showing fake rows.
    const timer = setTimeout(() => {
      setAssignedAssets([]);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const isAdmin = user?.role === 'super-admin' || user?.role === 'inventory-manager';

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-5xl">
          <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Dashboard</p>
          <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Assigned to me" value={assignedAssets.length} />
            <StatCard label="Pending requests" value="0" />
            <StatCard label="Open damage reports" value="0" />
            {isAdmin && <StatCard label="Total assets" value="—" accent />}
          </div>

          <section className="mt-8 bg-white rounded-[10px] border border-[#E2E4E8]">
            <div className="px-5 py-4 border-b border-[#E2E4E8] flex items-center justify-between">
              <h2 className="text-[15px] font-medium text-[#10182B]">My assigned assets</h2>
            </div>

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">Loading…</div>
            ) : assignedAssets.length === 0 ? (
              <EmptyState
                title="No assets assigned yet"
                description="Assets assigned to you by an administrator will show up here, along with their condition and assignment date."
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Asset</th>
                    <th className="px-5 py-3 font-medium">Serial No.</th>
                    <th className="px-5 py-3 font-medium">Condition</th>
                    <th className="px-5 py-3 font-medium">Assigned On</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-[#E2E4E8] last:border-0">
                      <td className="px-5 py-3 text-[#10182B]">{asset.name}</td>
                      <td className="px-5 py-3 font-mono text-[#5B6472]">{asset.serial_number}</td>
                      <td className="px-5 py-3 text-[#5B6472] capitalize">{asset.status}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{asset.assigned_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}