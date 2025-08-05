import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'add-patient',
      title: 'Nouveau Patient',
      description: 'Enregistrer un nouveau patient',
      icon: 'UserPlus',
      color: 'primary',
      action: () => navigate('/patient-management')
    },
    {
      id: 'new-appointment',
      title: 'Nouveau RDV',
      description: 'Programmer un rendez-vous',
      icon: 'CalendarPlus',
      color: 'accent',
      action: () => navigate('/appointment-scheduling')
    },
    {
      id: 'consultation',
      title: 'Consultation',
      description: 'Démarrer une consultation',
      icon: 'Stethoscope',
      color: 'success',
      action: () => navigate('/consultation-management')
    },
    {
      id: 'emergency',
      title: 'Urgence',
      description: 'Gérer une urgence',
      icon: 'AlertTriangle',
      color: 'error',
      action: () => console.log('Emergency action')
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
      case 'accent':
        return 'bg-accent text-accent-foreground hover:bg-accent/90';
      case 'success':
        return 'bg-success text-success-foreground hover:bg-success/90';
      case 'error':
        return 'bg-error text-error-foreground hover:bg-error/90';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Actions Rapides</h3>
        <p className="text-sm text-muted-foreground">Accès direct aux fonctions principales</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            onClick={action.action}
            className="h-auto p-4 flex flex-col items-center space-y-3 hover:bg-muted/50 border border-border hover:border-primary/20 transition-all duration-200"
          >
            <div className={`p-3 rounded-full ${getColorClasses(action.color)}`}>
              <Icon name={action.icon} size={24} />
            </div>
            
            <div className="text-center">
              <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Icon name="Search" size={16} className="mr-2" />
            Rechercher
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="FileText" size={16} className="mr-2" />
            Rapports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;