import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AppointmentFilters from './components/AppointmentFilters';
import CalendarView from './components/CalendarView';
import AppointmentModal from './components/AppointmentModal';
import WaitingListPanel from './components/WaitingListPanel';
import DoctorAvailabilityPanel from './components/DoctorAvailabilityPanel';

const AppointmentScheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewType, setViewType] = useState('day');
  const [filters, setFilters] = useState({
    doctor: '',
    service: '',
    status: '',
    search: ''
  });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rightPanelView, setRightPanelView] = useState('waiting'); // 'waiting' or 'availability'
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleTimeSlotClick = (doctorId, timeSlot) => {
    setSelectedDoctor(doctorId);
    setSelectedTimeSlot(timeSlot);
    setSelectedAppointment(null);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSave = (appointmentData) => {
    // Handle appointment save logic
    console.log('Saving appointment:', appointmentData);
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
    setSelectedTimeSlot(null);
    setSelectedDoctor(null);
  };

  const handleRebookAppointment = (patient) => {
    // Handle rebooking from waiting list
    console.log('Rebooking appointment for:', patient.patientName);
    setShowAppointmentModal(true);
  };

  const handleAvailabilityChange = (doctorId, availability) => {
    // Handle doctor availability changes
    console.log('Availability changed for:', doctorId, availability);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <PrimarySidebar />
        <BreadcrumbNavigation />
        
        <main className="pt-32 pb-6 px-4">
          <div className="max-w-md mx-auto space-y-6">
            {/* Mobile Header */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-foreground">Rendez-vous</h1>
                <Button variant="default" size="sm" iconName="Plus">
                  Nouveau
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {selectedDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>
            </div>

            {/* Mobile Appointment List */}
            <div className="space-y-3">
              {[
                {
                  time: '09:00',
                  patient: 'Jean Dupont',
                  doctor: 'Dr. Martin Kouam',
                  service: 'Cardiologie',
                  status: 'confirmed'
                },
                {
                  time: '10:30',
                  patient: 'Marie Kouam',
                  doctor: 'Dr. Marie Dubois',
                  service: 'Pédiatrie',
                  status: 'confirmed'
                },
                {
                  time: '14:00',
                  patient: 'Paul Mbarga',
                  doctor: 'Dr. Paul Ngono',
                  service: 'Orthopédie',
                  status: 'pending'
                }
              ].map((appointment, index) => (
                <div key={index} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-primary">{appointment.time}</span>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${appointment.status === 'confirmed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                    `}>
                      {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{appointment.patient}</h3>
                  <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                  <p className="text-sm text-muted-foreground">{appointment.service}</p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="outline" size="sm" iconName="Edit">
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Phone">
                      Appeler
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Quick Actions */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-medium text-foreground mb-3">Actions rapides</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" iconName="Calendar">
                  Voir semaine
                </Button>
                <Button variant="outline" size="sm" iconName="Users">
                  Liste d'attente
                </Button>
                <Button variant="outline" size="sm" iconName="Clock">
                  Disponibilités
                </Button>
                <Button variant="outline" size="sm" iconName="Download">
                  Exporter
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Appointment Modal */}
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          appointment={selectedAppointment}
          selectedDoctor={selectedDoctor}
          selectedTime={selectedTimeSlot}
          onSave={handleAppointmentSave}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="flex pt-16">
        <PrimarySidebar />
        
      
        <main className="flex-1">
          <BreadcrumbNavigation />
          <div className="grid grid-cols-12 gap-6 px-6 h-[calc(100vh-8rem)]">
            {/* Left Sidebar - Filters */}
            <div className="col-span-3">
              <AppointmentFilters
                onFiltersChange={handleFiltersChange}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
              />
            </div>

            {/* Main Calendar Area */}
            <div className="col-span-6">
              <div className="bg-card rounded-lg border border-border h-full flex flex-col">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
                      <Icon name="ChevronLeft" size={20} />
                    </Button>
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => navigateDate('next')}>
                      <Icon name="ChevronRight" size={20} />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Aujourd'hui
                    </Button>
                    <Button
                      variant={viewType === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleViewTypeChange('day')}
                    >
                      Jour
                    </Button>
                    <Button
                      variant={viewType === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleViewTypeChange('week')}
                    >
                      Semaine
                    </Button>
                  </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1">
                  <CalendarView
                    selectedDate={selectedDate}
                    viewType={viewType}
                    onViewTypeChange={handleViewTypeChange}
                    onAppointmentClick={handleAppointmentClick}
                    onTimeSlotClick={handleTimeSlotClick}
                    filters={filters}
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar - Waiting List / Availability */}
            <div className="col-span-3">
              <div className="space-y-4 h-full flex flex-col">
                {/* Panel Toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={rightPanelView === 'waiting' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelView('waiting')}
                    className="flex-1"
                  >
                    Liste d'attente
                  </Button>
                  <Button
                    variant={rightPanelView === 'availability' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setRightPanelView('availability')}
                    className="flex-1"
                  >
                    Disponibilités
                  </Button>
                </div>

                {/* Panel Content */}
                <div className="flex-1">
                  {rightPanelView === 'waiting' ? (
                    <WaitingListPanel onRebookAppointment={handleRebookAppointment} />
                  ) : (
                    <DoctorAvailabilityPanel
                      selectedDate={selectedDate}
                      onAvailabilityChange={handleAvailabilityChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedAppointment(null);
          setSelectedTimeSlot(null);
          setSelectedDoctor(null);
        }}
        appointment={selectedAppointment}
        selectedDoctor={selectedDoctor}
        selectedTime={selectedTimeSlot}
        onSave={handleAppointmentSave}
      />
    </div>
  );
};

export default AppointmentScheduling;