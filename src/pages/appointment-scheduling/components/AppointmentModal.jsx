import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentModal = ({ 
  isOpen, 
  onClose, 
  appointment = null, 
  selectedDoctor = null, 
  selectedTime = null,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    patientName: appointment?.patientName || '',
    patientPhone: appointment?.patientPhone || '',
    patientEmail: appointment?.patientEmail || '',
    doctorId: appointment?.doctorId || selectedDoctor || '',
    service: appointment?.service || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || selectedTime || '',
    duration: appointment?.duration || 30,
    notes: appointment?.notes || '',
    reminderSms: appointment?.reminderSms || true,
    reminderEmail: appointment?.reminderEmail || false,
    priority: appointment?.priority || 'normal'
  });

  const [searchResults, setSearchResults] = useState([]);
  const [showPatientSearch, setShowPatientSearch] = useState(false);

  const doctorOptions = [
    { value: 'dr-martin', label: 'Dr. Martin Kouam - Cardiologie' },
    { value: 'dr-dubois', label: 'Dr. Marie Dubois - Pédiatrie' },
    { value: 'dr-ngono', label: 'Dr. Paul Ngono - Orthopédie' },
    { value: 'dr-fotso', label: 'Dr. Claire Fotso - Gynécologie' },
    { value: 'dr-biya', label: 'Dr. Jean Biya - Médecine générale' }
  ];

  const serviceOptions = [
    { value: 'consultation', label: 'Consultation générale' },
    { value: 'consultation-cardiologie', label: 'Consultation cardiologie' },
    { value: 'consultation-pediatrie', label: 'Consultation pédiatrie' },
    { value: 'consultation-gynecologie', label: 'Consultation gynécologie' },
    { value: 'consultation-orthopédie', label: 'Consultation orthopédie' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'echographie', label: 'Échographie' },
    { value: 'ecg', label: 'Électrocardiogramme' },
    { value: 'radiographie', label: 'Radiographie' },
    { value: 'analyse-sang', label: 'Analyse de sang' },
    { value: 'suivi', label: 'Suivi médical' },
    { value: 'urgence', label: 'Consultation d\'urgence' }
  ];

  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 heures' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Faible' },
    { value: 'normal', label: 'Normale' },
    { value: 'high', label: 'Élevée' },
    { value: 'urgent', label: 'Urgente' }
  ];

  const mockPatients = [
    {
      id: 1,
      name: 'Jean Dupont',
      phone: '+237 6 78 90 12 34',
      email: 'jean.dupont@email.com',
      lastVisit: '2024-01-15'
    },
    {
      id: 2,
      name: 'Marie Kouam',
      phone: '+237 6 55 44 33 22',
      email: 'marie.kouam@email.com',
      lastVisit: '2024-01-10'
    },
    {
      id: 3,
      name: 'Paul Mbarga',
      phone: '+237 6 99 88 77 66',
      email: 'paul.mbarga@email.com',
      lastVisit: '2024-01-08'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Patient search functionality
    if (field === 'patientName' && value.length > 2) {
      const results = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
      setShowPatientSearch(results.length > 0);
    } else if (field === 'patientName' && value.length <= 2) {
      setShowPatientSearch(false);
    }
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientPhone: patient.phone,
      patientEmail: patient.email
    }));
    setShowPatientSearch(false);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push({ value: `${hour.toString().padStart(2, '0')}:00`, label: `${hour.toString().padStart(2, '0')}:00` });
      slots.push({ value: `${hour.toString().padStart(2, '0')}:30`, label: `${hour.toString().padStart(2, '0')}:30` });
    }
    return slots;
  };

  const timeSlotOptions = generateTimeSlots();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100 p-4">
      <div className="bg-popover rounded-lg shadow-prominent w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-popover-foreground">
            {appointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-popover-foreground">Informations patient</h4>
            
            <div className="relative">
              <Input
                label="Nom du patient"
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                placeholder="Rechercher ou saisir le nom"
              />
              
              {showPatientSearch && (
                <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-moderate z-10 mt-1">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => selectPatient(patient)}
                      className="w-full p-3 text-left hover:bg-muted border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-popover-foreground">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">{patient.phone}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Téléphone"
                type="tel"
                required
                value={formData.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                placeholder="+237 6 XX XX XX XX"
              />
              <Input
                label="Email (optionnel)"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                placeholder="patient@email.com"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-popover-foreground">Détails du rendez-vous</h4>
            
            <Select
              label="Médecin"
              required
              options={doctorOptions}
              value={formData.doctorId}
              onChange={(value) => handleInputChange('doctorId', value)}
            />

            <Select
              label="Service"
              required
              options={serviceOptions}
              value={formData.service}
              onChange={(value) => handleInputChange('service', value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
              <Select
                label="Heure"
                required
                options={timeSlotOptions}
                value={formData.time}
                onChange={(value) => handleInputChange('time', value)}
              />
              <Select
                label="Durée"
                required
                options={durationOptions}
                value={formData.duration}
                onChange={(value) => handleInputChange('duration', value)}
              />
            </div>

            <Select
              label="Priorité"
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
            />

            <Input
              label="Notes (optionnel)"
              type="text"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes additionnelles..."
            />
          </div>

          {/* Reminders */}
          <div className="space-y-4">
            <h4 className="font-medium text-popover-foreground">Rappels</h4>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.reminderSms}
                  onChange={(e) => handleInputChange('reminderSms', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-popover-foreground">Rappel SMS</span>
                  <p className="text-xs text-muted-foreground">Envoyer un SMS 24h avant le RDV</p>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.reminderEmail}
                  onChange={(e) => handleInputChange('reminderEmail', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-medium text-popover-foreground">Rappel Email</span>
                  <p className="text-xs text-muted-foreground">Envoyer un email 2h avant le RDV</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="default">
              {appointment ? 'Modifier' : 'Créer'} le rendez-vous
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;