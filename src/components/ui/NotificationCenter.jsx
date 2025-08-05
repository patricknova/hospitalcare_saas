import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'appointment',
        category: 'urgent',
        title: 'Rendez-vous urgent',
        message: 'Patient Jean Dupont demande un rendez-vous d\'urgence',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        actionRequired: true
      },
      {
        id: 2,
        type: 'patient',
        category: 'info',
        title: 'Nouveau patient enregistré',
        message: 'Marie Kouam a été ajoutée au système',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        actionRequired: false
      },
      {
        id: 3,
        type: 'system',
        category: 'warning',
        title: 'Maintenance programmée',
        message: 'Maintenance du système prévue ce soir à 23h00',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        actionRequired: false
      },
      {
        id: 4,
        type: 'consultation',
        category: 'urgent',
        title: 'Résultats d\'analyse disponibles',
        message: 'Les résultats de laboratoire pour Paul Mbarga sont prêts',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        actionRequired: true
      },
      {
        id: 5,
        type: 'appointment',
        category: 'info',
        title: 'Rappel de rendez-vous',
        message: 'Rendez-vous avec Dr. Martin dans 1 heure',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
        actionRequired: false
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return 'Calendar';
      case 'patient': return 'User';
      case 'consultation': return 'Stethoscope';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'urgent': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryBg = (category) => {
    switch (category) {
      case 'urgent': return 'bg-error/10 border-l-error';
      case 'warning': return 'bg-warning/10 border-l-warning';
      case 'info': return 'bg-primary/10 border-l-primary';
      default: return 'bg-muted/50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'urgent') return notification.category === 'urgent';
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.category === 'urgent' && !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1100 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <div className="fixed top-16 right-0 bottom-0 w-full max-w-md bg-popover border-l border-border shadow-prominent lg:absolute lg:top-0 lg:right-0 lg:bottom-auto lg:w-96 lg:max-h-[600px] lg:rounded-lg lg:border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-popover-foreground">Centre de Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {unreadCount} non lues
                {urgentCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-error text-error-foreground text-xs rounded-full">
                    {urgentCount} urgentes
                  </span>
                )}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Toutes', count: notifications.length },
                { key: 'unread', label: 'Non lues', count: unreadCount },
                { key: 'urgent', label: 'Urgentes', count: urgentCount },
                { key: 'appointment', label: 'RDV', count: notifications.filter(n => n.type === 'appointment').length }
              ].map(filterOption => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                  className="text-xs"
                >
                  {filterOption.label}
                  {filterOption.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-current/20 rounded-full text-xs">
                      {filterOption.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-4 border-b border-border">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="w-full">
                <Icon name="CheckCheck" size={16} className="mr-2" />
                Marquer tout comme lu
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                <Icon name="Bell" size={32} className="text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 border-l-4 hover:bg-muted/50 cursor-pointer transition-colors
                      ${!notification.read ? 'bg-muted/30' : ''}
                      ${getCategoryBg(notification.category)}
                    `}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-background ${getCategoryColor(notification.category)}`}>
                        <Icon 
                          name={getNotificationIcon(notification.type)} 
                          size={16}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-popover-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="w-6 h-6 opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error"
                            >
                              <Icon name="X" size={12} />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          {notification.actionRequired && (
                            <Button variant="outline" size="sm" className="text-xs">
                              Action requise
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full">
              <Icon name="Archive" size={16} className="mr-2" />
              Voir l'historique complet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;