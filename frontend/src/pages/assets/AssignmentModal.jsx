import { useState, useEffect } from 'react';
import { fetchUsers, createAssignment } from '../../api/endpoints/assignments';

/**
 * Props:
 * - asset: the asset being assigned (must be status 'available')
 * - onClose: called when modal should close without saving
 * - onSaved: called after a successful assignment
 */
export default function AssignmentModal({ asset, onClose, onSaved }) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().slice(0, 10) // defaults to today
  );
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setFormError('Could not load user list.'));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError('');
    setIsSubmitting(true);

    try {
      const response = await createAssignment({
        asset_id: asset.id,
        user_id: userId,
        assigned_date: assignedDate,
        notes: notes || undefined,
      });
      onSaved(response.data);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setFormError('Please fix the highlighted fields.');
      } else if (err.response?.status === 409) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[12px] w-full max-w-md">
        <div className="px-6 py-4 border-b border-[#E2E4E8] flex items-center justify-between">
          <div>
            <h2 className="font-[Space_Grotesk] text-lg font-medium text-[#10182B]">
              Assign Asset
            </h2>
            <p className="text-sm text-[#5B6472] mt-0.5">{asset.name} · {asset.serial_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#8891A3] hover:text-[#10182B] text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {formError && (
            <div role="alert" className="rounded-[8px] bg-[#FBEDE6] border border-[#E4B8A0] px-3.5 py-2.5 text-sm text-[#8A3E1F]">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Assign to</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            >
              <option value="">Select a user…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            {errors.user_id && <p className="mt-1 text-sm text-[#B23B1E]">{errors.user_id[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Assigned Date</label>
            <input
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            />
            {errors.assigned_date && <p className="mt-1 text-sm text-[#B23B1E]">{errors.assigned_date[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[8px] text-sm font-medium text-[#5B6472] hover:bg-[#EDEEF0] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !userId}
              className="px-4 py-2.5 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Assigning…' : 'Assign Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}