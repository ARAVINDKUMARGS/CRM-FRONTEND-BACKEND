import { useState } from 'react';
import { Plus, X, UserPlus, TrendingUp, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAddMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      label: 'Add Lead',
      action: () => {
        navigate('/leads?action=add');
        setIsOpen(false);
      }
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Add Deal',
      action: () => {
        navigate('/deals?action=add');
        setIsOpen(false);
      }
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      label: 'Add Task',
      action: () => {
        navigate('/tasks?action=add');
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 bg-white rounded-lg shadow-xl p-2 min-w-[180px]">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="mr-3">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform ${
          isOpen
            ? 'bg-red-500 text-white rotate-45'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default QuickAddMenu;
