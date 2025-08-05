import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClinicalExaminationForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: {
      general: '',
      cardiovascular: '',
      respiratory: '',
      abdominal: '',
      neurological: '',
      musculoskeletal: ''
    },
    diagnosis: {
      primary: '',
      secondary: [],
      icd10Code: ''
    },
    treatmentPlan: '',
    prescriptions: [],
    labRequests: [],
    imagingRequests: [],
    followUpDate: '',
    notes: ''
  });

  const [activeSection, setActiveSection] = useState('complaint');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const specialtyTemplates = [
    { value: 'general', label: 'Médecine Générale' },
    { value: 'cardiology', label: 'Cardiologie' },
    { value: 'pediatrics', label: 'Pédiatrie' },
    { value: 'gynecology', label: 'Gynécologie' },
    { value: 'orthopedics', label: 'Orthopédie' }
  ];

  const icd10Suggestions = [
    { value: 'J06.9', label: 'Infection aiguë des voies respiratoires supérieures, sans précision' },
    { value: 'K59.0', label: 'Constipation' },
    { value: 'M79.3', label: 'Panniculite, sans précision' },
    { value: 'R50.9', label: 'Fièvre, sans précision' },
    { value: 'I10', label: 'Hypertension essentielle' }
  ];

  const labTests = [
    { value: 'cbc', label: 'Numération Formule Sanguine (NFS)' },
    { value: 'glucose', label: 'Glycémie' },
    { value: 'creatinine', label: 'Créatinine' },
    { value: 'liver', label: 'Bilan Hépatique' },
    { value: 'lipid', label: 'Bilan Lipidique' }
  ];

  const imagingTypes = [
    { value: 'xray', label: 'Radiographie' },
    { value: 'ultrasound', label: 'Échographie' },
    { value: 'ct', label: 'Scanner (CT)' },
    { value: 'mri', label: 'IRM' },
    { value: 'ecg', label: 'Électrocardiogramme (ECG)' }
  ];

  const sections = [
    { id: 'complaint', label: 'Motif de Consultation', icon: 'MessageSquare' },
    { id: 'examination', label: 'Examen Physique', icon: 'Stethoscope' },
    { id: 'diagnosis', label: 'Diagnostic', icon: 'Search' },
    { id: 'treatment', label: 'Plan de Traitement', icon: 'Pill' },
    { id: 'requests', label: 'Examens Complémentaires', icon: 'FileText' },
    { id: 'followup', label: 'Suivi', icon: 'Calendar' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleVoiceRecording = () => {
    setIsVoiceRecording(!isVoiceRecording);
    // Voice recording logic would be implemented here
  };

  const addPrescription = () => {
    const newPrescription = {
      id: Date.now(),
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    };
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, newPrescription]
    }));
  };

  const removePrescription = (id) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter(p => p.id !== id)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Examen Clinique</h3>
            <p className="text-sm text-muted-foreground">
              {patient ? `${patient.name} - ${new Date().toLocaleDateString('fr-FR')}` : 'Nouveau patient'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={specialtyTemplates}
              placeholder="Modèle de spécialité"
              className="w-48"
            />
            <Button
              variant={isVoiceRecording ? "destructive" : "outline"}
              size="sm"
              onClick={toggleVoiceRecording}
            >
              <Icon name={isVoiceRecording ? "MicOff" : "Mic"} size={16} className="mr-1" />
              {isVoiceRecording ? 'Arrêter' : 'Dicter'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Section Navigation */}
        <div className="w-64 border-r border-border bg-muted/20">
          <div className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">SECTIONS</h4>
            <nav className="space-y-1">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full justify-start text-sm"
                >
                  <Icon name={section.icon} size={16} className="mr-2" />
                  {section.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Chief Complaint Section */}
            {activeSection === 'complaint' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Motif de Consultation</h4>
                
                <Input
                  label="Motif principal"
                  placeholder="Décrivez le motif principal de la consultation..."
                  value={formData.chiefComplaint}
                  onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Histoire de la maladie actuelle
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Décrivez l'évolution des symptômes, leur durée, les facteurs déclenchants..."
                    value={formData.historyOfPresentIllness}
                    onChange={(e) => handleInputChange('historyOfPresentIllness', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Physical Examination Section */}
            {activeSection === 'examination' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Examen Physique</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Examen général
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="État général, conscience, coloration..."
                      value={formData.physicalExamination.general}
                      onChange={(e) => handleInputChange('physicalExamination.general', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cardiovasculaire
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Auscultation cardiaque, pouls..."
                      value={formData.physicalExamination.cardiovascular}
                      onChange={(e) => handleInputChange('physicalExamination.cardiovascular', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Respiratoire
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Auscultation pulmonaire, respiration..."
                      value={formData.physicalExamination.respiratory}
                      onChange={(e) => handleInputChange('physicalExamination.respiratory', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Abdominal
                    </label>
                    <textarea
                      className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Palpation, auscultation abdominale..."
                      value={formData.physicalExamination.abdominal}
                      onChange={(e) => handleInputChange('physicalExamination.abdominal', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Diagnosis Section */}
            {activeSection === 'diagnosis' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Diagnostic</h4>
                
                <Input
                  label="Diagnostic principal"
                  placeholder="Diagnostic principal..."
                  value={formData.diagnosis.primary}
                  onChange={(e) => handleInputChange('diagnosis.primary', e.target.value)}
                />

                <Select
                  label="Code CIM-10"
                  options={icd10Suggestions}
                  searchable
                  placeholder="Rechercher un code CIM-10..."
                  value={formData.diagnosis.icd10Code}
                  onChange={(value) => handleInputChange('diagnosis.icd10Code', value)}
                />
              </div>
            )}

            {/* Treatment Section */}
            {activeSection === 'treatment' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Plan de Traitement</h4>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Plan thérapeutique
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Décrivez le plan de traitement..."
                    value={formData.treatmentPlan}
                    onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                  />
                </div>

                {/* Prescriptions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-foreground">Prescriptions</h5>
                    <Button variant="outline" size="sm" onClick={addPrescription}>
                      <Icon name="Plus" size={16} className="mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {formData.prescriptions.map((prescription, index) => (
                    <div key={prescription.id} className="p-4 border border-border rounded-lg mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <h6 className="font-medium text-foreground">Médicament {index + 1}</h6>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePrescription(prescription.id)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Médicament"
                          placeholder="Nom du médicament"
                          value={prescription.medication}
                          onChange={(e) => {
                            const updatedPrescriptions = formData.prescriptions.map(p =>
                              p.id === prescription.id ? { ...p, medication: e.target.value } : p
                            );
                            setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
                          }}
                        />
                        <Input
                          label="Dosage"
                          placeholder="Ex: 500mg"
                          value={prescription.dosage}
                          onChange={(e) => {
                            const updatedPrescriptions = formData.prescriptions.map(p =>
                              p.id === prescription.id ? { ...p, dosage: e.target.value } : p
                            );
                            setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
                          }}
                        />
                        <Input
                          label="Fréquence"
                          placeholder="Ex: 3 fois par jour"
                          value={prescription.frequency}
                          onChange={(e) => {
                            const updatedPrescriptions = formData.prescriptions.map(p =>
                              p.id === prescription.id ? { ...p, frequency: e.target.value } : p
                            );
                            setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
                          }}
                        />
                        <Input
                          label="Durée"
                          placeholder="Ex: 7 jours"
                          value={prescription.duration}
                          onChange={(e) => {
                            const updatedPrescriptions = formData.prescriptions.map(p =>
                              p.id === prescription.id ? { ...p, duration: e.target.value } : p
                            );
                            setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requests Section */}
            {activeSection === 'requests' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Examens Complémentaires</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-foreground mb-3">Examens de Laboratoire</h5>
                    <Select
                      options={labTests}
                      multiple
                      searchable
                      placeholder="Sélectionner les examens..."
                      value={formData.labRequests}
                      onChange={(value) => handleInputChange('labRequests', value)}
                    />
                  </div>

                  <div>
                    <h5 className="font-medium text-foreground mb-3">Imagerie Médicale</h5>
                    <Select
                      options={imagingTypes}
                      multiple
                      searchable
                      placeholder="Sélectionner les examens..."
                      value={formData.imagingRequests}
                      onChange={(value) => handleInputChange('imagingRequests', value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up Section */}
            {activeSection === 'followup' && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-foreground">Suivi</h4>
                
                <Input
                  label="Date de suivi"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes additionnelles
                  </label>
                  <textarea
                    className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Notes pour le suivi, recommandations..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Save" size={16} className="mr-1" />
              Brouillon
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Printer" size={16} className="mr-1" />
              Imprimer
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button variant="default" onClick={handleSave}>
              <Icon name="Check" size={16} className="mr-1" />
              Terminer Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalExaminationForm;