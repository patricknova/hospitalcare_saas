import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayAgenda = () => {
  const currentTime = new Date();
  const todayAppointments = [
    {
      id: 1,
      time: '09:00',
      patient: 'Mme Kouam Marie',
      doctor: 'Dr. Mbarga Jean',
      service: 'Cardiologie',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: 2,
      time: '10:30',
      patient: 'M. Nkomo Paul',
      doctor: 'Dr. Fotso Claire',
      service: 'Médecine Générale',
      status: 'in-progress',
      type: 'consultation'
    },
    {
      id: 3,
      time: '11:15',
      patient: 'Mlle Biya Sandra',
      doctor: 'Dr. Kamga Pierre',
      service: 'Pédiatrie',
      status: 'waiting',
      type: 'consultation'
    },
    {
      id: 4,
      time: '14:00',
      patient: 'M. Tchoumi André',
      doctor: 'Dr. Mbarga Jean',
      service: 'Cardiologie',
      status: 'confirmed',
      type: 'follow-up'
    },
    {
      id: 5,
      time: '15:30',
      patient: 'Mme Ngono Françoise',
      doctor: 'Dr. Fotso Claire',
      service: 'Gynécologie',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: 6,
      time: '16:45',
      patient: 'M. Owona Michel',
      doctor: 'Dr. Kamga Pierre',
      service: 'Médecine Générale',
      status: 'pending',
      type: 'consultation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'waiting':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'pending':
        return 'bg-muted/10 text-muted-foreground border-border';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'in-progress':
        return 'En cours';
      case 'waiting':
        return 'En attente';
      case 'pending':
        return 'À confirmer';
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation':
        return 'Stethoscope';
      case 'follow-up':
        return 'RotateCcw';
      default:
        return 'Calendar';
    }
  };

  const isCurrentAppointment = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const appointmentTime = new Date();
    appointmentTime.setHours(hours, minutes, 0, 0);
    
    const timeDiff = Math.abs(currentTime - appointmentTime);
    return timeDiff <= 30 * 60 * 1000; // Within 30 minutes
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Agenda d'Aujourd'hui</h3>
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {todayAppointments.length} rendez-vous programmés
        </p>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {todayAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${
              isCurrentAppointment(appointment.time) ? 'bg-primary/5 border-l-4 border-l-primary' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-foreground">{appointment.time}</div>
                <div className={`mt-2 p-1.5 rounded-full border ${getStatusColor(appointment.status)}`}>
                  <Icon name={getTypeIcon(appointment.type)} size={14} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{appointment.patient}</h4>
                    <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appointment.service}</p>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded-full border font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                
                {isCurrentAppointment(appointment.time) && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Icon name="Clock" size={14} className="text-primary" />
                    <span className="text-xs text-primary font-medium">Rendez-vous imminent</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" size="sm" className="w-full">
          <Icon name="CalendarPlus" size={16} className="mr-2" />
          Nouveau Rendez-vous
        </Button>
        <Button variant="ghost" size="sm" className="w-full">
          <Icon name="Calendar" size={16} className="mr-2" />
          Voir Planning Complet
        </Button>
      </div>
    </div>
  );
};

export default TodayAgenda;