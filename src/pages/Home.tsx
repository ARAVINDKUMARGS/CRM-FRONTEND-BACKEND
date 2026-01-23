import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  FileText, 
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Lead Management',
      description: 'Track and manage leads from multiple sources with advanced filtering and assignment.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Deal Pipeline',
      description: 'Visualize your sales pipeline and track deals through every stage to closure.'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Contact Management',
      description: 'Maintain comprehensive contact and account information with communication history.'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Task & Activities',
      description: 'Schedule tasks, calls, meetings, and follow-ups with priority and due date tracking.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Reports & Analytics',
      description: 'Generate detailed reports on sales performance, leads, and team productivity.'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Insights',
      description: 'Get predictive lead scoring, deal risk analysis, and actionable recommendations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CRM Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Customer
            <span className="text-primary-600"> Relationships</span>
            <br />
            Like Never Before
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive CRM solution that helps you track leads, manage deals,
            nurture relationships, and grow your business with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to streamline your sales and marketing processes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-primary-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of companies using CRM Pro to grow their business
          </p>
          <Link
            to="/login"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white">CRM Pro</span>
            </div>
            <p>&copy; 2026 CRM Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
