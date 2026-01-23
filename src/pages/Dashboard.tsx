import { useAuth } from '../context/AuthContext';
import { mockLeads, mockDeals, mockTasks } from '../data/mockData';
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
import { TrendingUp, Users, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import QuickAddMenu from '../components/QuickAddMenu';

const Dashboard = () => {
  const { user } = useAuth();

  // Calculate KPIs
  const totalLeads = mockLeads.length;
  const qualifiedLeads = mockLeads.filter(l => l.status === 'Qualified').length;
  const totalDeals = mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = mockDeals.filter(d => d.stage === 'Closed Won').length;
  const pendingTasks = mockTasks.filter(t => t.status === 'Pending').length;

  // Chart data
  const leadStatusData = [
    { name: 'New', value: mockLeads.filter(l => l.status === 'New').length },
    { name: 'Contacted', value: mockLeads.filter(l => l.status === 'Contacted').length },
    { name: 'Qualified', value: mockLeads.filter(l => l.status === 'Qualified').length },
    { name: 'Lost', value: mockLeads.filter(l => l.status === 'Lost').length }
  ];

  const dealStageData = [
    { name: 'Prospecting', value: mockDeals.filter(d => d.stage === 'Prospecting').length },
    { name: 'Proposal', value: mockDeals.filter(d => d.stage === 'Proposal').length },
    { name: 'Negotiation', value: mockDeals.filter(d => d.stage === 'Negotiation').length },
    { name: 'Closed Won', value: mockDeals.filter(d => d.stage === 'Closed Won').length },
    { name: 'Closed Lost', value: mockDeals.filter(d => d.stage === 'Closed Lost').length }
  ];

  const monthlyRevenue = [
    { month: 'Oct', revenue: 45000 },
    { month: 'Nov', revenue: 52000 },
    { month: 'Dec', revenue: 48000 },
    { month: 'Jan', revenue: 61000 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const kpiCards = [
    {
      title: 'Total Leads',
      value: totalLeads,
      change: '+12%',
      icon: <Users className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Qualified Leads',
      value: qualifiedLeads,
      change: '+8%',
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Deals',
      value: totalDeals,
      change: '+5%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pipeline Value',
      value: `$${(totalValue / 1000).toFixed(0)}K`,
      change: '+15%',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {kpi.change}
                </p>
              </div>
              <div className={`${kpi.bgColor} ${kpi.color} p-4 rounded-lg`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Status Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deal Pipeline Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline by Stage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dealStageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Deals" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {mockTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">{task.type} • Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-medium text-gray-900 mb-1">High-Value Opportunity</p>
              <p className="text-sm text-gray-600">
                "Acme Enterprise Deal" has a 75% probability of closing. Recommended action: Schedule final negotiation meeting.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-medium text-gray-900 mb-1">Lead Scoring Alert</p>
              <p className="text-sm text-gray-600">
                "Global Solutions" shows strong buying signals. Lead score: 85/100. Priority: High.
              </p>
            </div>
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="font-medium text-gray-900 mb-1">Conversion Opportunity</p>
              <p className="text-sm text-gray-600">
                3 qualified leads are ready for proposal. Estimated value: $125K.
              </p>
            </div>
          </div>
        </div>
      </div>

      <QuickAddMenu />
    </div>
  );
};

export default Dashboard;
