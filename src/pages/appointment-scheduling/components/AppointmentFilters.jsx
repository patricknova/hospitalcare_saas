import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AppointmentFilters = ({ onFiltersChange, selectedDate, onDateChange }) => {
  const [filters, setFilters] = useState({
    doctor: '',
    service: '',
    status: '',
    search: ''
  });

  const doctorOptions = [
    { value: '', label: 'Tous les médecins' },
    { value: 'dr-martin', label: 'Dr. Martin Kouam' },
    { value: 'dr-dubois', label: 'Dr. Marie Dubois' },
    { value: 'dr-ngono', label: 'Dr. Paul Ngono' },
    { value: 'dr-fotso', label: 'Dr. Claire Fotso' },
    { value: 'dr-biya', label: 'Dr. Jean Biya' }
  ];

  const serviceOptions = [
    { value: '', label: 'Tous les services' },
    { value: 'consultation', label: 'Consultation générale' },
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'pediatrie', label: 'Pédiatrie' },
    { value: 'gynecologie', label: 'Gynécologie' },
    { value: 'dermatologie', label: 'Dermatologie' },
    { value: 'orthopédie', label: 'Orthopédie' },
    { value: 'urgence', label: 'Urgence' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'confirmed', label: 'Confirmé' },
    { value: 'pending', label: 'En attente' },
    { value: 'completed', label: 'Terminé' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'no-show', label: 'Absent' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      doctor: '',
      service: '',
      status: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const generateMiniCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const miniCalendarDays = generateMiniCalendar();
  const today = new Date();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === today.getMonth();
  };

  return (
    <div className="w-full bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-4">Filtres</h3>
        
        {/* Search */}
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Rechercher un patient..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Doctor Filter */}
        <div className="mb-4">
          <Select
            label="Médecin"
            options={doctorOptions}
            value={filters.doctor}
            onChange={(value) => handleFilterChange('doctor', value)}
            className="w-full"
          />
        </div>

        {/* Service Filter */}
        <div className="mb-4">
          <Select
            label="Service"
            options={serviceOptions}
            value={filters.service}
            onChange={(value) => handleFilterChange('service', value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <Select
            label="Statut"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            className="w-full"
          />
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
          iconName="X"
          iconPosition="left"
        >
          Effacer les filtres
        </Button>
      </div>

      {/* Mini Calendar */}
      <div className="p-4">
        <h4 className="font-medium text-foreground mb-3">Calendrier</h4>
        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-sm font-medium text-foreground">
              {monthNames[today.getMonth()]} {today.getFullYear()}
            </h5>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Icon name="ChevronLeft" size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Icon name="ChevronRight" size={14} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
              <div key={day} className="text-xs text-muted-foreground text-center py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {miniCalendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => onDateChange(date)}
                className={`
                  text-xs p-1 rounded hover:bg-muted transition-colors
                  ${isToday(date) ? 'bg-primary text-primary-foreground font-medium' : ''}
                  ${isSelected(date) ? 'bg-accent text-accent-foreground' : ''}
                  ${!isCurrentMonth(date) ? 'text-muted-foreground/50' : 'text-foreground'}
                `}
              >
                {date.getDate()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Statistiques du jour</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total RDV</span>
            <span className="text-sm font-medium text-foreground">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confirmés</span>
            <span className="text-sm font-medium text-success">18</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">En attente</span>
            <span className="text-sm font-medium text-warning">4</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Annulés</span>
            <span className="text-sm font-medium text-error">2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFilters;