import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConsultationTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: 'active',
      label: 'Consultations Actives',
      icon: 'Clock',
      count: counts.active,
      color: 'text-primary'
    },
    {
      id: 'completed',
      label: 'Terminées',
      icon: 'CheckCircle',
      count: counts.completed,
      color: 'text-success'
    },
    {
      id: 'followup',
      label: 'Suivi Requis',
      icon: 'Calendar',
      count: counts.followup,
      color: 'text-warning'
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center space-x-2 px-4 py-2"
            >
              <Icon 
                name={tab.icon} 
                size={16} 
                className={activeTab === tab.id ? '' : tab.color}
              />
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`
                  px-2 py-1 text-xs rounded-full font-medium
                  ${activeTab === tab.id 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Filter" size={16} className="mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Exporter
          </Button>
          <Button variant="default" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Nouvelle Consultation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationTabs;