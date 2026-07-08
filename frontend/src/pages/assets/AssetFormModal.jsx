import { useState, useEffect } from 'react';
import { createAsset, updateAsset } from '../../api/endpoints/assets';

const EMPTY_FORM = {
  category_id: '',
  name: '',
  serial_number: '',
  barcode: '',
  model: '',
  purchase_date: '',
  purchase_cost: '',
  vendor: '',
  warranty_expiry: '',
};

/**
 * Props:
 * - asset: existing asset object (edit mode) or null (create mode)
 * - categories: array of { id, name } for the dropdown
 * - onClose: called when the modal should close without saving
 * - onSaved: called with the saved asset after a successful create/update
 */
export default function AssetFormModal({ asset, categories, onClose, onSaved }) {
  const isEditMode = Boolean(asset);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (asset) {
      setForm({
        category_id: asset.category_id ?? '',
        name: asset.name ?? '',
        serial_number: asset.serial_number ?? '',
        barcode: asset.barcode ?? '',
        model: asset.model ?? '',
        purchase_date: asset.purchase_date ?? '',
        purchase_cost: asset.purchase_cost ?? '',
        vendor: asset.vendor ?? '',
        warranty_expiry: asset.warranty_expiry ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [asset]);

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
        ? await updateAsset(asset.id, form)
        : await createAsset(form);

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
      <div className="bg-white rounded-[12px] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-[#E2E4E8] flex items-center justify-between">
          <h2 className="font-[Space_Grotesk] text-lg font-medium text-[#10182B]">
            {isEditMode ? 'Edit Asset' : 'Add Asset'}
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
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="mt-1 text-sm text-[#B23B1E]">{errors.category_id[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Asset Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              placeholder="e.g. Dell Latitude 5420"
            />
            {errors.name && <p className="mt-1 text-sm text-[#B23B1E]">{errors.name[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Serial Number</label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => handleChange('serial_number', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm font-mono focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
              {errors.serial_number && <p className="mt-1 text-sm text-[#B23B1E]">{errors.serial_number[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Barcode (optional)</label>
              <input
                type="text"
                value={form.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm font-mono focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
              {errors.barcode && <p className="mt-1 text-sm text-[#B23B1E]">{errors.barcode[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#10182B] mb-1.5">Model (optional)</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Purchase Date</label>
              <input
                type="date"
                value={form.purchase_date}
                onChange={(e) => handleChange('purchase_date', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
              {errors.purchase_date && <p className="mt-1 text-sm text-[#B23B1E]">{errors.purchase_date[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Purchase Cost</label>
              <input
                type="number"
                step="0.01"
                value={form.purchase_cost}
                onChange={(e) => handleChange('purchase_cost', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
              {errors.purchase_cost && <p className="mt-1 text-sm text-[#B23B1E]">{errors.purchase_cost[0]}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Vendor (optional)</label>
              <input
                type="text"
                value={form.vendor}
                onChange={(e) => handleChange('vendor', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#10182B] mb-1.5">Warranty Expiry</label>
              <input
                type="date"
                value={form.warranty_expiry}
                onChange={(e) => handleChange('warranty_expiry', e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] px-3.5 py-2.5 text-sm focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 outline-none"
              />
              {errors.warranty_expiry && <p className="mt-1 text-sm text-[#B23B1E]">{errors.warranty_expiry[0]}</p>}
            </div>
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
              {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}