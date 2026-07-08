import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { fetchCategoriesList, deleteCategory } from '../../api/endpoints/categories';
import CategoryFormModal from './CategoryFormModal';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state: undefined = closed, null = create mode, {...category} = edit mode
  const [modalCategory, setModalCategory] = useState(undefined);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchCategoriesList();
      setCategories(response.data.data);
    } catch {
      setError('Could not load categories. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleSaved() {
    setModalCategory(undefined);
    loadCategories();
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;

    try {
      await deleteCategory(category.id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete this category.');
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Inventory</p>
              <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
                Categories
              </h1>
            </div>
            <button
              onClick={() => setModalCategory(null)}
              className="rounded-[8px] bg-[#10182B] text-[#EDEEF0] px-4 py-2.5 text-sm font-medium hover:bg-[#1B2540] transition"
            >
              + Add Category
            </button>
          </div>

          <section className="mt-6 bg-white rounded-[10px] border border-[#E2E4E8] overflow-hidden">
            {error && (
              <div className="px-5 py-3 text-sm text-[#B23B1E] bg-[#FBEDE6] border-b border-[#E4B8A0]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-14 text-center text-sm text-[#8891A3]">Loading…</div>
            ) : categories.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No categories yet</p>
                <p className="mt-1 text-sm text-[#5B6472]">
                  Add a category like "Electronics" or "Furniture" to start organizing assets.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Assets</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-[#E2E4E8] last:border-0 hover:bg-[#EDEEF0]/50">
                      <td className="px-5 py-3 text-[#10182B]">{category.name}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{category.description || '—'}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{category.assets_count ?? 0}</td>
                      <td className="px-5 py-3 text-right space-x-3">
                        <button
                          onClick={() => setModalCategory(category)}
                          className="text-[#3457A6] hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
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

      {modalCategory !== undefined && (
        <CategoryFormModal
          category={modalCategory}
          onClose={() => setModalCategory(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}