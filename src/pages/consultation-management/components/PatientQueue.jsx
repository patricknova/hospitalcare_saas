import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientQueue = ({ patients, selectedPatient, onSelectPatient, activeTab }) => {
  const getStatusColor = (status) => {
    const colors = {
      'En attente': 'bg-warning/10 text-warning border-warning/20',
      'En cours': 'bg-primary/10 text-primary border-primary/20',
      'Terminé': 'bg-success/10 text-success border-success/20',
      'Suivi requis': 'bg-error/10 text-error border-error/20'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return { icon: 'AlertTriangle', color: 'text-error' };
      case 'Élevé': return { icon: 'ArrowUp', color: 'text-warning' };
      case 'Normal': return { icon: 'Minus', color: 'text-muted-foreground' };
      default: return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'active': return 'File d\'Attente Active';
      case 'completed': return 'Consultations Terminées';
      case 'followup': return 'Patients en Suivi';
      default: return 'Liste des Patients';
    }
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{getTabTitle()}</h3>
          <span className="text-sm text-muted-foreground">
            {patients.length} patient{patients.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Icon name="Users" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun patient dans cette catégorie</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {patients.map((patient) => {
              const priority = getPriorityIcon(patient.priority);
              const isSelected = selectedPatient?.id === patient.id;
              
              return (
                <div
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {/* Patient Photo */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={patient.photo}
                        alt={`Photo de ${patient.name}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {patient.priority === 'Urgent' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-card flex items-center justify-center">
                          <Icon name="AlertTriangle" size={8} color="white" />
                        </div>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground truncate">
                            {patient.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} ans • {patient.gender}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <Icon 
                            name={priority.icon} 
                            size={14} 
                            className={priority.color}
                          />
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name="Clock" size={12} className="text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatTime(patient.appointmentTime)}
                          </span>
                          {patient.doctor && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{patient.doctor}</span>
                            </>
                          )}
                        </div>
                        
                        {patient.reason && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Icon name="FileText" size={12} className="text-muted-foreground" />
                            <span className="text-muted-foreground truncate">
                              {patient.reason}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`
                          px-2 py-1 text-xs rounded-full font-medium border
                          ${getStatusColor(patient.status)}
                        `}>
                          {patient.status}
                        </span>

                        {activeTab === 'active' && (
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Icon name="Play" size={12} />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Icon name="MoreHorizontal" size={12} />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Waiting Time for Active Consultations */}
                      {activeTab === 'active' && patient.waitingTime && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Temps d'attente: {patient.waitingTime}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      {activeTab === 'active' && patients.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Icon name="UserPlus" size={14} className="mr-1" />
              Ajouter
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Icon name="RefreshCw" size={14} className="mr-1" />
              Actualiser
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQueue;