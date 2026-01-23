import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Megaphone, TrendingUp, DollarSign } from 'lucide-react';
import { mockCampaigns } from '../data/mockData';
import { Campaign } from '../types';
import Modal from '../components/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Planning' as Campaign['status'],
    startDate: '',
    endDate: '',
    budget: '',
    leadsGenerated: '',
    conversionRate: ''
  });

  const statuses: Campaign['status'][] = ['Planning', 'Active', 'Completed', 'Cancelled'];
  const types = ['Email Campaign', 'Social Media', 'Webinar', 'Trade Show', 'Content Marketing', 'Other'];

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      type: '',
      status: 'Planning',
      startDate: '',
      endDate: '',
      budget: '',
      leadsGenerated: '',
      conversionRate: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate || '',
      budget: campaign.budget?.toString() || '',
      leadsGenerated: campaign.leadsGenerated.toString(),
      conversionRate: campaign.conversionRate.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCampaign) {
      setCampaigns(campaigns.map(c =>
        c.id === editingCampaign.id
          ? {
              ...c,
              ...formData,
              budget: formData.budget ? parseFloat(formData.budget) : undefined,
              leadsGenerated: parseInt(formData.leadsGenerated),
              conversionRate: parseFloat(formData.conversionRate)
            }
          : c
      ));
    } else {
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        leadsGenerated: parseInt(formData.leadsGenerated),
        conversionRate: parseFloat(formData.conversionRate)
      };
      setCampaigns([...campaigns, newCampaign]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const chartData = campaigns.map(c => ({
    name: c.name,
    leads: c.leadsGenerated,
    conversion: c.conversionRate
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage marketing campaigns and track performance</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <Megaphone className="w-10 h-10 text-primary-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0)}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${campaigns.reduce((sum, c) => sum + (c.budget || 0), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="leads" fill="#3b82f6" name="Leads Generated" />
            <Bar dataKey="conversion" fill="#10b981" name="Conversion Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                <p className="text-sm text-gray-600">{campaign.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="text-gray-900">{new Date(campaign.startDate).toLocaleDateString()}</span>
              </div>
              {campaign.endDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="text-gray-900">{new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
              )}
              {campaign.budget && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget:</span>
                  <span className="text-gray-900">${campaign.budget.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Leads Generated:</span>
                <span className="text-gray-900 font-semibold">{campaign.leadsGenerated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conversion Rate:</span>
                <span className="text-gray-900 font-semibold">{campaign.conversionRate}%</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => handleEdit(campaign)}
                className="flex-1 btn-secondary text-sm py-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(campaign.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="card text-center py-12 text-gray-500">
          No campaigns found. Create your first campaign to get started.
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
              >
                <option value="">Select type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Leads Generated</label>
              <input
                type="number"
                value={formData.leadsGenerated}
                onChange={(e) => setFormData({ ...formData, leadsGenerated: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.conversionRate}
                onChange={(e) => setFormData({ ...formData, conversionRate: e.target.value })}
                className="input-field"
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
              {editingCampaign ? 'Update' : 'Create'} Campaign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Campaigns;
