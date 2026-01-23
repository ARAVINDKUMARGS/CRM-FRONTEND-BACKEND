import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, Globe, Phone, Users, DollarSign } from 'lucide-react';
import { mockAccounts } from '../data/mockData';
import { Account } from '../types';
import Modal from '../components/Modal';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    address: '',
    employees: '',
    annualRevenue: ''
  });

  const industries = ['Technology', 'Software', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'];

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAccount(null);
    setFormData({
      name: '',
      industry: '',
      website: '',
      phone: '',
      address: '',
      employees: '',
      annualRevenue: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      industry: account.industry || '',
      website: account.website || '',
      phone: account.phone || '',
      address: account.address || '',
      employees: account.employees?.toString() || '',
      annualRevenue: account.annualRevenue?.toString() || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccount) {
      setAccounts(accounts.map(a =>
        a.id === editingAccount.id
          ? {
              ...a,
              ...formData,
              employees: formData.employees ? parseInt(formData.employees) : undefined,
              annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined,
              updatedAt: new Date().toISOString()
            }
          : a
      ));
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : undefined,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAccounts([...accounts, newAccount]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">Manage company accounts and organizations</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <div key={account.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  {account.industry && (
                    <p className="text-sm text-gray-600">{account.industry}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(account)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {account.website && (
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={`https://${account.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                    {account.website}
                  </a>
                </div>
              )}
              {account.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {account.phone}
                </div>
              )}
              {account.employees && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {account.employees} employees
                </div>
              )}
              {account.annualRevenue && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${(account.annualRevenue / 1000000).toFixed(1)}M annual revenue
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="card text-center py-12 text-gray-500">
          No accounts found. Create your first account to get started.
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? 'Edit Account' : 'Add New Account'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="input-field"
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input-field"
                placeholder="example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employees</label>
              <input
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue ($)</label>
              <input
                type="number"
                value={formData.annualRevenue}
                onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingAccount ? 'Update' : 'Create'} Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;
