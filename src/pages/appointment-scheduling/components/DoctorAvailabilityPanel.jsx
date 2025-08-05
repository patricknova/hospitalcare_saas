import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DoctorAvailabilityPanel = ({ selectedDate, onAvailabilityChange }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('dr-martin');
  const [editingSlot, setEditingSlot] = useState(null);

  const doctors = [
    { value: 'dr-martin', label: 'Dr. Martin Kouam', specialty: 'Cardiologie' },
    { value: 'dr-dubois', label: 'Dr. Marie Dubois', specialty: 'Pédiatrie' },
    { value: 'dr-ngono', label: 'Dr. Paul Ngono', specialty: 'Orthopédie' },
    { value: 'dr-fotso', label: 'Dr. Claire Fotso', specialty: 'Gynécologie' }
  ];

  const mockAvailability = {
    'dr-martin': {
      workingHours: { start: '08:00', end: '17:00' },
      breaks: [
        { start: '12:00', end: '13:00', type: 'lunch', label: 'Pause déjeuner' }
      ],
      unavailable: [
        { start: '15:00', end: '16:00', type: 'meeting', label: 'Réunion équipe' }
      ],
      consultationDuration: 30,
      maxConsultationsPerDay: 16
    },
    'dr-dubois': {
      workingHours: { start: '08:30', end: '16:30' },
      breaks: [
        { start: '12:30', end: '13:30', type: 'lunch', label: 'Pause déjeuner' }
      ],
      unavailable: [
        { start: '10:00', end: '11:00', type: 'surgery', label: 'Intervention' }
      ],
      consultationDuration: 20,
      maxConsultationsPerDay: 20
    },
    'dr-ngono': {
      workingHours: { start: '09:00', end: '18:00' },
      breaks: [
        { start: '13:00', end: '14:00', type: 'lunch', label: 'Pause déjeuner' }
      ],
      unavailable: [],
      consultationDuration: 45,
      maxConsultationsPerDay: 12
    },
    'dr-fotso': {
      workingHours: { start: '08:00', end: '16:00' },
      breaks: [
        { start: '12:00', end: '13:00', type: 'lunch', label: 'Pause déjeuner' }
      ],
      unavailable: [
        { start: '14:00', end: '15:00', type: 'conference', label: 'Conférence' }
      ],
      consultationDuration: 30,
      maxConsultationsPerDay: 14
    }
  };

  const currentAvailability = mockAvailability[selectedDoctor];

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = parseInt(currentAvailability.workingHours.start.split(':')[0]);
    const endHour = parseInt(currentAvailability.workingHours.end.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const isSlotUnavailable = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const slotMinutes = hour * 60 + minute;

    // Check breaks
    for (const breakSlot of currentAvailability.breaks) {
      const [breakStartHour, breakStartMinute] = breakSlot.start.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = breakSlot.end.split(':').map(Number);
      const breakStart = breakStartHour * 60 + breakStartMinute;
      const breakEnd = breakEndHour * 60 + breakEndMinute;

      if (slotMinutes >= breakStart && slotMinutes < breakEnd) {
        return { type: 'break', label: breakSlot.label };
      }
    }

    // Check unavailable slots
    for (const unavailableSlot of currentAvailability.unavailable) {
      const [unavailableStartHour, unavailableStartMinute] = unavailableSlot.start.split(':').map(Number);
      const [unavailableEndHour, unavailableEndMinute] = unavailableSlot.end.split(':').map(Number);
      const unavailableStart = unavailableStartHour * 60 + unavailableStartMinute;
      const unavailableEnd = unavailableEndHour * 60 + unavailableEndMinute;

      if (slotMinutes >= unavailableStart && slotMinutes < unavailableEnd) {
        return { type: 'unavailable', label: unavailableSlot.label };
      }
    }

    return null;
  };

  const getSlotStatus = (time) => {
    const unavailable = isSlotUnavailable(time);
    if (unavailable) return unavailable;
    
    // Mock some booked slots
    const bookedSlots = ['09:00', '10:30', '14:00', '15:30'];
    if (bookedSlots.includes(time)) {
      return { type: 'booked', label: 'Occupé' };
    }

    return { type: 'available', label: 'Disponible' };
  };

  const getSlotColor = (status) => {
    switch (status.type) {
      case 'available': return 'bg-success/10 border-success text-success hover:bg-success/20';
      case 'booked': return 'bg-primary/10 border-primary text-primary';
      case 'break': return 'bg-warning/10 border-warning text-warning';
      case 'unavailable': return 'bg-error/10 border-error text-error';
      default: return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  const handleSlotClick = (time, status) => {
    if (status.type === 'available') {
      setEditingSlot(time);
    }
  };

  const handleMarkUnavailable = (time) => {
    // Handle marking slot as unavailable
    console.log('Marking slot unavailable:', time);
    setEditingSlot(null);
  };

  const handleAddBreak = (time) => {
    // Handle adding break
    console.log('Adding break at:', time);
    setEditingSlot(null);
  };

  const selectedDoctorInfo = doctors.find(d => d.value === selectedDoctor);

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-4">Disponibilité médecin</h3>
        
        <Select
          label="Sélectionner un médecin"
          options={doctors}
          value={selectedDoctor}
          onChange={setSelectedDoctor}
          className="mb-4"
        />

        {selectedDoctorInfo && (
          <div className="bg-muted rounded-lg p-3">
            <h4 className="font-medium text-foreground">{selectedDoctorInfo.label}</h4>
            <p className="text-sm text-muted-foreground">{selectedDoctorInfo.specialty}</p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div>Horaires: {currentAvailability.workingHours.start} - {currentAvailability.workingHours.end}</div>
              <div>Durée consultation: {currentAvailability.consultationDuration} min</div>
              <div>Max consultations/jour: {currentAvailability.maxConsultationsPerDay}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-foreground mb-3">
            Créneaux - {selectedDate.toLocaleDateString('fr-FR')}
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((time) => {
              const status = getSlotStatus(time);
              
              return (
                <button
                  key={time}
                  onClick={() => handleSlotClick(time, status)}
                  className={`
                    p-2 rounded border text-sm font-medium transition-colors
                    ${getSlotColor(status)}
                    ${status.type === 'available' ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  disabled={status.type !== 'available'}
                >
                  <div className="flex items-center justify-between">
                    <span>{time}</span>
                    {status.type === 'booked' && (
                      <Icon name="User" size={12} />
                    )}
                    {status.type === 'break' && (
                      <Icon name="Coffee" size={12} />
                    )}
                    {status.type === 'unavailable' && (
                      <Icon name="X" size={12} />
                    )}
                    {status.type === 'available' && (
                      <Icon name="Plus" size={12} />
                    )}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {status.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <h5 className="text-sm font-medium text-foreground mb-3">Légende</h5>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-xs text-muted-foreground">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-xs text-muted-foreground">Occupé</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-xs text-muted-foreground">Pause</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-xs text-muted-foreground">Indisponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" iconName="Clock">
            Modifier les horaires
          </Button>
          <Button variant="outline" size="sm" className="w-full" iconName="Coffee">
            Ajouter une pause
          </Button>
          <Button variant="outline" size="sm" className="w-full" iconName="X">
            Marquer indisponible
          </Button>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100">
          <div className="bg-popover rounded-lg shadow-prominent p-6 w-full max-w-md">
            <h3 className="font-semibold text-popover-foreground mb-4">
              Modifier le créneau {editingSlot}
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleMarkUnavailable(editingSlot)}
                className="w-full"
                iconName="X"
                iconPosition="left"
              >
                Marquer indisponible
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAddBreak(editingSlot)}
                className="w-full"
                iconName="Coffee"
                iconPosition="left"
              >
                Ajouter une pause
              </Button>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingSlot(null)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailabilityPanel;