import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { createUser, updateUser } from '../../api/endpoints/users';

const EMPTY_FORM = { name: '', email: '', password: '', role_id: '' };

/**
 * Props:
 * - user: existing user object (edit mode) or null (create mode)
 * - onClose: called when modal should close without saving
 * - onSaved: called after a successful create/update
 */
export default function UserFormModal({ user, onClose, onSaved }) {
  const isEditMode = Boolean(user);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axiosClient.get('/admin/roles').then((res) => setRoles(res.data));
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        role_id: roles.find((r) => r.slug === user.role)?.id ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [user, roles]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError('');
    setIsSubmitting(true);

    const payload = { ...form };
    if (isEditMode && !payload.password) {
      delete payload.password; // don't send an empty password on update
    }

    try {
      const response = isEditMode
        ? await updateUser(user.id, payload)
        : await createUser(payload);
      onSaved(response.data);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setFormError('Please fix the highlighted fields.');
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
          <h2 className="font-[Space_Grotesk] text-lg font-medium text-[#10182B]">
            {isEditMode ? 'Edit User' : 'Add User'}
          </h2>
          <button onClick={onClose} className="text-[#8891A3] hover:text-[#10182B] text-xl leading-none" aria-label="Close">
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
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            />
            {errors.name && <p className="mt-1 text-sm text-[#B23B1E]">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            />
            {errors.email && <p className="mt-1 text-sm text-[#B23B1E]">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">
              Password {isEditMode && <span className="text-[#8891A3] font-normal">(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            />
            {errors.password && <p className="mt-1 text-sm text-[#B23B1E]">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Role</label>
            <select
              value={form.role_id}
              onChange={(e) => handleChange('role_id', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            >
              <option value="">Select a role…</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.role_id && <p className="mt-1 text-sm text-[#B23B1E]">{errors.role_id[0]}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-[8px] text-sm font-medium text-[#5B6472] hover:bg-[#EDEEF0] transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}