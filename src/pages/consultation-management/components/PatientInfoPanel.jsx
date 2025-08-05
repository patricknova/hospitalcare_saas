import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientInfoPanel = ({ patient, onViewHistory, onUpdateVitals }) => {
  if (!patient) {
    return (
      <div className="h-full bg-card border border-border rounded-lg p-6 flex items-center justify-center">
        <div className="text-center">
          <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Sélectionnez un patient pour voir ses informations</p>
        </div>
      </div>
    );
  }

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-50 text-red-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-50 text-blue-700',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-50 text-purple-700',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-50 text-green-700'
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800';
  };

  const getAllergyColor = (severity) => {
    const colors = {
      'Critique': 'bg-error/10 text-error border-error/20',
      'Modérée': 'bg-warning/10 text-warning border-warning/20',
      'Légère': 'bg-accent/10 text-accent border-accent/20'
    };
    return colors[severity] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Patient Header */}
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Image
              src={patient.photo}
              alt={`Photo de ${patient.name}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <Icon name="Check" size={12} color="white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                <Icon name="Calendar" size={14} className="inline mr-1" />
                {patient.age} ans
              </span>
              <span className="text-muted-foreground">
                <Icon name="User" size={14} className="inline mr-1" />
                {patient.gender}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloodTypeColor(patient.bloodType)}`}>
                {patient.bloodType}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Contact Information */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Phone" size={16} className="mr-2" />
            Contact
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={14} className="text-muted-foreground" />
              <span className="text-foreground">{patient.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={14} className="text-muted-foreground" />
              <span className="text-foreground">{patient.email}</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="MapPin" size={14} className="text-muted-foreground mt-0.5" />
              <span className="text-foreground">{patient.address}</span>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground flex items-center">
              <Icon name="Activity" size={16} className="mr-2" />
              Signes Vitaux
            </h4>
            <Button variant="ghost" size="sm" onClick={onUpdateVitals}>
              <Icon name="Edit" size={14} className="mr-1" />
              Modifier
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Heart" size={16} className="text-error" />
                <div>
                  <p className="text-xs text-muted-foreground">Tension</p>
                  <p className="font-medium text-foreground">{patient.vitals.bloodPressure}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Thermometer" size={16} className="text-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Température</p>
                  <p className="font-medium text-foreground">{patient.vitals.temperature}°C</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Activity" size={16} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Pouls</p>
                  <p className="font-medium text-foreground">{patient.vitals.pulse} bpm</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Wind" size={16} className="text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Respiration</p>
                  <p className="font-medium text-foreground">{patient.vitals.respiratory}/min</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Dernière mise à jour: {patient.vitals.lastUpdated}
          </p>
        </div>

        {/* Allergies */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            Allergies
          </h4>
          
          {patient.allergies.length > 0 ? (
            <div className="space-y-2">
              {patient.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getAllergyColor(allergy.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{allergy.substance}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-current/10">
                      {allergy.severity}
                    </span>
                  </div>
                  <p className="text-sm mt-1 opacity-80">{allergy.reaction}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucune allergie connue</p>
          )}
        </div>

        {/* Current Medications */}
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="Pill" size={16} className="mr-2" />
            Médicaments Actuels
          </h4>
          
          {patient.currentMedications.length > 0 ? (
            <div className="space-y-3">
              {patient.currentMedications.map((medication, index) => (
                <div key={index} className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prescrit le {medication.prescribedDate}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {medication.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun médicament en cours</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onViewHistory} className="flex-1">
            <Icon name="History" size={14} className="mr-1" />
            Historique
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Icon name="FileText" size={14} className="mr-1" />
            Dossier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoPanel;