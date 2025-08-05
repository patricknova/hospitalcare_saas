import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const NewPatientModal = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    region: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Medical History
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    previousSurgeries: [],
    familyHistory: '',
    
    // Insurance & Billing
    insuranceProvider: '',
    insuranceNumber: '',
    insuranceType: '',
    
    // Additional Notes
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: 'Masculin' },
    { value: 'female', label: 'Féminin' },
    { value: 'other', label: 'Autre' }
  ];

  const bloodTypeOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const regionOptions = [
    { value: 'centre', label: 'Centre' },
    { value: 'littoral', label: 'Littoral' },
    { value: 'ouest', label: 'Ouest' },
    { value: 'nord-ouest', label: 'Nord-Ouest' },
    { value: 'sud-ouest', label: 'Sud-Ouest' },
    { value: 'adamaoua', label: 'Adamaoua' },
    { value: 'nord', label: 'Nord' },
    { value: 'extreme-nord', label: 'Extrême-Nord' },
    { value: 'est', label: 'Est' },
    { value: 'sud', label: 'Sud' }
  ];

  const relationOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'conjoint', label: 'Conjoint(e)' },
    { value: 'enfant', label: 'Enfant' },
    { value: 'frere-soeur', label: 'Frère/Sœur' },
    { value: 'ami', label: 'Ami(e)' },
    { value: 'autre', label: 'Autre' }
  ];

  const insuranceOptions = [
    { value: 'cnps', label: 'CNPS' },
    { value: 'mutuelle', label: 'Mutuelle' },
    { value: 'privee', label: 'Assurance Privée' },
    { value: 'aucune', label: 'Aucune' }
  ];

  const commonAllergies = [
    'Pénicilline', 'Aspirine', 'Latex', 'Arachides', 'Fruits de mer', 
    'Pollen', 'Poussière', 'Animaux', 'Iode', 'Sulfamides'
  ];

  const commonConditions = [
    'Diabète', 'Hypertension', 'Asthme', 'Arthrite', 'Migraine',
    'Dépression', 'Anxiété', 'Cholestérol élevé', 'Maladie cardiaque', 'Épilepsie'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field, item, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], item]
        : prev[field].filter(i => i !== item)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
    if (!formData.gender) newErrors.gender = 'Le genre est requis';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Le contact d\'urgence est requis';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Le téléphone d\'urgence est requis';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const patientData = {
        ...formData,
        id: Date.now().toString(),
        medicalRecordNumber: `MR${Date.now().toString().slice(-6)}`,
        registrationDate: new Date().toISOString(),
        status: 'active',
        lastVisit: new Date().toISOString(),
        assignedDoctor: 'Dr. Jean Martin',
        age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
        photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}${formData.lastName}`
      };
      
      onSave(patientData);
      onClose();
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', gender: '', bloodType: '',
        phone: '', email: '', address: '', city: '', region: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
        allergies: [], chronicConditions: [], currentMedications: [], previousSurgeries: [],
        familyHistory: '', insuranceProvider: '', insuranceNumber: '', insuranceType: '', notes: ''
      });
      setActiveTab('personal');
      setErrors({});
    }
  };

  const tabs = [
    { id: 'personal', label: 'Informations Personnelles', icon: 'User' },
    { id: 'medical', label: 'Historique Médical', icon: 'Heart' },
    { id: 'insurance', label: 'Assurance', icon: 'Shield' },
    { id: 'notes', label: 'Notes', icon: 'FileText' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100 p-4">
      <div className="bg-popover border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-popover-foreground">Nouveau Patient</h2>
            <p className="text-sm text-muted-foreground">Enregistrer un nouveau patient dans le système</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
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
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom *"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Nom *"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Date de naissance *"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  error={errors.dateOfBirth}
                  required
                />
                <Select
                  label="Genre *"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => handleInputChange('gender', value)}
                  error={errors.gender}
                  required
                />
                <Select
                  label="Groupe sanguin"
                  options={bloodTypeOptions}
                  value={formData.bloodType}
                  onChange={(value) => handleInputChange('bloodType', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Téléphone *"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />
              </div>

              <Input
                label="Adresse"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ville"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                <Select
                  label="Région"
                  options={regionOptions}
                  value={formData.region}
                  onChange={(value) => handleInputChange('region', value)}
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Contact d'urgence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Nom complet *"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    error={errors.emergencyContactName}
                    required
                  />
                  <Input
                    label="Téléphone *"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    error={errors.emergencyContactPhone}
                    required
                  />
                  <Select
                    label="Relation"
                    options={relationOptions}
                    value={formData.emergencyContactRelation}
                    onChange={(value) => handleInputChange('emergencyContactRelation', value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Allergies connues</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonAllergies.map((allergy) => (
                    <Checkbox
                      key={allergy}
                      label={allergy}
                      checked={formData.allergies.includes(allergy)}
                      onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Conditions chroniques</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonConditions.map((condition) => (
                    <Checkbox
                      key={condition}
                      label={condition}
                      checked={formData.chronicConditions.includes(condition)}
                      onChange={(e) => handleArrayChange('chronicConditions', condition, e.target.checked)}
                    />
                  ))}
                </div>
              </div>

              <Input
                label="Antécédents familiaux"
                value={formData.familyHistory}
                onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                description="Maladies héréditaires ou antécédents familiaux importants"
              />
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="space-y-6">
              <Select
                label="Type d'assurance"
                options={insuranceOptions}
                value={formData.insuranceType}
                onChange={(value) => handleInputChange('insuranceType', value)}
              />

              {formData.insuranceType && formData.insuranceType !== 'aucune' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom de l'assureur"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                  />
                  <Input
                    label="Numéro d'assurance"
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes additionnelles
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Informations supplémentaires, observations particulières..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <div className="flex items-center space-x-3">
            {activeTab !== 'personal' && (
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                Précédent
              </Button>
            )}
            {activeTab !== 'notes' ? (
              <Button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
              >
                Suivant
                <Icon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Icon name="Save" size={16} className="mr-2" />
                Enregistrer Patient
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientModal;