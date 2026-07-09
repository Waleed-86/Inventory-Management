import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { fetchRequisitions, createRequisition } from '../../api/endpoints/requisitions';

const STATUS_STYLES = {
  pending: 'bg-[#FBF3E0] text-[#9A6E1F]',
  approved: 'bg-[#E7F3EC] text-[#2F7A54]',
  rejected: 'bg-[#FBEDE6] text-[#B23B1E]',
  dispatched: 'bg-[#EAF0FB] text-[#3457A6]',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] || ''}`}>
      {status}
    </span>
  );
}

export default function MyRequestsPage() {
  const [requisitions, setRequisitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justification, setJustification] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequisitions = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchRequisitions();
      setRequisitions(response.data.data);
    } catch {
      setError('Could not load your requests. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequisitions();
  }, [loadRequisitions]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErrors({});
    setFormError('');
    setIsSubmitting(true);

    try {
      await createRequisition({ quantity, justification });
      setQuantity(1);
      setJustification('');
      setShowForm(false);
      loadRequisitions();
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

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Requests</p>
              <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
                My Requests
              </h1>
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="rounded-[8px] bg-[#10182B] text-[#EDEEF0] px-4 py-2.5 text-sm font-medium hover:bg-[#1B2540] transition"
            >
              {showForm ? 'Cancel' : '+ New Request'}
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
                <label className="block text-sm font-medium text-[#10182B] mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-32 rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
                />
                {formErrors.quantity && <p className="mt-1 text-sm text-[#B23B1E]">{formErrors.quantity[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#10182B] mb-1.5">Justification</label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={3}
                  placeholder="Why do you need this asset?"
                  className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none resize-none"
                />
                {formErrors.justification && <p className="mt-1 text-sm text-[#B23B1E]">{formErrors.justification[0]}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Request'}
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
            ) : requisitions.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No requests yet</p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Submit a request above when you need a new asset.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Justification</th>
                    <th className="px-5 py-3 font-medium">Qty</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitions.map((req) => (
                    <tr key={req.id} className="border-b border-[#E2E4E8] last:border-0">
                      <td className="px-5 py-3 text-[#10182B] max-w-xs truncate">{req.justification}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{req.quantity}</td>
                      <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                      <td className="px-5 py-3 text-[#5B6472]">
                        {new Date(req.created_at).toLocaleDateString()}
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