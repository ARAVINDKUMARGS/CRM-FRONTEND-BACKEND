import { useState } from 'react';
import { Plus, Search, Edit, Trash2, TrendingUp, Filter } from 'lucide-react';
import { mockDeals, mockAccounts, mockContacts, mockUsers } from '../data/mockData';
import { Deal } from '../types';
import Modal from '../components/Modal';

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    accountId: '',
    contactId: '',
    value: '',
    stage: 'Prospecting' as Deal['stage'],
    probability: '50',
    expectedCloseDate: '',
    assignedTo: '',
    notes: ''
  });

  const stages: Deal['stage'][] = ['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || deal.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleAdd = () => {
    setEditingDeal(null);
    setFormData({
      title: '',
      accountId: '',
      contactId: '',
      value: '',
      stage: 'Prospecting',
      probability: '50',
      expectedCloseDate: '',
      assignedTo: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      title: deal.title,
      accountId: deal.accountId || '',
      contactId: deal.contactId || '',
      value: deal.value.toString(),
      stage: deal.stage,
      probability: deal.probability.toString(),
      expectedCloseDate: deal.expectedCloseDate,
      assignedTo: deal.assignedTo,
      notes: deal.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      setDeals(deals.map(d =>
        d.id === editingDeal.id
          ? {
              ...d,
              ...formData,
              value: parseFloat(formData.value),
              probability: parseInt(formData.probability),
              updatedAt: new Date().toISOString()
            }
          : d
      ));
    } else {
      const newDeal: Deal = {
        id: Date.now().toString(),
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDeals([...deals, newDeal]);
    }
    setIsModalOpen(false);
  };

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'Prospecting': return 'bg-blue-100 text-blue-800';
      case 'Proposal': return 'bg-yellow-100 text-yellow-800';
      case 'Negotiation': return 'bg-purple-100 text-purple-800';
      case 'Closed Won': return 'bg-green-100 text-green-800';
      case 'Closed Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonValue = deals.filter(d => d.stage === 'Closed Won').reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage your sales pipeline and opportunities</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Won Deals</p>
              <p className="text-2xl font-bold text-gray-900">${(wonValue / 1000).toFixed(0)}K</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">{deals.filter(d => !d.stage.includes('Closed')).length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="input-field"
            >
              <option value="All">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Stage</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Probability</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Expected Close</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Assigned To</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => {
              const account = mockAccounts.find(a => a.id === deal.accountId);
              const assignedUser = mockUsers.find(u => u.id === deal.assignedTo);
              return (
                <tr key={deal.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{deal.title}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{account?.name || '-'}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">
                    ${deal.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{assignedUser?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(deal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredDeals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No deals found. Create your first deal to get started.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deal Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="input-field"
              >
                <option value="">Select account</option>
                {mockAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
              <select
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                className="input-field"
              >
                <option value="">Select contact</option>
                {mockContacts.filter(c => !formData.accountId || c.accountId === formData.accountId).map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deal Value ($) *</label>
              <input
                type="number"
                required
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage *</label>
              <select
                required
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Deal['stage'] })}
                className="input-field"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date *</label>
              <input
                type="date"
                required
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="input-field"
              >
                <option value="">Select user</option>
                {mockUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={3}
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
              {editingDeal ? 'Update' : 'Create'} Deal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Deals;
