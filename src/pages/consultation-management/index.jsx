import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ConsultationTabs from './components/ConsultationTabs';
import PatientQueue from './components/PatientQueue';
import PatientInfoPanel from './components/PatientInfoPanel';
import ClinicalExaminationForm from './components/ClinicalExaminationForm';
import ConsultationHistory from './components/ConsultationHistory';

const ConsultationManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showExaminationForm, setShowExaminationForm] = useState(false);

  // Mock data for different consultation states
  const mockPatients = {
    active: [
      {
        id: 'P001',
        name: 'Jean Dupont',
        age: 45,
        gender: 'Masculin',
        phone: '+237 677 123 456',
        email: 'jean.dupont@email.com',
        address: 'Quartier Bastos, Yaoundé',
        bloodType: 'A+',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        appointmentTime: new Date(Date.now() - 30 * 60 * 1000),
        doctor: 'Dr. Marie Dubois',
        reason: 'Douleurs abdominales persistantes',
        status: 'En cours',
        priority: 'Élevé',
        waitingTime: '45 min',
        vitals: {
          bloodPressure: '140/90',
          temperature: '37.2',
          pulse: '88',
          respiratory: '18',
          lastUpdated: 'Il y a 15 min'
        },
        allergies: [
          { substance: 'Pénicilline', severity: 'Critique', reaction: 'Éruption cutanée sévère' },
          { substance: 'Aspirine', severity: 'Modérée', reaction: 'Troubles digestifs' }
        ],
        currentMedications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: '1 fois/jour', prescribedDate: '2025-01-10' },
          { name: 'Metformine', dosage: '500mg', frequency: '2 fois/jour', prescribedDate: '2025-01-05' }
        ]
      },
      {
        id: 'P002',
        name: 'Marie Kouam',
        age: 32,
        gender: 'Féminin',
        phone: '+237 655 987 654',
        email: 'marie.kouam@email.com',
        address: 'Quartier Mvan, Yaoundé',
        bloodType: 'O-',
        photo: 'https://randomuser.me/api/portraits/women/28.jpg',
        appointmentTime: new Date(Date.now() - 15 * 60 * 1000),
        doctor: 'Dr. Paul Martin',
        reason: 'Contrôle de grossesse',
        status: 'En attente',
        priority: 'Normal',
        waitingTime: '15 min',
        vitals: {
          bloodPressure: '120/80',
          temperature: '36.8',
          pulse: '72',
          respiratory: '16',
          lastUpdated: 'Il y a 5 min'
        },
        allergies: [],
        currentMedications: [
          { name: 'Acide folique', dosage: '5mg', frequency: '1 fois/jour', prescribedDate: '2025-01-12' }
        ]
      },
      {
        id: 'P003',
        name: 'Paul Mbarga',
        age: 58,
        gender: 'Masculin',
        phone: '+237 699 456 789',
        email: 'paul.mbarga@email.com',
        address: 'Quartier Nlongkak, Yaoundé',
        bloodType: 'B+',
        photo: 'https://randomuser.me/api/portraits/men/45.jpg',
        appointmentTime: new Date(Date.now() - 60 * 60 * 1000),
        doctor: 'Dr. Marie Dubois',
        reason: 'Suivi diabète',
        status: 'En cours',
        priority: 'Urgent',
        waitingTime: '1h 15min',
        vitals: {
          bloodPressure: '160/95',
          temperature: '36.9',
          pulse: '95',
          respiratory: '20',
          lastUpdated: 'Il y a 30 min'
        },
        allergies: [
          { substance: 'Iode', severity: 'Légère', reaction: 'Démangeaisons' }
        ],
        currentMedications: [
          { name: 'Metformine', dosage: '1000mg', frequency: '2 fois/jour', prescribedDate: '2025-01-08' },
          { name: 'Gliclazide', dosage: '80mg', frequency: '1 fois/jour', prescribedDate: '2025-01-08' }
        ]
      }
    ],
    completed: [
      {
        id: 'P004',
        name: 'Sophie Nkomo',
        age: 28,
        gender: 'Féminin',
        phone: '+237 677 321 654',
        email: 'sophie.nkomo@email.com',
        address: 'Quartier Essos, Yaoundé',
        bloodType: 'AB+',
        photo: 'https://randomuser.me/api/portraits/women/35.jpg',
        appointmentTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        doctor: 'Dr. Paul Martin',
        reason: 'Consultation dermatologique',
        status: 'Terminé',
        priority: 'Normal',
        vitals: {
          bloodPressure: '115/75',
          temperature: '36.7',
          pulse: '68',
          respiratory: '15',
          lastUpdated: 'Il y a 2h'
        },
        allergies: [],
        currentMedications: []
      }
    ],
    followup: [
      {
        id: 'P005',
        name: 'André Fouda',
        age: 67,
        gender: 'Masculin',
        phone: '+237 655 789 123',
        email: 'andre.fouda@email.com',
        address: 'Quartier Mendong, Yaoundé',
        bloodType: 'A-',
        photo: 'https://randomuser.me/api/portraits/men/55.jpg',
        appointmentTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        doctor: 'Dr. Marie Dubois',
        reason: 'Suivi post-opératoire',
        status: 'Suivi requis',
        priority: 'Élevé',
        vitals: {
          bloodPressure: '135/85',
          temperature: '37.0',
          pulse: '78',
          respiratory: '17',
          lastUpdated: 'Il y a 3h'
        },
        allergies: [
          { substance: 'Morphine', severity: 'Critique', reaction: 'Détresse respiratoire' }
        ],
        currentMedications: [
          { name: 'Paracétamol', dosage: '1000mg', frequency: '3 fois/jour', prescribedDate: '2025-01-15' }
        ]
      }
    ]
  };

  const [patients, setPatients] = useState(mockPatients);

  // Set initial selected patient
  useEffect(() => {
    if (patients[activeTab].length > 0 && !selectedPatient) {
      setSelectedPatient(patients[activeTab][0]);
    }
  }, [activeTab, patients, selectedPatient]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedPatient(null);
    setShowExaminationForm(false);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowExaminationForm(false);
  };

  const handleStartConsultation = () => {
    setShowExaminationForm(true);
  };

  const handleViewHistory = () => {
    setShowHistory(true);
  };

  const handleUpdateVitals = () => {
    // Mock vital signs update
    console.log('Updating vital signs for:', selectedPatient?.name);
  };

  const handleSaveConsultation = (consultationData) => {
    console.log('Saving consultation:', consultationData);
    setShowExaminationForm(false);
    // Here you would typically save to backend and update patient status
  };

  const handleCancelConsultation = () => {
    setShowExaminationForm(false);
  };

  const getCounts = () => ({
    active: patients.active.length,
    completed: patients.completed.length,
    followup: patients.followup.length
  });

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="flex pt-16">
        <PrimarySidebar />
      
        <main className="lg:ml-0">
          <BreadcrumbNavigation />
          
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Gestion des Consultations</h1>
                  <p className="text-muted-foreground mt-1">
                    Gérez les consultations médicales et les examens cliniques
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Tabs */}
            <ConsultationTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={getCounts()}
            />

            {/* Main Content */}
            <div className="mt-6">
              {showExaminationForm ? (
                /* Full-width examination form */
                <ClinicalExaminationForm
                  patient={selectedPatient}
                  onSave={handleSaveConsultation}
                  onCancel={handleCancelConsultation}
                />
              ) : (
                /* Split layout: Patient queue + Patient info */
                <div className="grid grid-cols-12 gap-6 h-[calc(100vh-280px)]">
                  {/* Patient Queue - Left Side (4 columns) */}
                  <div className="col-span-12 lg:col-span-4">
                    <PatientQueue
                      patients={patients[activeTab]}
                      selectedPatient={selectedPatient}
                      onSelectPatient={handleSelectPatient}
                      activeTab={activeTab}
                    />
                  </div>

                  {/* Patient Information Panel - Right Side (8 columns) */}
                  <div className="col-span-12 lg:col-span-8">
                    {selectedPatient ? (
                      <div className="space-y-6">
                        <PatientInfoPanel
                          patient={selectedPatient}
                          onViewHistory={handleViewHistory}
                          onUpdateVitals={handleUpdateVitals}
                        />
                        
                        {/* Quick Actions */}
                        {activeTab === 'active' && (
                          <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-foreground">Actions Rapides</h3>
                                <p className="text-sm text-muted-foreground">
                                  Démarrer ou gérer la consultation
                                </p>
                              </div>
                              
                              <div className="flex space-x-3">
                                <button
                                  onClick={handleStartConsultation}
                                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                                >
                                  <span>Démarrer Consultation</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full bg-card border border-border rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">👨‍⚕️</span>
                          </div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            Sélectionnez un Patient
                          </h3>
                          <p className="text-muted-foreground">
                            Choisissez un patient dans la liste pour voir ses informations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {/* Consultation History Modal */}
      {showHistory && selectedPatient && (
        <ConsultationHistory
          patient={selectedPatient}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
};

export default ConsultationManagement;