import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarView = ({ 
  selectedDate, 
  viewType, 
  onViewTypeChange, 
  onAppointmentClick, 
  onTimeSlotClick,
  filters 
}) => {
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const calendarRef = useRef(null);

  const doctors = [
    { id: 'dr-martin', name: 'Dr. Martin Kouam', specialty: 'Cardiologie', color: '#0066CC' },
    { id: 'dr-dubois', name: 'Dr. Marie Dubois', specialty: 'Pédiatrie', color: '#00A86B' },
    { id: 'dr-ngono', name: 'Dr. Paul Ngono', specialty: 'Orthopédie', color: '#F59E0B' },
    { id: 'dr-fotso', name: 'Dr. Claire Fotso', specialty: 'Gynécologie', color: '#EF4444' }
  ];

  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const mockAppointments = [
    {
      id: 1,
      patientName: 'Jean Dupont',
      patientPhone: '+237 6 78 90 12 34',
      doctorId: 'dr-martin',
      service: 'Consultation cardiologie',
      time: '09:00',
      duration: 30,
      status: 'confirmed',
      type: 'consultation',
      notes: 'Suivi hypertension'
    },
    {
      id: 2,
      patientName: 'Marie Kouam',
      patientPhone: '+237 6 55 44 33 22',
      doctorId: 'dr-dubois',
      service: 'Vaccination enfant',
      time: '10:30',
      duration: 15,
      status: 'confirmed',
      type: 'vaccination',
      notes: 'Rappel DTC'
    },
    {
      id: 3,
      patientName: 'Paul Mbarga',
      patientPhone: '+237 6 99 88 77 66',
      doctorId: 'dr-ngono',
      service: 'Consultation orthopédie',
      time: '14:00',
      duration: 45,
      status: 'pending',
      type: 'consultation',
      notes: 'Douleur genou'
    },
    {
      id: 4,
      patientName: 'Claire Nkomo',
      patientPhone: '+237 6 11 22 33 44',
      doctorId: 'dr-fotso',
      service: 'Échographie',
      time: '11:00',
      duration: 30,
      status: 'confirmed',
      type: 'examination',
      notes: 'Suivi grossesse'
    },
    {
      id: 5,
      patientName: 'André Biya',
      patientPhone: '+237 6 77 66 55 44',
      doctorId: 'dr-martin',
      service: 'ECG',
      time: '15:30',
      duration: 20,
      status: 'completed',
      type: 'examination',
      notes: 'Contrôle cardiaque'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10 border-l-success text-success';
      case 'pending': return 'bg-warning/10 border-l-warning text-warning';
      case 'completed': return 'bg-primary/10 border-l-primary text-primary';
      case 'cancelled': return 'bg-error/10 border-l-error text-error';
      case 'no-show': return 'bg-muted border-l-muted-foreground text-muted-foreground';
      default: return 'bg-muted border-l-muted-foreground text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'consultation': return 'Stethoscope';
      case 'vaccination': return 'Syringe';
      case 'examination': return 'Search';
      case 'surgery': return 'Scissors';
      default: return 'Calendar';
    }
  };

  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, doctorId, timeSlot) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot(`${doctorId}-${timeSlot}`);
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e, doctorId, timeSlot) => {
    e.preventDefault();
    if (draggedAppointment) {
      // Handle appointment rescheduling logic here
      console.log('Rescheduling appointment:', draggedAppointment.id, 'to', doctorId, timeSlot);
    }
    setDraggedAppointment(null);
    setDragOverSlot(null);
  };

  const filteredAppointments = mockAppointments.filter(appointment => {
    if (filters.doctor && appointment.doctorId !== filters.doctor) return false;
    if (filters.status && appointment.status !== filters.status) return false;
    if (filters.search && !appointment.patientName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getAppointmentForSlot = (doctorId, timeSlot) => {
    return filteredAppointments.find(apt => 
      apt.doctorId === doctorId && apt.time === timeSlot
    );
  };

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            {formatDate(selectedDate)}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewType === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewTypeChange('day')}
            >
              Jour
            </Button>
            <Button
              variant={viewType === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewTypeChange('week')}
            >
              Semaine
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Exporter
          </Button>
          <Button variant="default" size="sm" iconName="Plus">
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto" ref={calendarRef}>
        <div className="min-w-full">
          {/* Doctor Headers */}
          <div className="sticky top-0 bg-card border-b border-border z-10">
            <div className="grid grid-cols-5 gap-px bg-border">
              <div className="bg-card p-3">
                <span className="text-sm font-medium text-muted-foreground">Heure</span>
              </div>
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-card p-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: doctor.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-5 gap-px bg-border">
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot}>
                {/* Time Column */}
                <div className="bg-card p-2 border-r border-border">
                  <span className="text-sm text-muted-foreground">{timeSlot}</span>
                </div>

                {/* Doctor Columns */}
                {doctors.map((doctor) => {
                  const appointment = getAppointmentForSlot(doctor.id, timeSlot);
                  const slotId = `${doctor.id}-${timeSlot}`;
                  const isDragOver = dragOverSlot === slotId;

                  return (
                    <div
                      key={slotId}
                      className={`
                        bg-card p-1 min-h-[60px] border-r border-border cursor-pointer
                        hover:bg-muted/50 transition-colors
                        ${isDragOver ? 'bg-primary/10 border-primary' : ''}
                      `}
                      onClick={() => !appointment && onTimeSlotClick(doctor.id, timeSlot)}
                      onDragOver={(e) => handleDragOver(e, doctor.id, timeSlot)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, doctor.id, timeSlot)}
                    >
                      {appointment && (
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, appointment)}
                          onClick={() => onAppointmentClick(appointment)}
                          className={`
                            p-2 rounded border-l-4 cursor-move hover:shadow-moderate transition-shadow
                            ${getStatusColor(appointment.status)}
                          `}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center space-x-1">
                              <Icon name={getTypeIcon(appointment.type)} size={12} />
                              <span className="text-xs font-medium truncate">
                                {appointment.patientName}
                              </span>
                            </div>
                            <span className="text-xs opacity-75">
                              {appointment.duration}min
                            </span>
                          </div>
                          <p className="text-xs opacity-75 truncate">
                            {appointment.service}
                          </p>
                          {appointment.notes && (
                            <p className="text-xs opacity-60 truncate mt-1">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-xs text-muted-foreground">Confirmé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-xs text-muted-foreground">En attente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-xs text-muted-foreground">Terminé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-xs text-muted-foreground">Annulé</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Glissez-déposez pour reprogrammer • Double-clic pour créer
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;