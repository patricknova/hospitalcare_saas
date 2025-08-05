import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PatientSearchFilters from './components/PatientSearchFilters';
import PatientTable from './components/PatientTable';
import PatientStatistics from './components/PatientStatistics';
import NewPatientModal from './components/NewPatientModal';
import PatientProfileSlideOver from './components/PatientProfileSlideOver';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock patient data
  useEffect(() => {
    const mockPatients = [
      {
        id: "1",
        firstName: "Jean",
        lastName: "Dupont",
        medicalRecordNumber: "MR001234",
        dateOfBirth: "1985-03-15",
        age: 39,
        gender: "male",
        bloodType: "A+",
        phone: "+237 677 123 456",
        email: "jean.dupont@email.com",
        address: "Quartier Bastos, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Marie Dupont",
        emergencyContactPhone: "+237 677 654 321",
        emergencyContactRelation: "conjoint",
        allergies: ["Pénicilline", "Arachides"],
        chronicConditions: ["Hypertension"],
        assignedDoctor: "Dr. Jean Martin",
        status: "active",
        lastVisit: "2024-01-15T10:30:00Z",
        registrationDate: "2023-05-10T08:00:00Z",
        photo: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        id: "2",
        firstName: "Marie",
        lastName: "Kouam",
        medicalRecordNumber: "MR001235",
        dateOfBirth: "1992-07-22",
        age: 32,
        gender: "female",
        bloodType: "O-",
        phone: "+237 655 987 654",
        email: "marie.kouam@email.com",
        address: "Quartier Mvog-Ada, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Paul Kouam",
        emergencyContactPhone: "+237 655 123 789",
        emergencyContactRelation: "frere-soeur",
        allergies: ["Latex"],
        chronicConditions: ["Diabète"],
        assignedDoctor: "Dr. Marie Kouam",
        status: "hospitalized",
        lastVisit: "2024-01-18T14:15:00Z",
        registrationDate: "2023-08-20T09:30:00Z",
        photo: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        id: "3",
        firstName: "Paul",
        lastName: "Mbarga",
        medicalRecordNumber: "MR001236",
        dateOfBirth: "1978-11-08",
        age: 45,
        gender: "male",
        bloodType: "B+",
        phone: "+237 699 456 789",
        email: "paul.mbarga@email.com",
        address: "Quartier Nlongkak, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Claire Mbarga",
        emergencyContactPhone: "+237 699 789 456",
        emergencyContactRelation: "conjoint",
        allergies: [],
        chronicConditions: ["Asthme", "Arthrite"],
        assignedDoctor: "Dr. Paul Ngono",
        status: "active",
        lastVisit: "2024-01-12T16:45:00Z",
        registrationDate: "2023-03-15T11:20:00Z",
        photo: "https://randomuser.me/api/portraits/men/3.jpg"
      },
      {
        id: "4",
        firstName: "Claire",
        lastName: "Fouda",
        medicalRecordNumber: "MR001237",
        dateOfBirth: "2010-04-30",
        age: 14,
        gender: "female",
        bloodType: "AB+",
        phone: "+237 677 321 654",
        email: "",
        address: "Quartier Essos, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "André Fouda",
        emergencyContactPhone: "+237 677 654 987",
        emergencyContactRelation: "parent",
        allergies: ["Fruits de mer"],
        chronicConditions: [],
        assignedDoctor: "Dr. Claire Mbarga",
        status: "active",
        lastVisit: "2024-01-10T09:00:00Z",
        registrationDate: "2023-09-05T14:30:00Z",
        photo: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      {
        id: "5",
        firstName: "André",
        lastName: "Ngono",
        medicalRecordNumber: "MR001238",
        dateOfBirth: "1965-12-12",
        age: 59,
        gender: "male",
        bloodType: "O+",
        phone: "+237 655 789 123",
        email: "andre.ngono@email.com",
        address: "Quartier Melen, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Sylvie Ngono",
        emergencyContactPhone: "+237 655 456 789",
        emergencyContactRelation: "conjoint",
        allergies: ["Aspirine"],
        chronicConditions: ["Hypertension", "Cholestérol élevé"],
        assignedDoctor: "Dr. André Fouda",
        status: "discharged",
        lastVisit: "2024-01-08T11:30:00Z",
        registrationDate: "2023-01-20T10:15:00Z",
        photo: "https://randomuser.me/api/portraits/men/5.jpg"
      },
      {
        id: "6",
        firstName: "Sylvie",
        lastName: "Biya",
        medicalRecordNumber: "MR001239",
        dateOfBirth: "1988-09-18",
        age: 36,
        gender: "female",
        bloodType: "A-",
        phone: "+237 699 147 258",
        email: "sylvie.biya@email.com",
        address: "Quartier Omnisport, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Michel Biya",
        emergencyContactPhone: "+237 699 852 741",
        emergencyContactRelation: "conjoint",
        allergies: ["Pollen"],
        chronicConditions: ["Migraine"],
        assignedDoctor: "Dr. Jean Martin",
        status: "active",
        lastVisit: "2024-01-19T08:45:00Z",
        registrationDate: "2023-06-12T13:45:00Z",
        photo: "https://randomuser.me/api/portraits/women/6.jpg"
      },
      {
        id: "7",
        firstName: "Michel",
        lastName: "Etoa",
        medicalRecordNumber: "MR001240",
        dateOfBirth: "1995-01-25",
        age: 29,
        gender: "male",
        bloodType: "B-",
        phone: "+237 677 963 852",
        email: "michel.etoa@email.com",
        address: "Quartier Emombo, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Jeanne Etoa",
        emergencyContactPhone: "+237 677 258 741",
        emergencyContactRelation: "parent",
        allergies: [],
        chronicConditions: [],
        assignedDoctor: "Dr. Marie Kouam",
        status: "active",
        lastVisit: "2024-01-17T15:20:00Z",
        registrationDate: "2023-11-08T16:00:00Z",
        photo: "https://randomuser.me/api/portraits/men/7.jpg"
      },
      {
        id: "8",
        firstName: "Jeanne",
        lastName: "Muna",
        medicalRecordNumber: "MR001241",
        dateOfBirth: "1972-06-03",
        age: 52,
        gender: "female",
        bloodType: "AB-",
        phone: "+237 655 741 963",
        email: "jeanne.muna@email.com",
        address: "Quartier Djoungolo, Yaoundé",
        city: "Yaoundé",
        region: "centre",
        emergencyContactName: "Robert Muna",
        emergencyContactPhone: "+237 655 369 852",
        emergencyContactRelation: "conjoint",
        allergies: ["Iode"],
        chronicConditions: ["Dépression", "Anxiété"],
        assignedDoctor: "Dr. Paul Ngono",
        status: "inactive",
        lastVisit: "2023-12-20T10:15:00Z",
        registrationDate: "2023-02-28T09:45:00Z",
        photo: "https://randomuser.me/api/portraits/women/8.jpg"
      }
    ];

    setTimeout(() => {
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredPatients(patients);
  };

  const applyFilters = (filterValues) => {
    let filtered = [...patients];

    // Search term filter
    if (filterValues.searchTerm) {
      const searchLower = filterValues.searchTerm.toLowerCase();
      filtered = filtered.filter(patient => 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchLower) ||
        patient.phone.includes(searchLower) ||
        patient.medicalRecordNumber.toLowerCase().includes(searchLower) ||
        (patient.email && patient.email.toLowerCase().includes(searchLower))
      );
    }

    // Blood type filter
    if (filterValues.bloodType) {
      filtered = filtered.filter(patient => patient.bloodType === filterValues.bloodType);
    }

    // Gender filter
    if (filterValues.gender) {
      filtered = filtered.filter(patient => patient.gender === filterValues.gender);
    }

    // Age range filter
    if (filterValues.ageRange) {
      const [minAge, maxAge] = filterValues.ageRange.split('-').map(age => 
        age.includes('+') ? parseInt(age) : parseInt(age)
      );
      filtered = filtered.filter(patient => {
        if (filterValues.ageRange.includes('+')) {
          return patient.age >= minAge;
        }
        return patient.age >= minAge && patient.age <= maxAge;
      });
    }

    // Last visit filter
    if (filterValues.lastVisitRange) {
      const now = new Date();
      filtered = filtered.filter(patient => {
        const visitDate = new Date(patient.lastVisit);
        switch (filterValues.lastVisitRange) {
          case 'today':
            return visitDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return visitDate >= weekAgo;
          case 'month':
            return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
          case '3months':
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            return visitDate >= threeMonthsAgo;
          case '6months':
            const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            return visitDate >= sixMonthsAgo;
          case 'year':
            return visitDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Assigned doctor filter
    if (filterValues.assignedDoctor) {
      filtered = filtered.filter(patient => patient.assignedDoctor.includes(filterValues.assignedDoctor));
    }

    // Status filter
    if (filterValues.status) {
      filtered = filtered.filter(patient => patient.status === filterValues.status);
    }

    setFilteredPatients(filtered);
  };

  const handleNewPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: Date.now().toString(),
      medicalRecordNumber: `MR${Date.now().toString().slice(-6)}`,
      registrationDate: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${patientData.firstName}${patientData.lastName}`
    };
    
    const updatedPatients = [newPatient, ...patients];
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientProfile(true);
  };

  const handleEditPatient = (patient) => {
    // In a real app, this would open an edit modal
    console.log('Edit patient:', patient);
  };

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    setShowPatientProfile(true);
  };

  const handleScheduleAppointment = (patient) => {
    // In a real app, this would navigate to appointment scheduling
    console.log('Schedule appointment for:', patient);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="flex pt-16">
        <PrimarySidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Chargement des patients...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="flex">
        <PrimarySidebar />
        
        <div className="flex-1">
          <BreadcrumbNavigation />
          
          {/* Main Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestion des Patients</h1>
                <p className="text-muted-foreground">
                  Gérez les dossiers patients, historiques médicaux et informations personnelles
                </p>
              </div>
              <Button onClick={() => setShowNewPatientModal(true)}>
                <Icon name="UserPlus" size={20} className="mr-2" />
                Nouveau Patient
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold text-primary">{patients.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="Users" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patients Actifs</p>
                    <p className="text-2xl font-bold text-success">
                      {patients.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-success/10">
                    <Icon name="UserCheck" size={24} className="text-success" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hospitalisés</p>
                    <p className="text-2xl font-bold text-warning">
                      {patients.filter(p => p.status === 'hospitalized').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-warning/10">
                    <Icon name="Bed" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nouveaux ce mois</p>
                    <p className="text-2xl font-bold text-accent">
                      {patients.filter(p => {
                        const regDate = new Date(p.registrationDate);
                        const now = new Date();
                        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-accent/10">
                    <Icon name="UserPlus" size={24} className="text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Search Filters - Left Panel */}
              <div className="lg:col-span-3">
                <PatientSearchFilters
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Patient Table - Center Panel */}
              <div className="lg:col-span-6">
                <PatientTable
                  patients={filteredPatients}
                  onPatientSelect={handlePatientSelect}
                  onEditPatient={handleEditPatient}
                  onViewProfile={handleViewProfile}
                  onScheduleAppointment={handleScheduleAppointment}
                />
              </div>

              {/* Statistics - Right Panel */}
              <div className="lg:col-span-3">
                <PatientStatistics patients={patients} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
        onSave={handleNewPatient}
      />

      <PatientProfileSlideOver
        patient={selectedPatient}
        isOpen={showPatientProfile}
        onClose={() => setShowPatientProfile(false)}
        onEdit={handleEditPatient}
        onScheduleAppointment={handleScheduleAppointment}
      />
    </div>
  );
};

export default PatientManagement;