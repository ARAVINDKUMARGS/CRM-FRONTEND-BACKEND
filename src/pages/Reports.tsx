import { useState } from 'react';
import { Download, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import { mockLeads, mockDeals, mockTasks, mockCampaigns } from '../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [reportType, setReportType] = useState<'sales' | 'leads' | 'deals' | 'campaigns'>('sales');

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Sales Report Data
  const salesData = [
    { month: 'Oct', revenue: 45000, deals: 12 },
    { month: 'Nov', revenue: 52000, deals: 15 },
    { month: 'Dec', revenue: 48000, deals: 14 },
    { month: 'Jan', revenue: 61000, deals: 18 }
  ];

  // Leads Report Data
  const leadsBySource = [
    { name: 'Website', value: mockLeads.filter(l => l.source === 'Website').length },
    { name: 'Referral', value: mockLeads.filter(l => l.source === 'Referral').length },
    { name: 'LinkedIn', value: mockLeads.filter(l => l.source === 'LinkedIn').length },
    { name: 'Email Campaign', value: mockLeads.filter(l => l.source === 'Email Campaign').length }
  ];

  const leadsByStatus = [
    { name: 'New', value: mockLeads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: mockLeads.filter(l => l.status === 'Contacted').length },
    { name: 'Qualified', value: mockLeads.filter(l => l.status === 'Qualified').length },
    { name: 'Lost', value: mockLeads.filter(l => l.status === 'Lost').length }
  ];

  // Deals Pipeline Data
  const dealsByStage = [
    { name: 'Prospecting', value: mockDeals.filter(d => d.stage === 'Prospecting').length },
    { name: 'Proposal', value: mockDeals.filter(d => d.stage === 'Proposal').length },
    { name: 'Negotiation', value: mockDeals.filter(d => d.stage === 'Negotiation').length },
    { name: 'Closed Won', value: mockDeals.filter(d => d.stage === 'Closed Won').length },
    { name: 'Closed Lost', value: mockDeals.filter(d => d.stage === 'Closed Lost').length }
  ];

  const handleExport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const totalRevenue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = mockDeals.filter(d => d.stage === 'Closed Won');
  const wonRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const conversionRate = mockLeads.length > 0 ? (wonDeals.length / mockLeads.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="btn-secondary flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          {(['sales', 'leads', 'deals', 'campaigns'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                reportType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Report
            </button>
          ))}
        </div>
      </div>

      {/* Sales Report */}
      {reportType === 'sales' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Won Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${(wonRevenue / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{mockDeals.length}</p>
                </div>
                <FileText className="w-10 h-10 text-purple-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="deals"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Deals"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Leads Report */}
      {reportType === 'leads' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{mockLeads.length}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Qualified Leads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockLeads.filter(l => l.status === 'Qualified').length}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lead Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${mockLeads.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Deals Report */}
      {reportType === 'deals' && (
        <>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline by Stage</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dealsByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Campaigns Report */}
      {reportType === 'campaigns' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{mockCampaigns.length}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads Generated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockCampaigns.reduce((sum, c) => sum + c.leadsGenerated, 0)}
                  </p>
                </div>
                <Users className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(mockCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / mockCampaigns.length).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockCampaigns.map(c => ({ name: c.name, leads: c.leadsGenerated, conversion: c.conversionRate }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="leads" fill="#3b82f6" name="Leads Generated" />
                <Bar yAxisId="right" dataKey="conversion" fill="#10b981" name="Conversion Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
