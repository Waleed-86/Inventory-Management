import { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../api/endpoints/categories';

const EMPTY_FORM = { name: '', description: '' };

/**
 * Props:
 * - category: existing category object (edit mode) or null (create mode)
 * - onClose: called when the modal should close without saving
 * - onSaved: called with the saved category after a successful create/update
 */
export default function CategoryFormModal({ category, onClose, onSaved }) {
  const isEditMode = Boolean(category);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name ?? '',
        description: category.description ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [category]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError('');
    setIsSubmitting(true);

    try {
      const response = isEditMode
        ? await updateCategory(category.id, form)
        : await createCategory(form);

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
            {isEditMode ? 'Edit Category' : 'Add Category'}
          </h2>
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
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              placeholder="e.g. Electronics"
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-[#B23B1E]">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none resize-none"
            />
            {errors.description && <p className="mt-1 text-sm text-[#B23B1E]">{errors.description[0]}</p>}
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
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-[8px] text-sm font-medium bg-[#10182B] text-[#EDEEF0] hover:bg-[#1B2540] disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}