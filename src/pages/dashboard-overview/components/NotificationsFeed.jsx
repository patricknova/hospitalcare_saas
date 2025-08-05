import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationsFeed = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      icon: 'AlertTriangle',
      title: 'Patient en urgence',
      message: 'Mme Kouam Marie nécessite une attention immédiate en salle 3',
      time: '2 min',
      read: false
    },
    {
      id: 2,
      type: 'appointment',
      icon: 'Calendar',
      title: 'Nouveau rendez-vous',
      message: 'Dr. Mbarga a programmé un RDV pour 15h30',
      time: '5 min',
      read: false
    },
    {
      id: 3,
      type: 'lab',
      icon: 'TestTube',
      title: 'Résultats disponibles',
      message: 'Analyses de sang pour M. Nkomo Paul prêtes',
      time: '12 min',
      read: true
    },
    {
      id: 4,
      type: 'system',
      icon: 'Settings',
      title: 'Maintenance programmée',
      message: 'Système de sauvegarde à 23h00 ce soir',
      time: '1h',
      read: true
    },
    {
      id: 5,
      type: 'pharmacy',
      icon: 'Pill',
      title: 'Stock faible',
      message: 'Paracétamol 500mg - Stock critique (12 unités)',
      time: '2h',
      read: false
    }
  ]);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'text-error bg-error/10 border-error/20';
      case 'appointment':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'lab':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'pharmacy':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-error text-error-foreground text-xs rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Alertes et mises à jour en temps réel</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors ${
              !notification.read ? 'bg-muted/20' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full border ${getNotificationColor(notification.type)}`}>
                <Icon name={notification.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </h4>
                  <div className="flex items-center space-x-2 ml-2">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          <Icon name="Bell" size={16} className="mr-2" />
          Voir toutes les notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationsFeed;