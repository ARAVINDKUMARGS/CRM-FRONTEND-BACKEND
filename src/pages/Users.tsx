import { useMemo, useState } from 'react';
import { Edit2, Plus, Search, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import Modal from '../components/Modal';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

const allRoles: UserRole[] = [
  'System Admin',
  'Sales Manager',
  'Sales Executive',
  'Marketing Executive',
  'Support Executive',
  'Customer',
];

const Users = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Sales Executive' as UserRole,
    enabled: true,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'Sales Executive', enabled: true });
    setIsModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, enabled: u.enabled });
    setIsModalOpen(true);
  };

  const toggleEnabled = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? { ...u, name: form.name, email: form.email, role: form.role, enabled: form.enabled }
            : u,
        ),
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: form.name,
        email: form.email,
        role: form.role,
        enabled: form.enabled,
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
          <p className="text-gray-600 mt-1">Create users, assign roles, and enable/disable access.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          New User
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role…"
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            Admin-only module
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{u.name}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </td>
                <td className="py-3 px-4 text-gray-700">{u.role}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {u.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(u)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleEnabled(u.id)}
                      className={`p-2 rounded ${
                        u.enabled ? 'text-gray-700 hover:bg-gray-100' : 'text-green-700 hover:bg-green-50'
                      }`}
                      title={u.enabled ? 'Disable user' : 'Enable user'}
                    >
                      {u.enabled ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && <div className="text-center py-12 text-gray-500">No users found.</div>}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? 'Edit User' : 'Create User'}
        size="md"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className="input-field"
              >
                {allRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={form.enabled ? 'enabled' : 'disabled'}
                onChange={(e) => setForm({ ...form, enabled: e.target.value === 'enabled' })}
                className="input-field"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
