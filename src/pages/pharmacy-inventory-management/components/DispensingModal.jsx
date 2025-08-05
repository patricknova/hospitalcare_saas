import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const DispensingModal = ({ isOpen, onClose, onSave, medication }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    prescriptionNumber: '',
    quantity: '',
    dispensedBy: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) newErrors.patientName = 'Nom du patient requis';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantité requise (>0)';
    }
    if (medication && parseInt(formData.quantity) > medication.currentStock) {
      newErrors.quantity = `Stock insuffisant (disponible: ${medication.currentStock})`;
    }
    if (!formData.dispensedBy.trim()) newErrors.dispensedBy = 'Dispensé par requis';

    // Check prescription requirement
    if (medication?.prescriptionRequired && !formData.prescriptionNumber.trim()) {
      newErrors.prescriptionNumber = 'Numéro de prescription requis pour ce médicament';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const dispensingData = {
      medicationId: medication.id,
      ...formData,
      quantity: parseInt(formData.quantity),
      dispensedDate: new Date().toISOString(),
      medicationName: medication.frenchName
    };

    onSave(dispensingData);
    
    // Reset form
    setFormData({
      patientName: '',
      patientId: '',
      prescriptionNumber: '',
      quantity: '',
      dispensedBy: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !medication) return null;

  const totalCost = (parseInt(formData.quantity || 0) * medication.unitPrice);
  const remainingStock = medication.currentStock - parseInt(formData.quantity || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="ShoppingCart" size={20} className="mr-2" />
            Dispenser un Médicament
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medication Information */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="text-md font-medium text-foreground mb-3">Médicament à dispenser</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nom:</span>
                <span className="ml-2 font-medium">{medication.frenchName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Marque:</span>
                <span className="ml-2 font-medium">{medication.brandName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dosage:</span>
                <span className="ml-2 font-medium">{medication.dosage}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock disponible:</span>
                <span className="ml-2 font-medium">{medication.currentStock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Prix unitaire:</span>
                <span className="ml-2 font-medium">{medication.unitPrice} FCFA</span>
              </div>
              <div>
                <span className="text-muted-foreground">Lot:</span>
                <span className="ml-2 font-medium">{medication.batchNumber}</span>
              </div>
            </div>
            
            {medication.prescriptionRequired && (
              <div className="mt-3 p-2 bg-warning/10 rounded-lg flex items-center">
                <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
                <span className="text-sm text-warning">Prescription médicale requise</span>
              </div>
            )}
          </div>

          {/* Patient Information */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Informations Patient</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom du patient *"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                error={errors.patientName}
                placeholder="Ex: Jean Dupont"
              />
              <Input
                label="ID Patient / Dossier médical"
                value={formData.patientId}
                onChange={(e) => handleInputChange('patientId', e.target.value)}
                placeholder="Ex: MR001234"
              />
            </div>
          </div>

          {/* Prescription Information */}
          {medication.prescriptionRequired && (
            <div>
              <Input
                label="Numéro de prescription *"
                value={formData.prescriptionNumber}
                onChange={(e) => handleInputChange('prescriptionNumber', e.target.value)}
                error={errors.prescriptionNumber}
                placeholder="Ex: PRE2024-001"
              />
            </div>
          )}

          {/* Dispensing Details */}
          <div>
            <h4 className="text-md font-medium text-foreground mb-4">Détails de la Dispensation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quantité à dispenser *"
                type="number"
                min="1"
                max={medication.currentStock}
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                error={errors.quantity}
                placeholder="1"
              />
              <Input
                label="Dispensé par *"
                value={formData.dispensedBy}
                onChange={(e) => handleInputChange('dispensedBy', e.target.value)}
                error={errors.dispensedBy}
                placeholder="Nom du pharmacien"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instructions pour le patient
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows="2"
              value={medication.dosageInstructions}
              readOnly
              placeholder="Instructions de dosage"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes supplémentaires
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows="3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Conseils d'usage, interactions médicamenteuses, etc."
            />
          </div>

          {/* Dispensing Summary */}
          {formData.quantity && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Résumé de la dispensation</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantité:</span>
                  <span className="ml-2 font-medium">{formData.quantity} unités</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coût total:</span>
                  <span className="ml-2 font-medium">{totalCost.toLocaleString()} FCFA</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock restant:</span>
                  <span className={`ml-2 font-medium ${
                    remainingStock <= medication.minimumThreshold ? 'text-warning' : 'text-success'
                  }`}>
                    {remainingStock} unités
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut après dispensation:</span>
                  <span className={`ml-2 font-medium ${
                    remainingStock === 0 ? 'text-destructive' : 
                    remainingStock <= medication.minimumThreshold ? 'text-warning' : 'text-success'
                  }`}>
                    {remainingStock === 0 ? 'Rupture de stock' :
                     remainingStock <= medication.minimumThreshold ? 'Stock faible' : 'Stock suffisant'}
                  </span>
                </div>
              </div>
              
              {remainingStock <= medication.minimumThreshold && (
                <div className="mt-3 p-2 bg-warning/10 rounded-lg flex items-center">
                  <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
                  <span className="text-sm text-warning">
                    Attention: Le stock sera {remainingStock === 0 ? 'épuisé' : 'faible'} après cette dispensation
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              <Icon name="Check" size={16} className="mr-2" />
              Confirmer la Dispensation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispensingModal;