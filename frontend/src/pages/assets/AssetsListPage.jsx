import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { fetchAssets, fetchCategories, deleteAsset } from '../../api/endpoints/assets';
import AssetFormModal from './AssetFormModal';
import AssignmentModal from './AssignmentModal';

const STATUS_STYLES = {
  available: 'bg-[#E7F3EC] text-[#2F7A54]',
  assigned: 'bg-[#EAF0FB] text-[#3457A6]',
  reserved: 'bg-[#FBF3E0] text-[#9A6E1F]',
  damaged: 'bg-[#FBEDE6] text-[#B23B1E]',
  scrapped: 'bg-[#EDEEF0] text-[#5B6472]',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || ''}`}>
      {status}
    </span>
  );
}

export default function AssetsListPage() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state: undefined = closed, null = create mode, {...asset} = edit mode
  const [modalAsset, setModalAsset] = useState(undefined);
  // Separate state for the assignment modal — holds the asset being assigned, or null when closed
  const [assigningAsset, setAssigningAsset] = useState(null);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchAssets({
        search: search || undefined,
        status: statusFilter || undefined,
        category_id: categoryFilter || undefined,
      });
      setAssets(response.data.data); // Laravel paginator wraps rows in "data"
    } catch {
      setError('Could not load assets. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadAssets, 300); // debounce search typing
    return () => clearTimeout(timer);
  }, [loadAssets]);

  function handleSaved() {
    setModalAsset(undefined);
    loadAssets();
  }

  function handleAssigned() {
    setAssigningAsset(null);
    loadAssets(); // asset status flips to "assigned" on the backend, refresh to reflect it
  }

  async function handleDelete(asset) {
    if (!window.confirm(`Delete "${asset.name}"? This cannot be undone.`)) return;

    try {
      await deleteAsset(asset.id);
      loadAssets();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this asset.');
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Inventory</p>
              <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
                Assets
              </h1>
            </div>
            <button
              onClick={() => setModalAsset(null)}
              className="rounded-[8px] bg-[#10182B] text-[#EDEEF0] px-4 py-2.5 text-sm font-medium hover:bg-[#1B2540] transition"
            >
              + Add Asset
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name or serial number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[220px] rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-sm text-[#10182B] outline-none focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 transition"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-sm text-[#10182B] outline-none focus:border-[#C99A4B]"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-sm text-[#10182B] outline-none focus:border-[#C99A4B]"
            >
              <option value="">All statuses</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="reserved">Reserved</option>
              <option value="damaged">Damaged</option>
              <option value="scrapped">Scrapped</option>
            </select>
          </div>

          <section className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] overflow-hidden">
            {error && (
              <div className="px-5 py-3 text-sm text-[#B23B1E] bg-[#FBEDE6] border-b border-[#E4B8A0]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">Loading…</div>
            ) : assets.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No assets found</p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Try adjusting your search or filters, or add a new asset to get started.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Serial No.</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-[#E2E4E8] last:border-0 hover:bg-[#EDEEF0]/50">
                      <td className="px-5 py-3 text-[#10182B]">{asset.name}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{asset.category?.name}</td>
                      <td className="px-5 py-3 font-mono text-[#5B6472]">{asset.serial_number}</td>
                      <td className="px-5 py-3"><StatusBadge status={asset.status} /></td>
                      <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                        {asset.status === 'available' && (
                          <button
                            onClick={() => setAssigningAsset(asset)}
                            className="text-[#2F7A54] hover:underline text-sm"
                          >
                            Assign
                          </button>
                        )}
                        <button
                          onClick={() => setModalAsset(asset)}
                          className="text-[#3457A6] hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(asset)}
                          className="text-[#B23B1E] hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </main>

      {modalAsset !== undefined && (
        <AssetFormModal
          asset={modalAsset}
          categories={categories}
          onClose={() => setModalAsset(undefined)}
          onSaved={handleSaved}
        />
      )}

      {assigningAsset && (
        <AssignmentModal
          asset={assigningAsset}
          onClose={() => setAssigningAsset(null)}
          onSaved={handleAssigned}
        />
      )}
    </div>
  );
}