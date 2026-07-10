import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { fetchAuditLogs } from '../../api/endpoints/auditLogs';

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [actionFilter, setActionFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchAuditLogs({ action: actionFilter || undefined });
      setLogs(response.data.data);
    } catch {
      setError('Could not load audit logs. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter]);

  useEffect(() => {
    const timer = setTimeout(loadLogs, 300);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-5xl">
          <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Administration</p>
          <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
            Audit Log
          </h1>
          <p className="mt-2 text-sm text-[#5B6472]">
            A read-only, immutable record of every significant action taken in the system.
          </p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Filter by action (e.g. asset, user.login)…"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-80 rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-sm text-[#10182B] outline-none focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 transition"
            />
          </div>

          <section className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] overflow-hidden">
            {error && (
              <div className="px-5 py-3 text-sm text-[#B23B1E] bg-[#FBEDE6] border-b border-[#E4B8A0]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">Loading…</div>
            ) : logs.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No log entries found</p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Actions like logins, asset changes, and approvals will appear here as they happen.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Action</th>
                    <th className="px-5 py-3 font-medium">Performed By</th>
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">IP Address</th>
                    <th className="px-5 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[#E2E4E8] last:border-0">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs bg-[#EDEEF0] text-[#10182B] px-2 py-1 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#5B6472]">{log.user_name || '—'}</td>
                      <td className="px-5 py-3 text-[#5B6472]">
                        {log.subject_type ? `${log.subject_type.split('\\').pop()} #${log.subject_id}` : '—'}
                      </td>
                      <td className="px-5 py-3 text-[#5B6472] font-mono text-xs">{log.ip_address || '—'}</td>
                      <td className="px-5 py-3 text-[#5B6472]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
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