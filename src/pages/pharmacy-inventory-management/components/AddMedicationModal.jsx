import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AddMedicationModal = ({ isOpen, onClose, onSave, medication }) => {
  const [formData, setFormData] = useState({
    frenchName: '',
    englishName: '',
    genericName: '',
    brandName: '',
    category: '',
    dosage: '',
    form: '',
    currentStock: '',
    minimumThreshold: '',
    maximumThreshold: '',
    unitPrice: '',
    supplier: '',
    batchNumber: '',
    expirationDate: '',
    barcode: '',
    location: '',
    activeIngredient: '',
    sideEffects: '',
    contraindications: '',
    dosageInstructions: '',
    prescriptionRequired: false,
    refrigerated: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medication) {
      setFormData({
        frenchName: medication.frenchName || '',
        englishName: medication.englishName || '',
        genericName: medication.genericName || '',
        brandName: medication.brandName || '',
        category: medication.category || '',
        dosage: medication.dosage || '',
        form: medication.form || '',
        currentStock: medication.currentStock?.toString() || '',
        minimumThreshold: medication.minimumThreshold?.toString() || '',
        maximumThreshold: medication.maximumThreshold?.toString() || '',
        unitPrice: medication.unitPrice?.toString() || '',
        supplier: medication.supplier || '',
        batchNumber: medication.batchNumber || '',
        expirationDate: medication.expirationDate || '',
        barcode: medication.barcode || '',
        location: medication.location || '',
        activeIngredient: medication.activeIngredient || '',
        sideEffects: medication.sideEffects || '',
        contraindications: medication.contraindications || '',
        dosageInstructions: medication.dosageInstructions || '',
        prescriptionRequired: medication.prescriptionRequired || false,
        refrigerated: medication.refrigerated || false
      });
    } else {
      // Reset form for new medication
      setFormData({
        frenchName: '',
        englishName: '',
        genericName: '',
        brandName: '',
        category: '',
        dosage: '',
        form: '',
        currentStock: '',
        minimumThreshold: '',
        maximumThreshold: '',
        unitPrice: '',
        supplier: '',
        batchNumber: '',
        expirationDate: '',
        barcode: '',
        location: '',
        activeIngredient: '',
        sideEffects: '',
        contraindications: '',
        dosageInstructions: '',
        prescriptionRequired: false,
        refrigerated: false
      });
    }
    setErrors({});
  }, [medication, isOpen]);

  const categoryOptions = [
    { value: '', label: 'Sélectionner une catégorie' },
    { value: 'analgesique', label: 'Analgésiques' },
    { value: 'antibiotique', label: 'Antibiotiques' },
    { value: 'antidiabetique', label: 'Antidiabétiques' },
    { value: 'hormone', label: 'Hormones' },
    { value: 'gastroprotecteur', label: 'Gastroprotecteurs' },
    { value: 'cardiovasculaire', label: 'Cardiovasculaires' },
    { value: 'neurologique', label: 'Neurologiques' },
    { value: 'respiratoire', label: 'Respiratoires' },
    { value: 'dermatologique', label: 'Dermatologiques' },
    { value: 'vitamine', label: 'Vitamines & Minéraux' }
  ];

  const formOptions = [
    { value: '', label: 'Sélectionner une forme' },
    { value: 'comprime', label: 'Comprimé' },
    { value: 'gelule', label: 'Gélule' },
    { value: 'sirop', label: 'Sirop' },
    { value: 'injection', label: 'Injection' },
    { value: 'creme', label: 'Crème' },
    { value: 'pommade', label: 'Pommade' },
    { value: 'gouttes', label: 'Gouttes' },
    { value: 'inhalateur', label: 'Inhalateur' },
    { value: 'suppositoire', label: 'Suppositoire' },
    { value: 'patch', label: 'Patch' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.frenchName.trim()) newErrors.frenchName = 'Nom français requis';
    if (!formData.englishName.trim()) newErrors.englishName = 'Nom anglais requis';
    if (!formData.category) newErrors.category = 'Catégorie requise';
    if (!formData.form) newErrors.form = 'Forme requise';
    if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
      newErrors.currentStock = 'Stock actuel requis (≥0)';
    }
    if (!formData.minimumThreshold || parseInt(formData.minimumThreshold) < 0) {
      newErrors.minimumThreshold = 'Seuil minimum requis (≥0)';
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Prix unitaire requis (>0)';
    }
    if (!formData.supplier.trim()) newErrors.supplier = 'Fournisseur requis';
    if (!formData.expirationDate) newErrors.expirationDate = 'Date d\'expiration requise';

    // Check if expiration date is in the future
    if (formData.expirationDate && new Date(formData.expirationDate) <= new Date()) {
      newErrors.expirationDate = 'La date d\'expiration doit être future';
    }

    // Check if minimum threshold is less than maximum
    if (formData.minimumThreshold && formData.maximumThreshold) {
      if (parseInt(formData.minimumThreshold) >= parseInt(formData.maximumThreshold)) {
        newErrors.maximumThreshold = 'Le seuil maximum doit être supérieur au minimum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const medicationData = {
      ...formData,
      currentStock: parseInt(formData.currentStock),
      minimumThreshold: parseInt(formData.minimumThreshold),
      maximumThreshold: parseInt(formData.maximumThreshold) || 1000,
      unitPrice: parseFloat(formData.unitPrice)
    };

    onSave(medicationData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Plus" size={20} className="mr-2" />
            {medication ? 'Modifier le Médicament' : 'Ajouter un Médicament'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Informations de Base</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom français *"
                value={formData.frenchName}
                onChange={(e) => handleInputChange('frenchName', e.target.value)}
                error={errors.frenchName}
                placeholder="Ex: Paracétamol"
              />
              <Input
                label="Nom anglais *"
                value={formData.englishName}
                onChange={(e) => handleInputChange('englishName', e.target.value)}
                error={errors.englishName}
                placeholder="Ex: Paracetamol"
              />
              <Input
                label="Nom générique"
                value={formData.genericName}
                onChange={(e) => handleInputChange('genericName', e.target.value)}
                placeholder="Ex: Paracétamol"
              />
              <Input
                label="Nom de marque"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Ex: Doliprane"
              />
              <Select
                label="Catégorie *"
                options={categoryOptions}
                value={formData.category}
                onChange={(value) => handleInputChange('category', value)}
                error={errors.category}
              />
              <Select
                label="Forme *"
                options={formOptions}
                value={formData.form}
                onChange={(value) => handleInputChange('form', value)}
                error={errors.form}
              />
            </div>
          </div>

          {/* Stock Information */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Informations de Stock</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Stock actuel *"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                error={errors.currentStock}
                placeholder="0"
              />
              <Input
                label="Seuil minimum *"
                type="number"
                min="0"
                value={formData.minimumThreshold}
                onChange={(e) => handleInputChange('minimumThreshold', e.target.value)}
                error={errors.minimumThreshold}
                placeholder="10"
              />
              <Input
                label="Seuil maximum"
                type="number"
                min="0"
                value={formData.maximumThreshold}
                onChange={(e) => handleInputChange('maximumThreshold', e.target.value)}
                error={errors.maximumThreshold}
                placeholder="1000"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Input
                label="Prix unitaire (FCFA) *"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                error={errors.unitPrice}
                placeholder="150.00"
              />
              <Input
                label="Dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="Ex: 500mg"
              />
            </div>
          </div>

          {/* Supplier & Batch Information */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Fournisseur & Lot</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fournisseur *"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                error={errors.supplier}
                placeholder="Ex: Laboratoires STERIPHARMA"
              />
              <Input
                label="Numéro de lot"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                placeholder="Ex: PCM2024-001"
              />
              <Input
                label="Date d'expiration *"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                error={errors.expirationDate}
              />
              <Input
                label="Code-barres"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="Ex: 3401597405101"
              />
            </div>
            <div className="mt-4">
              <Input
                label="Emplacement"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ex: Étagère A-12"
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Informations Médicales</h4>
            <div className="space-y-4">
              <Input
                label="Principe actif"
                value={formData.activeIngredient}
                onChange={(e) => handleInputChange('activeIngredient', e.target.value)}
                placeholder="Ex: Paracétamol 500mg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Effets secondaires
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                    rows="3"
                    value={formData.sideEffects}
                    onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                    placeholder="Ex: Nausées, vomissements rares"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contre-indications
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                    rows="3"
                    value={formData.contraindications}
                    onChange={(e) => handleInputChange('contraindications', e.target.value)}
                    placeholder="Ex: Insuffisance hépatique sévère"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instructions de dosage
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                  rows="2"
                  value={formData.dosageInstructions}
                  onChange={(e) => handleInputChange('dosageInstructions', e.target.value)}
                  placeholder="Ex: 1-2 comprimés toutes les 6 heures, max 8/jour"
                />
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Exigences Spéciales</h4>
            <div className="flex flex-col space-y-3">
              <Checkbox
                label="Prescription requise"
                checked={formData.prescriptionRequired}
                onChange={(checked) => handleInputChange('prescriptionRequired', checked)}
              />
              <Checkbox
                label="Réfrigération requise"
                checked={formData.refrigerated}
                onChange={(checked) => handleInputChange('refrigerated', checked)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              <Icon name="Save" size={16} className="mr-2" />
              {medication ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationModal;