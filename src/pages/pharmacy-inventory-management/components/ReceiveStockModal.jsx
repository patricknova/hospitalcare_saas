import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ReceiveStockModal = ({ isOpen, onClose, onSave, medications }) => {
  const [formData, setFormData] = useState({
    medicationId: '',
    quantity: '',
    batchNumber: '',
    expirationDate: '',
    supplier: '',
    unitCost: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const medicationOptions = [
    { value: '', label: 'Sélectionner un médicament' },
    ...medications.map(med => ({
      value: med.id,
      label: `${med.frenchName} (${med.brandName}) - Stock: ${med.currentStock}`
    }))
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.medicationId) newErrors.medicationId = 'Médicament requis';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantité requise (>0)';
    }
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Numéro de lot requis';
    if (!formData.expirationDate) newErrors.expirationDate = 'Date d\'expiration requise';
    if (!formData.supplier.trim()) newErrors.supplier = 'Fournisseur requis';

    // Check if expiration date is in the future
    if (formData.expirationDate && new Date(formData.expirationDate) <= new Date()) {
      newErrors.expirationDate = 'La date d\'expiration doit être future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const stockData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      unitCost: parseFloat(formData.unitCost) || 0,
      receivedDate: new Date().toISOString().split('T')[0]
    };

    onSave(stockData);
    
    // Reset form
    setFormData({
      medicationId: '',
      quantity: '',
      batchNumber: '',
      expirationDate: '',
      supplier: '',
      unitCost: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const selectedMedication = medications.find(med => med.id === formData.medicationId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="PackagePlus" size={20} className="mr-2" />
            Recevoir du Stock
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medication Selection */}
          <div>
            <Select
              label="Médicament *"
              options={medicationOptions}
              value={formData.medicationId}
              onChange={(value) => handleInputChange('medicationId', value)}
              error={errors.medicationId}
              searchable
            />
            
            {selectedMedication && (
              <div className="mt-3 p-4 bg-muted/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Stock actuel:</span>
                    <span className="ml-2 font-medium">{selectedMedication.currentStock}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Seuil minimum:</span>
                    <span className="ml-2 font-medium">{selectedMedication.minimumThreshold}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fournisseur actuel:</span>
                    <span className="ml-2 font-medium">{selectedMedication.supplier}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prix unitaire:</span>
                    <span className="ml-2 font-medium">{selectedMedication.unitPrice} FCFA</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stock Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quantité reçue *"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              error={errors.quantity}
              placeholder="100"
            />
            <Input
              label="Coût unitaire (FCFA)"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitCost}
              onChange={(e) => handleInputChange('unitCost', e.target.value)}
              placeholder="150.00"
            />
          </div>

          {/* Batch Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Numéro de lot *"
              value={formData.batchNumber}
              onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              error={errors.batchNumber}
              placeholder="Ex: PCM2024-001"
            />
            <Input
              label="Date d'expiration *"
              type="date"
              value={formData.expirationDate}
              onChange={(e) => handleInputChange('expirationDate', e.target.value)}
              error={errors.expirationDate}
            />
          </div>

          {/* Supplier */}
          <Input
            label="Fournisseur *"
            value={formData.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            error={errors.supplier}
            placeholder="Ex: Laboratoires STERIPHARMA"
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes supplémentaires
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
              rows="3"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes sur la réception, conditions de stockage, etc."
            />
          </div>

          {/* Summary */}
          {formData.quantity && formData.unitCost && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Résumé de la réception</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantité:</span>
                  <span className="ml-2 font-medium">{formData.quantity} unités</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coût total:</span>
                  <span className="ml-2 font-medium">
                    {(parseInt(formData.quantity || 0) * parseFloat(formData.unitCost || 0)).toLocaleString()} FCFA
                  </span>
                </div>
                {selectedMedication && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Nouveau stock:</span>
                      <span className="ml-2 font-medium">
                        {selectedMedication.currentStock + parseInt(formData.quantity || 0)} unités
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut:</span>
                      <span className={`ml-2 font-medium ${
                        (selectedMedication.currentStock + parseInt(formData.quantity || 0)) > selectedMedication.minimumThreshold 
                          ? 'text-success' : 'text-warning'
                      }`}>
                        {(selectedMedication.currentStock + parseInt(formData.quantity || 0)) > selectedMedication.minimumThreshold 
                          ? 'Stock suffisant' : 'Stock encore faible'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              <Icon name="Check" size={16} className="mr-2" />
              Confirmer la Réception
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceiveStockModal;