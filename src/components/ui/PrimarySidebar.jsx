import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimarySidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(event.detail.expanded);
      } else {
        setIsMobileOpen(event.detail.expanded);
      }
    };

    window.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => window.removeEventListener('toggleSidebar', handleToggleSidebar);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      labelKey: 'Tableau de Bord',
      icon: 'LayoutDashboard',
      path: '/dashboard-overview',
      badge: null
    },
    {
      id: 'patients',
      labelKey: 'Patients',
      icon: 'Users',
      path: '/patient-management',
      badge: 24
    },
    {
      id: 'appointments',
      labelKey: 'Rendez-vous',
      icon: 'Calendar',
      path: '/appointment-scheduling',
      badge: 8
    },
    {
      id: 'consultations',
      labelKey: 'Consultations',
      icon: 'Stethoscope',
      path: '/consultation-management',
      badge: 3
    },
    {
      id: 'pharmacy',
      labelKey: 'Pharmacie',
      icon: 'Pill',
      path: '/pharmacy-inventory-management',
      badge: null
    },
    {
      id: 'laboratory',
      labelKey: 'Laboratoire',
      icon: 'FlaskConical',
      path: '/laboratory-management-system',
      badge: 12
    },
    {
      id: 'billing',
      labelKey: 'Facturation',
      icon: 'CreditCard',
      path: '/billing-and-payment-processing',
      badge: 5
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-900 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        h-[calc(100vh-4rem)] bg-card border-r border-border
        transition-all duration-300 ease-smooth
        ${isExpanded ? 'w-72' : 'w-16'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${window.innerWidth < 1024 ? 'fixed top-16 left-0 z-900' : 'relative'}
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={isActiveRoute(item.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full justify-start h-12 px-3
                  ${!isExpanded && 'px-3 justify-center'}
                  ${isActiveRoute(item.path) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                `}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={`${isExpanded ? 'mr-3' : ''} flex-shrink-0`}
                />
                {isExpanded && (
                  <>
                    <span className="flex-1 text-left font-medium">{item.labelKey}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${isActiveRoute(item.path) 
                          ? 'bg-primary-foreground/20 text-primary-foreground' 
                          : 'bg-accent text-accent-foreground'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-border">
            {isExpanded ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <Icon name="Activity" size={20} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Système Actif</p>
                    <p className="text-xs text-muted-foreground">Tous les services opérationnels</p>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full justify-start h-10">
                  <Icon name="Settings" size={18} className="mr-3" />
                  <span className="text-sm">Paramètres</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center mx-auto">
                  <Icon name="Activity" size={20} color="white" />
                </div>
                <Button variant="ghost" size="icon" className="w-full">
                  <Icon name="Settings" size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default PrimarySidebar;