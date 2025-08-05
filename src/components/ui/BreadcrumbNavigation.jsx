import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeLabels = {
    '/dashboard-overview': 'Tableau de Bord',
    '/patient-management': 'Gestion des Patients',
    '/appointment-scheduling': 'Planification des Rendez-vous',
    '/consultation-management': 'Gestion des Consultations',
    '/login-authentication': 'Authentification'
  };

  const routeIcons = {
    '/dashboard-overview': 'LayoutDashboard',
    '/patient-management': 'Users',
    '/appointment-scheduling': 'Calendar',
    '/consultation-management': 'Stethoscope',
    '/login-authentication': 'LogIn'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always add home/dashboard as first breadcrumb if not on dashboard
    if (location.pathname !== '/dashboard-overview') {
      breadcrumbs.push({
        label: 'Accueil',
        path: '/dashboard-overview',
        icon: 'Home',
        isActive: false
      });
    }

    // Add current page
    const currentPath = location.pathname;
    const currentLabel = routeLabels[currentPath] || 'Page';
    const currentIcon = routeIcons[currentPath] || 'FileText';

    breadcrumbs.push({
      label: currentLabel,
      path: currentPath,
      icon: currentIcon,
      isActive: true
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path) => {
    if (path !== location.pathname) {
      navigate(path);
    }
  };

  // Don't show breadcrumbs on login page
  if (location.pathname === '/login-authentication') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 py-4 px-6 bg-background border-b border-border">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground" 
              />
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBreadcrumbClick(breadcrumb.path)}
              className={`
                flex items-center space-x-2 px-2 py-1 h-8
                ${breadcrumb.isActive 
                  ? 'text-primary font-medium cursor-default' :'text-muted-foreground hover:text-foreground'
                }
              `}
              disabled={breadcrumb.isActive}
            >
              <Icon 
                name={breadcrumb.icon} 
                size={16} 
                className={breadcrumb.isActive ? 'text-primary' : 'text-muted-foreground'} 
              />
              <span>{breadcrumb.label}</span>
            </Button>
          </React.Fragment>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center space-x-2">
          {location.pathname === '/patient-management' && (
            <Button variant="outline" size="sm">
              <Icon name="UserPlus" size={16} className="mr-2" />
              Nouveau Patient
            </Button>
          )}
          
          {location.pathname === '/appointment-scheduling' && (
            <Button variant="outline" size="sm">
              <Icon name="CalendarPlus" size={16} className="mr-2" />
              Nouveau RDV
            </Button>
          )}
          
          {location.pathname === '/consultation-management' && (
            <Button variant="outline" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Nouvelle Consultation
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default BreadcrumbNavigation;