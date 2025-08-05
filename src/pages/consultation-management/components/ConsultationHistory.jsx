import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConsultationHistory = ({ patient, onClose }) => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const consultationHistory = [
    {
      id: 1,
      date: '2025-01-15',
      time: '14:30',
      doctor: 'Dr. Marie Dubois',
      specialty: 'Médecine Générale',
      chiefComplaint: 'Douleurs abdominales',
      diagnosis: 'Gastrite aiguë',
      icd10: 'K29.1',
      prescriptions: [
        { medication: 'Oméprazole', dosage: '20mg', frequency: '1 fois/jour', duration: '14 jours' },
        { medication: 'Antispasmodique', dosage: '40mg', frequency: '3 fois/jour', duration: '7 jours' }
      ],
      labResults: [
        { test: 'NFS', result: 'Normal', date: '2025-01-16' }
      ],
      followUp: '2025-01-29',
      status: 'Terminé'
    },
    {
      id: 2,
      date: '2025-01-08',
      time: '10:15',
      doctor: 'Dr. Paul Martin',
      specialty: 'Cardiologie',
      chiefComplaint: 'Palpitations',
      diagnosis: 'Arythmie sinusale',
      icd10: 'I49.9',
      prescriptions: [
        { medication: 'Bêta-bloquant', dosage: '25mg', frequency: '2 fois/jour', duration: '30 jours' }
      ],
      labResults: [
        { test: 'ECG', result: 'Arythmie légère', date: '2025-01-08' },
        { test: 'Troponines', result: 'Négatives', date: '2025-01-08' }
      ],
      followUp: '2025-02-08',
      status: 'Suivi requis'
    },
    {
      id: 3,
      date: '2024-12-20',
      time: '16:45',
      doctor: 'Dr. Marie Dubois',
      specialty: 'Médecine Générale',
      chiefComplaint: 'Contrôle de routine',
      diagnosis: 'Bilan de santé normal',
      icd10: 'Z00.0',
      prescriptions: [],
      labResults: [
        { test: 'Glycémie', result: '0.95 g/L', date: '2024-12-20' },
        { test: 'Cholestérol', result: '1.8 g/L', date: '2024-12-20' }
      ],
      followUp: '2025-06-20',
      status: 'Terminé'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Terminé': 'bg-success/10 text-success border-success/20',
      'Suivi requis': 'bg-warning/10 text-warning border-warning/20',
      'En cours': 'bg-primary/10 text-primary border-primary/20'
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-1100 flex items-center justify-center p-4">
      <div className="bg-popover border border-border rounded-lg shadow-prominent w-full max-w-6xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-popover-foreground">
                Historique des Consultations
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {patient.name} - {consultationHistory.length} consultation{consultationHistory.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Consultation List */}
          <div className="w-1/3 border-r border-border overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-popover-foreground mb-4">Consultations</h3>
              <div className="space-y-3">
                {consultationHistory.map((consultation) => (
                  <div
                    key={consultation.id}
                    onClick={() => setSelectedConsultation(consultation)}
                    className={`
                      p-4 border border-border rounded-lg cursor-pointer transition-all
                      ${selectedConsultation?.id === consultation.id
                        ? 'border-primary bg-primary/5' :'hover:border-primary/50 hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-popover-foreground">
                          {formatDate(consultation.date)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {consultation.time} - {consultation.doctor}
                        </p>
                      </div>
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium border
                        ${getStatusColor(consultation.status)}
                      `}>
                        {consultation.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {consultation.specialty}
                    </p>
                    
                    <p className="text-sm text-popover-foreground font-medium">
                      {consultation.chiefComplaint}
                    </p>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {consultation.diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedConsultation ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-popover-foreground">
                      Consultation du {formatDate(selectedConsultation.date)}
                    </h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Icon name="Printer" size={16} className="mr-1" />
                        Imprimer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Icon name="Download" size={16} className="mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-popover-foreground mb-2">Informations Générales</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="text-popover-foreground">{formatDate(selectedConsultation.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Heure:</span>
                          <span className="text-popover-foreground">{selectedConsultation.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Médecin:</span>
                          <span className="text-popover-foreground">{selectedConsultation.doctor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Spécialité:</span>
                          <span className="text-popover-foreground">{selectedConsultation.specialty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-popover-foreground mb-2">Diagnostic</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Motif:</span>
                          <p className="text-popover-foreground mt-1">{selectedConsultation.chiefComplaint}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Diagnostic:</span>
                          <p className="text-popover-foreground mt-1">{selectedConsultation.diagnosis}</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Code CIM-10:</span>
                          <span className="text-popover-foreground font-mono">{selectedConsultation.icd10}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescriptions */}
                {selectedConsultation.prescriptions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-popover-foreground mb-3 flex items-center">
                      <Icon name="Pill" size={16} className="mr-2" />
                      Prescriptions
                    </h4>
                    <div className="space-y-3">
                      {selectedConsultation.prescriptions.map((prescription, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Médicament:</span>
                              <p className="text-popover-foreground font-medium">{prescription.medication}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dosage:</span>
                              <p className="text-popover-foreground">{prescription.dosage}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fréquence:</span>
                              <p className="text-popover-foreground">{prescription.frequency}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Durée:</span>
                              <p className="text-popover-foreground">{prescription.duration}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Results */}
                {selectedConsultation.labResults.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-popover-foreground mb-3 flex items-center">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Résultats d'Examens
                    </h4>
                    <div className="space-y-3">
                      {selectedConsultation.labResults.map((result, index) => (
                        <div key={index} className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-popover-foreground">{result.test}</p>
                              <p className="text-sm text-muted-foreground">Date: {formatDate(result.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-popover-foreground">{result.result}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up */}
                {selectedConsultation.followUp && (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-popover-foreground mb-2 flex items-center">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Suivi Programmé
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Prochain rendez-vous: {formatDate(selectedConsultation.followUp)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une consultation pour voir les détails
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationHistory;