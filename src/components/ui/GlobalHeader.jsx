import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import NotificationCenter from './NotificationCenter';



const GlobalHeader = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
    // Dispatch custom event for sidebar communication
    window.dispatchEvent(new CustomEvent('toggleSidebar', { detail: { expanded: !sidebarExpanded } }));
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation will be handled by AuthContext
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Nouveau rendez-vous',
      message: 'Dr. Martin a programmé un rendez-vous pour 14h30',
      time: '5 min',
      urgent: false,
      read: false
    },
    {
      id: 2,
      type: 'alert',
      title: 'Alerte patient',
      message: 'Patient critique en salle d\'urgence',
      time: '2 min',
      urgent: true,
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Mise à jour système',
      message: 'Maintenance programmée à 23h00',
      time: '1h',
      urgent: false,
      read: true
    }
  ];

  // Calculate unread notifications count
  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return 'Calendar';
      case 'alert': return 'AlertTriangle';
      case 'system': return 'Settings';
      default: return 'Bell';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-1000">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left Section - Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="lg:flex hidden"
            >
              <Icon name="Menu" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="lg:hidden flex"
            >
              <Icon name="Menu" size={20} />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">HospitalCare</h1>
                <p className="text-xs text-muted-foreground">Système de Gestion Hospitalière</p>
              </div>
            </div>
          </div>

          {/* Right Section - Notifications and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Icon name="Bell" size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>
              
              {showNotifications && (
                <NotificationCenter onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 h-10 px-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {userProfile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-foreground">
                    {userProfile?.first_name && userProfile?.last_name 
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : user?.email?.split('@')[0] || 'Utilisateur'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userProfile?.role || 'Patient'}
                  </p>
                </div>
                <Icon name="ChevronDown" size={16} className="text-muted-foreground hidden lg:block" />
              </Button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-medium">
                        {userProfile?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {userProfile?.first_name && userProfile?.last_name 
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : user?.email?.split('@')[0] || 'Utilisateur'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                          {userProfile?.role || 'Patient'}
                        </span>
                      </div>
                    </div>
                    
                    {userProfile?.organization && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                        <div className="font-medium text-foreground">{userProfile.organization.name}</div>
                        <div className="text-muted-foreground">{userProfile.organization.plan}</div>
                      </div>
                    )}
                  </div>

                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-3">
                      <Icon name="User" size={16} />
                      <span>Mon Profil</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-3">
                      <Icon name="Settings" size={16} />
                      <span>Paramètres</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 flex items-center space-x-3">
                      <Icon name="HelpCircle" size={16} />
                      <span>Aide & Support</span>
                    </button>
                  </div>

                  <div className="border-t border-border py-2">
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/5 flex items-center space-x-3"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Se Déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile notifications/menu */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 bg-black/20 z-900 lg:hidden"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </>
  );
};

export default GlobalHeader;