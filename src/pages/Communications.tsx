import { useState } from 'react';
import { Plus, Search, Mail, Phone, FileText, MessageSquare } from 'lucide-react';
import { mockCommunications, mockUsers } from '../data/mockData';
import { Communication } from '../types';
import Modal from '../components/Modal';

const Communications = () => {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Email' as Communication['type'],
    subject: '',
    content: '',
    relatedToType: 'Lead' as 'Lead' | 'Contact' | 'Deal' | 'Account',
    relatedToId: ''
  });

  const types: Communication['type'][] = ['Email', 'Call', 'Note', 'Document'];

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || comm.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAdd = () => {
    setFormData({
      type: 'Email',
      subject: '',
      content: '',
      relatedToType: 'Lead',
      relatedToId: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComm: Communication = {
      id: Date.now().toString(),
      ...formData,
      relatedTo: {
        type: formData.relatedToType,
        id: formData.relatedToId
      },
      createdBy: '1', // Current user
      createdAt: new Date().toISOString()
    };
    setCommunications([newComm, ...communications]);
    setIsModalOpen(false);
  };

  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'Email': return <Mail className="w-5 h-5" />;
      case 'Call': return <Phone className="w-5 h-5" />;
      case 'Note': return <MessageSquare className="w-5 h-5" />;
      case 'Document': return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Communication['type']) => {
    switch (type) {
      case 'Email': return 'bg-blue-100 text-blue-800';
      case 'Call': return 'bg-green-100 text-green-800';
      case 'Note': return 'bg-yellow-100 text-yellow-800';
      case 'Document': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-1">Track all customer interactions</p>
        </div>
        <button onClick={handleAdd} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Log Communication
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search communications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field"
          >
            <option value="All">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Communications Timeline */}
      <div className="space-y-4">
        {filteredCommunications.map((comm) => {
          const createdBy = mockUsers.find(u => u.id === comm.createdBy);
          return (
            <div key={comm.id} className="card">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getTypeColor(comm.type)}`}>
                  {getTypeIcon(comm.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{comm.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {createdBy?.name} • {new Date(comm.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(comm.type)}`}>
                      {comm.type}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comm.content}</p>
                  <div className="text-sm text-gray-500">
                    Related to: {comm.relatedTo.type} #{comm.relatedTo.id}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="card text-center py-12 text-gray-500">
          No communications found. Log your first communication to get started.
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Communication"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Communication['type'] })}
                className="input-field"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Related To Type</label>
              <select
                value={formData.relatedToType}
                onChange={(e) => setFormData({ ...formData, relatedToType: e.target.value as any })}
                className="input-field"
              >
                <option value="Lead">Lead</option>
                <option value="Contact">Contact</option>
                <option value="Deal">Deal</option>
                <option value="Account">Account</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Related To ID</label>
              <input
                type="text"
                value={formData.relatedToId}
                onChange={(e) => setFormData({ ...formData, relatedToId: e.target.value })}
                className="input-field"
                placeholder="Enter ID"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field"
              rows={5}
            />
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
              Log Communication
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Communications;
