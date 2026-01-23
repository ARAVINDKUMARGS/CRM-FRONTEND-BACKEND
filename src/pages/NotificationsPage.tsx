import { Link } from 'react-router-dom';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAllAsRead, markAsRead, removeNotification } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <button onClick={markAllAsRead} className="btn-secondary flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Mark all as read
        </button>
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No notifications.</div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div key={n.id} className="py-4 flex items-start gap-4">
                <div
                  className={`mt-1 p-2 rounded-lg ${
                    n.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : n.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : n.type === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-primary-600 rounded-full" title="Unread" />}
                  </div>
                  <p className="text-gray-700 mt-1">{n.message}</p>
                  <p className="text-sm text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>

                  {n.link && (
                    <div className="mt-2">
                      <Link to={n.link} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View details
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 text-gray-700 hover:bg-gray-100 rounded"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(n.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

