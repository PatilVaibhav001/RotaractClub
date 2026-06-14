import React, { useState, useEffect, useContext } from 'react';
import { Bell, Check, X } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const NotificationBell = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
        });
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [user]);

  // Setup Socket.io
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('newNotification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => newSocket.close();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleApprove = async (userId, notificationId) => {
    try {
      // Approve user
      await axios.put(`http://localhost:5000/api/notifications/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      // Mark as read
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      
      // Update local state by removing the notification
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId, notificationId) => {
    try {
      // Reject user
      await axios.put(`http://localhost:5000/api/notifications/users/${userId}/reject`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      // Mark as read
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      
      // Update local state by removing the notification
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="relative">
      <button 
        className="relative text-slate-500 hover:text-blue-600 transition-colors active:scale-95 focus:outline-none" 
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mb-3 border border-blue-100">
                  <Bell size={26} strokeWidth={1.5} />
                </div>
                <h4 className="text-slate-800 font-bold text-sm mb-1">You're all caught up!</h4>
                <p className="text-slate-500 text-xs px-4 leading-relaxed">No pending requests or alerts. Enjoy the silence!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                      
                      {!notification.isRead && notification.userId && (
                        <div className="mt-3 flex gap-2">
                          <button 
                            onClick={() => handleApprove(notification.userId, notification._id)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleReject(notification.userId, notification._id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
