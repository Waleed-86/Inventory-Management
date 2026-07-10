import { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { fetchUsersList, deactivateUser, reactivateUser } from '../../api/endpoints/users';
import UserFormModal from './UserFormModal';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalUser, setModalUser] = useState(undefined);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchUsersList();
      setUsers(response.data.data);
    } catch {
      setError('Could not load users. Check that the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function handleSaved() {
    setModalUser(undefined);
    loadUsers();
  }

  async function handleToggleActive(user) {
    const action = user.is_active ? 'deactivate' : 'reactivate';
    if (!window.confirm(`${action === 'deactivate' ? 'Deactivate' : 'Reactivate'} "${user.name}"?`)) return;

    try {
      if (action === 'deactivate') {
        await deactivateUser(user.id);
      } else {
        await reactivateUser(user.id);
      }
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update this user.');
    }
  }

  return (
    <div className="flex min-h-screen bg-[#EDEEF0]">
      <Sidebar />

      <main className="flex-1 px-8 py-8 md:px-12">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.1em] text-[#8891A3] uppercase">Administration</p>
              <h1 className="mt-1 font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
                Users
              </h1>
            </div>
            <button
              onClick={() => setModalUser(null)}
              className="rounded-[8px] bg-[#10182B] text-[#EDEEF0] px-4 py-2.5 text-sm font-medium hover:bg-[#1B2540] transition"
            >
              + Add User
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
            ) : users.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-[15px] font-medium text-[#10182B]">No users yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#5B6472] border-b border-[#E2E4E8]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#E2E4E8] last:border-0 hover:bg-[#EDEEF0]/50">
                      <td className="px-5 py-3 text-[#10182B]">{u.name}</td>
                      <td className="px-5 py-3 text-[#5B6472]">{u.email}</td>
                      <td className="px-5 py-3 text-[#5B6472] capitalize">{u.role?.replace('-', ' ')}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-[#E7F3EC] text-[#2F7A54]' : 'bg-[#EDEEF0] text-[#5B6472]'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                        <button onClick={() => setModalUser(u)} className="text-[#3457A6] hover:underline text-sm">
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`hover:underline text-sm ${u.is_active ? 'text-[#B23B1E]' : 'text-[#2F7A54]'}`}
                        >
                          {u.is_active ? 'Deactivate' : 'Reactivate'}
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

      {modalUser !== undefined && (
        <UserFormModal user={modalUser} onClose={() => setModalUser(undefined)} onSaved={handleSaved} />
      )}
    </div>
  );
}