import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'consultation',
      icon: 'Stethoscope',
      title: 'Consultation terminée',
      description: 'Dr. Mbarga a terminé la consultation de Mme Kouam Marie',
      time: '5 min',
      user: 'Dr. Mbarga Jean',
      color: 'success'
    },
    {
      id: 2,
      type: 'admission',
      icon: 'UserPlus',
      title: 'Nouveau patient admis',
      description: 'M. Nkomo Paul admis en cardiologie - Chambre 204',
      time: '12 min',
      user: 'Réception',
      color: 'primary'
    },
    {
      id: 3,
      type: 'lab',
      icon: 'TestTube',
      title: 'Résultats de laboratoire',
      description: 'Analyses sanguines validées pour Mlle Biya Sandra',
      time: '25 min',
      user: 'Dr. Kamga Pierre',
      color: 'accent'
    },
    {
      id: 4,
      type: 'pharmacy',
      icon: 'Pill',
      title: 'Prescription délivrée',
      description: 'Médicaments remis à M. Tchoumi André',
      time: '35 min',
      user: 'Pharmacie',
      color: 'warning'
    },
    {
      id: 5,
      type: 'appointment',
      icon: 'Calendar',
      title: 'RDV reprogrammé',
      description: 'Rendez-vous de Mme Ngono reporté au 22 juillet',
      time: '1h',
      user: 'Dr. Fotso Claire',
      color: 'secondary'
    },
    {
      id: 6,
      type: 'system',
      icon: 'Settings',
      title: 'Sauvegarde automatique',
      description: 'Sauvegarde des données effectuée avec succès',
      time: '2h',
      user: 'Système',
      color: 'muted'
    }
  ];

  const getActivityColor = (color) => {
    switch (color) {
      case 'success':
        return 'text-success bg-success/10 border-success/20';
      case 'primary':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'accent':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'warning':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'secondary':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">Activités Récentes</h3>
        <p className="text-sm text-muted-foreground">Dernières actions dans le système</p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full border ${getActivityColor(activity.color)}`}>
                <Icon name={activity.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">Il y a {activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline connector */}
            {index < activities.length - 1 && (
              <div className="ml-6 mt-3 h-4 border-l-2 border-dashed border-border"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Voir toutes les activités
        </button>
      </div>
    </div>
  );
};

export default RecentActivities;