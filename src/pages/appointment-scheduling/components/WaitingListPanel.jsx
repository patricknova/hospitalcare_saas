import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WaitingListPanel = ({ onRebookAppointment }) => {
  const [expandedPatient, setExpandedPatient] = useState(null);

  const waitingListPatients = [
    {
      id: 1,
      patientName: 'Sophie Nkomo',
      patientPhone: '+237 6 44 55 66 77',
      requestedDoctor: 'Dr. Martin Kouam',
      requestedService: 'Consultation cardiologie',
      preferredDates: ['2024-01-22', '2024-01-23', '2024-01-24'],
      preferredTimes: ['09:00', '10:00', '14:00'],
      priority: 'high',
      waitingSince: '2024-01-18',
      notes: 'Douleurs thoraciques récurrentes',
      urgency: 'Élevée'
    },
    {
      id: 2,
      patientName: 'Michel Fotso',
      patientPhone: '+237 6 33 22 11 00',
      requestedDoctor: 'Dr. Marie Dubois',
      requestedService: 'Consultation pédiatrie',
      preferredDates: ['2024-01-21', '2024-01-22'],
      preferredTimes: ['08:00', '09:00', '16:00'],
      priority: 'normal',
      waitingSince: '2024-01-17',
      notes: 'Contrôle de routine pour enfant',
      urgency: 'Normale'
    },
    {
      id: 3,
      patientName: 'Élise Mbarga',
      patientPhone: '+237 6 88 99 00 11',
      requestedDoctor: 'Dr. Paul Ngono',
      requestedService: 'Consultation orthopédie',
      preferredDates: ['2024-01-23', '2024-01-24', '2024-01-25'],
      preferredTimes: ['11:00', '15:00'],
      priority: 'urgent',
      waitingSince: '2024-01-19',
      notes: 'Fracture du poignet - suivi',
      urgency: 'Urgente'
    },
    {
      id: 4,
      patientName: 'Robert Kouam',
      patientPhone: '+237 6 77 88 99 00',
      requestedDoctor: 'Dr. Claire Fotso',
      requestedService: 'Échographie',
      preferredDates: ['2024-01-22', '2024-01-23'],
      preferredTimes: ['10:30', '14:30'],
      priority: 'normal',
      waitingSince: '2024-01-16',
      notes: 'Échographie abdominale',
      urgency: 'Normale'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-error bg-error/10 border-error';
      case 'high': return 'text-warning bg-warning/10 border-warning';
      case 'normal': return 'text-primary bg-primary/10 border-primary';
      case 'low': return 'text-muted-foreground bg-muted border-muted-foreground';
      default: return 'text-muted-foreground bg-muted border-muted-foreground';
    }
  };

  const getWaitingDays = (waitingSince) => {
    const today = new Date();
    const waitingDate = new Date(waitingSince);
    const diffTime = Math.abs(today - waitingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRebook = (patient) => {
    onRebookAppointment(patient);
  };

  const handleContactPatient = (patient) => {
    // Handle patient contact logic
    console.log('Contacting patient:', patient.patientName);
  };

  const toggleExpanded = (patientId) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Liste d'attente</h3>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
            {waitingListPatients.length} patients
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Patients en attente de créneaux disponibles
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {waitingListPatients.map((patient) => {
          const isExpanded = expandedPatient === patient.id;
          const waitingDays = getWaitingDays(patient.waitingSince);

          return (
            <div
              key={patient.id}
              className={`
                border border-border rounded-lg p-4 transition-all
                ${patient.priority === 'urgent' ? 'border-l-4 border-l-error bg-error/5' : ''}
                ${patient.priority === 'high' ? 'border-l-4 border-l-warning bg-warning/5' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground">{patient.patientName}</h4>
                    <span className={`
                      px-2 py-1 text-xs rounded-full border
                      ${getPriorityColor(patient.priority)}
                    `}>
                      {patient.urgency}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} />
                      <span>{patient.patientPhone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} />
                      <span>{patient.requestedDoctor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Stethoscope" size={14} />
                      <span>{patient.requestedService}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={14} />
                      <span>En attente depuis {waitingDays} jour{waitingDays > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {patient.notes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <Icon name="FileText" size={14} className="inline mr-1" />
                      {patient.notes}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(patient.id)}
                  className="ml-2"
                >
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Créneaux préférés</h5>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Dates:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.preferredDates.map((date, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                            >
                              {new Date(date).toLocaleDateString('fr-FR')}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Heures:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.preferredTimes.map((time, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRebook(patient)}
                      iconName="Calendar"
                      iconPosition="left"
                    >
                      Programmer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactPatient(patient)}
                      iconName="Phone"
                      iconPosition="left"
                    >
                      Contacter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {waitingListPatients.filter(p => p.priority === 'urgent').length} urgents
          </span>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Actualiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaitingListPanel;