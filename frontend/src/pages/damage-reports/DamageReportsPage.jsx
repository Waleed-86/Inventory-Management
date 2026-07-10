import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { fetchDamageReports, createDamageReport, updateDamageReportStatus } from '../../api/endpoints/damageReports';
import { fetchAssets } from '../../api/endpoints/assets';

const STATUS_STYLES = {
  pending_review: 'bg-[#FBF3E0] text-[#9A6E1F]',
  in_repair: 'bg-[#EAF0FB] text-[#3457A6]',
  repaired: 'bg-[#E7F3EC] text-[#2F7A54]',
  replaced: 'bg-[#EDEEF0] text-[#5B6472]',
  scrapped: 'bg-[#FBEDE6] text-[#B23B1E]',
};

// Only these transitions are allowed from each current status —
// mirrors the backend's lifecycle (pending_review -> in_repair -> repaired/replaced/scrapped).
const NEXT_ACTIONS = {
  pending_review: [{ status: 'in_repair', label: 'Send to Repair' }],
  in_repair: [
    { status: 'repaired', label: 'Mark Repaired' },
    { status: 'replaced', label: 'Mark Replaced' },
    { status: 'scrapped', label: 'Scrap Asset' },
  ],
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || ''}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export default function DamageReportsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'super-admin' || user?.role === 'inventory-manager';

  const [reports, setReports] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchDamageReports();
      setReports(response.data.data);
    } catch {
      setError('Could not load damage reports. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
    fetchAssets({ per_page: 100 })
      .then((res) => setAssets(res.data.data))
      .catch(() => {});
  }, [loadReports]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors({});
    setFormError('');
    setIsSubmitting(true);

    try {
      await createDamageReport({ asset_id: assetId, description, image });
      setAssetId('');
      setDescription('');
      setImage(null);
      setShowForm(false);
      loadReports();
    } catch (err) {
      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors || {});
        setFormError('Please fix the highlighted fields.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(report, newStatus) {
    setActioningId(report.id);
    try {
      await updateDamageReportStatus(report.id, newStatus);
      loadReports();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update this report.');
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Assets</p>
              <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
                Damage Reports
              </h1>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-[8px] bg-[#10182B] text-[#EDEEF0] px-4 py-2.5 text-sm font-medium hover:bg-[#1B2540] transition"
            >
              {showForm ? 'Cancel' : '+ Report Damage'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] p-5 space-y-4">
              {formError && (
                <div role="alert" className="rounded-[8px] bg-[#FBEDE6] border border-[#E4B8A0] px-3.5 py-2.5 text-sm text-[#8A3E1F]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#10182B] mb-1.5">Asset</label>
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
                >
                  <option value="">Select the damaged asset…</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serial_number})</option>
                  ))}
                </select>
                {formErrors.asset_id && <p className="mt-1 text-sm text-[#B23B1E]">{formErrors.asset_id[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#10182B] mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe what happened and the extent of the damage…"
                  className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none resize-none"
                />
                {formErrors.description && <p className="mt-1 text-sm text-[#B23B1E]">{formErrors.description[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#10182B] mb-1.5">Photo (optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-[#5B6472] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#EDEEF0] file:px-3 file:py-2 file:text-sm file:text-[#10182B]"
                />
                <p className="mt-1 text-xs text-[#8891A3]">JPG, PNG, or WEBP. Max 5MB.</p>
                {formErrors.image && <p className="mt-1 text-sm text-[#B23B1E]">{formErrors.image[0]}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}

          <section className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] overflow-hidden">
            {error && (
              <div className="px-5 py-3 text-sm text-[#B23B1E] bg-[#FBEDE6] border-b border-[#E4B8A0]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">Loading…</div>
            ) : reports.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No damage reports yet</p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Report a damaged asset above and it will show up here.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Asset</th>
                    {isAdmin && <th className="px-5 py-3 font-medium">Reported By</th>}
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Reported</th>
                    {isAdmin && <th className="px-5 py-3 font-medium"></th>}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-[#E2E4E8] last:border-0">
                      <td className="px-5 py-3 text-[#10182B]">{r.asset?.name}</td>
                      {isAdmin && <td className="px-5 py-3 text-[#5B6472]">{r.user?.name}</td>}
                      <td className="px-5 py-3 text-[#5B6472] max-w-xs truncate">{r.description}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3 text-[#5B6472]">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                          {(NEXT_ACTIONS[r.status] || []).map((action) => (
                            <button
                              key={action.status}
                              disabled={actioningId === r.id}
                              onClick={() => handleStatusChange(r, action.status)}
                              className="text-[#3457A6] hover:underline text-sm disabled:opacity-50"
                            >
                              {action.label}
                            </button>
                          ))}
                        </td>
                      )}
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