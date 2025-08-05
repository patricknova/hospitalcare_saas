import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientProfileSlideOver = ({ patient, isOpen, onClose, onEdit, onScheduleAppointment }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !patient) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Actif' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactif' },
      hospitalized: { color: 'bg-warning text-warning-foreground', label: 'Hospitalisé' },
      discharged: { color: 'bg-primary text-primary-foreground', label: 'Sorti' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Mock medical history data
  const medicalHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Jean Martin',
      diagnosis: 'Hypertension artérielle',
      treatment: 'Amlodipine 5mg, régime sans sel',
      notes: 'Tension: 150/90 mmHg. Recommandation de suivi mensuel.'
    },
    {
      id: 2,
      date: '2023-12-10',
      type: 'Analyse',
      doctor: 'Dr. Marie Kouam',
      diagnosis: 'Bilan lipidique',
      treatment: 'Statines prescrites',
      notes: 'Cholestérol total: 2.8 g/L. LDL élevé.'
    },
    {
      id: 3,
      date: '2023-11-05',
      type: 'Urgence',
      doctor: 'Dr. Paul Ngono',
      diagnosis: 'Crise hypertensive',
      treatment: 'Hospitalisation 2 jours',
      notes: 'Tension: 180/110 mmHg. Stabilisé avec traitement IV.'
    }
  ];

  const vaccinations = [
    { name: 'COVID-19', date: '2024-01-10', nextDue: '2024-07-10', status: 'À jour' },
    { name: 'Grippe saisonnière', date: '2023-10-15', nextDue: '2024-10-15', status: 'À jour' },
    { name: 'Tétanos', date: '2022-03-20', nextDue: '2032-03-20', status: 'À jour' },
    { name: 'Hépatite B', date: '2020-05-12', nextDue: 'Vie', status: 'Complet' }
  ];

  const documents = [
    { id: 1, name: 'Ordonnance_15-01-2024.pdf', type: 'Ordonnance', date: '2024-01-15', size: '245 KB' },
    { id: 2, name: 'Resultats_Analyses_10-12-2023.pdf', type: 'Analyses', date: '2023-12-10', size: '1.2 MB' },
    { id: 3, name: 'Rapport_Hospitalisation_05-11-2023.pdf', type: 'Rapport', date: '2023-11-05', size: '890 KB' },
    { id: 4, name: 'Radiographie_Thorax_20-10-2023.pdf', type: 'Imagerie', date: '2023-10-20', size: '3.4 MB' }
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'User' },
    { id: 'history', label: 'Historique médical', icon: 'FileText' },
    { id: 'vaccinations', label: 'Vaccinations', icon: 'Shield' },
    { id: 'documents', label: 'Documents', icon: 'Folder' }
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-1100" onClick={onClose} />
      
      {/* Slide Over Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-popover border-l border-border z-1100 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                <Image
                  src={patient.photo}
                  alt={`${patient.firstName} ${patient.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-popover-foreground">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  N° {patient.medicalRecordNumber} • {calculateAge(patient.dateOfBirth)} ans
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(patient.status)}
                  <span className="text-xs text-muted-foreground">
                    Dernière visite: {formatDate(patient.lastVisit)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(patient)}>
                <Icon name="Edit" size={16} className="mr-2" />
                Modifier
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex space-x-0 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onScheduleAppointment(patient)}
                    className="justify-start"
                  >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Planifier RDV
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Icon name="Phone" size={16} className="mr-2" />
                    Appeler
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="User" size={18} className="mr-2" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date de naissance</p>
                      <p className="text-foreground font-medium">{formatDate(patient.dateOfBirth)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Genre</p>
                      <p className="text-foreground font-medium">
                        {patient.gender === 'male' ? 'Masculin' : patient.gender === 'female' ? 'Féminin' : 'Autre'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Groupe sanguin</p>
                      <p className="text-foreground font-medium">{patient.bloodType || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Téléphone</p>
                      <p className="text-foreground font-medium">{patient.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">{patient.email || 'Non renseigné'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Adresse</p>
                      <p className="text-foreground font-medium">{patient.address || 'Non renseignée'}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="AlertTriangle" size={18} className="mr-2" />
                    Contact d'urgence
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Nom</p>
                      <p className="text-foreground font-medium">{patient.emergencyContactName || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Téléphone</p>
                      <p className="text-foreground font-medium">{patient.emergencyContactPhone || 'Non renseigné'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Relation</p>
                      <p className="text-foreground font-medium">{patient.emergencyContactRelation || 'Non renseignée'}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Summary */}
                <div className="bg-background border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Icon name="Heart" size={18} className="mr-2" />
                    Résumé médical
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground text-sm">Allergies connues</p>
                      <p className="text-foreground">
                        {patient.allergies && patient.allergies.length > 0 
                          ? patient.allergies.join(', ') 
                          : 'Aucune allergie connue'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Conditions chroniques</p>
                      <p className="text-foreground">
                        {patient.chronicConditions && patient.chronicConditions.length > 0 
                          ? patient.chronicConditions.join(', ') 
                          : 'Aucune condition chronique'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Médecin assigné</p>
                      <p className="text-foreground font-medium">{patient.assignedDoctor}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Historique médical</h3>
                  <Button variant="outline" size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Nouvelle entrée
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {medicalHistory.map((entry) => (
                    <div key={entry.id} className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              {entry.type}
                            </span>
                            <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{entry.doctor}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Icon name="MoreVertical" size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">Diagnostic</p>
                          <p className="text-sm text-muted-foreground">{entry.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Traitement</p>
                          <p className="text-sm text-muted-foreground">{entry.treatment}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Notes</p>
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'vaccinations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Carnet de vaccination</h3>
                  <Button variant="outline" size="sm">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Ajouter vaccination
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {vaccinations.map((vaccine, index) => (
                    <div key={index} className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{vaccine.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Dernière dose: {formatDate(vaccine.date)}
                          </p>
                          {vaccine.nextDue !== 'Vie' && (
                            <p className="text-sm text-muted-foreground">
                              Prochaine dose: {vaccine.nextDue === 'Vie' ? 'N/A' : formatDate(vaccine.nextDue)}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vaccine.status === 'À jour' || vaccine.status === 'Complet'
                            ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                        }`}>
                          {vaccine.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Documents médicaux</h3>
                  <Button variant="outline" size="sm">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Télécharger
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-background border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon name="FileText" size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doc.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{formatDate(doc.date)}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Download" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="MoreVertical" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfileSlideOver;