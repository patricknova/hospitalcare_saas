import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceModal = ({ isOpen, onClose, invoice, isCreating = false, onSave }) => {
  const [invoiceData, setInvoiceData] = useState({
    patientName: '',
    patientPhone: '',
    patientId: '',
    services: [{ type: 'consultation', description: '', amount: 0, doctor: '' }],
    insuranceProvider: '',
    insuranceNumber: '',
    insuranceCoverage: 0,
    language: 'fr',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (isCreating) {
        setInvoiceData({
          patientName: '',
          patientPhone: '',
          patientId: '',
          services: [{ type: 'consultation', description: '', amount: 0, doctor: '' }],
          insuranceProvider: '',
          insuranceNumber: '',
          insuranceCoverage: 0,
          language: 'fr',
          notes: ''
        });
      } else if (invoice) {
        setInvoiceData({
          patientName: invoice.patientName,
          patientPhone: invoice.patientPhone,
          patientId: invoice.patientId,
          services: invoice.services,
          insuranceProvider: invoice.insuranceProvider || '',
          insuranceNumber: invoice.insuranceNumber || '',
          insuranceCoverage: invoice.insuranceCoverage || 0,
          language: invoice.language || 'fr',
          notes: invoice.notes || ''
        });
      }
      setErrors({});
    }
  }, [isOpen, invoice, isCreating]);

  if (!isOpen) return null;

  const serviceTypes = [
    { value: 'consultation', label: 'Consultation', icon: 'Stethoscope' },
    { value: 'pharmacy', label: 'Pharmacie', icon: 'Pill' },
    { value: 'laboratory', label: 'Laboratoire', icon: 'TestTube' },
    { value: 'radiology', label: 'Radiologie', icon: 'Scan' },
    { value: 'surgery', label: 'Chirurgie', icon: 'Scissors' },
    { value: 'emergency', label: 'Urgence', icon: 'Zap' },
    { value: 'hospitalization', label: 'Hospitalisation', icon: 'Bed' },
    { value: 'other', label: 'Autre', icon: 'Plus' }
  ];

  const insuranceProviders = [
    { value: '', label: 'Aucune assurance' },
    { value: 'CNPS', label: 'CNPS' },
    { value: 'Private Insurance', label: 'Assurance privée' },
    { value: 'Corporate', label: 'Assurance entreprise' },
    { value: 'International', label: 'Assurance internationale' }
  ];

  const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const calculateTotals = () => {
    const totalAmount = invoiceData.services.reduce((sum, service) => sum + (service.amount || 0), 0);
    const insuranceAmount = Math.round(totalAmount * (invoiceData.insuranceCoverage / 100));
    const patientAmount = totalAmount - insuranceAmount;
    
    return { totalAmount, insuranceAmount, patientAmount };
  };

  const { totalAmount, insuranceAmount, patientAmount } = calculateTotals();

  const handleServiceChange = (index, field, value) => {
    const newServices = [...invoiceData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setInvoiceData(prev => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setInvoiceData(prev => ({
      ...prev,
      services: [...prev.services, { type: 'consultation', description: '', amount: 0, doctor: '' }]
    }));
  };

  const removeService = (index) => {
    if (invoiceData.services.length > 1) {
      const newServices = invoiceData.services.filter((_, i) => i !== index);
      setInvoiceData(prev => ({ ...prev, services: newServices }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!invoiceData.patientName.trim()) {
      newErrors.patientName = 'Le nom du patient est requis';
    }
    if (!invoiceData.patientPhone.trim()) {
      newErrors.patientPhone = 'Le téléphone du patient est requis';
    }

    invoiceData.services.forEach((service, index) => {
      if (!service.description.trim()) {
        newErrors[`service_${index}_description`] = 'Description requise';
      }
      if (!service.amount || service.amount <= 0) {
        newErrors[`service_${index}_amount`] = 'Montant invalide';
      }
    });

    if (invoiceData.insuranceProvider && !invoiceData.insuranceNumber.trim()) {
      newErrors.insuranceNumber = 'Numéro d\'assurance requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const newInvoice = {
        ...invoiceData,
        totalAmount,
        insuranceAmount,
        patientAmount,
        paidAmount: 0,
        outstandingBalance: patientAmount,
        status: 'pending'
      };

      await onSave(newInvoice);
      onClose();
    } catch (error) {
      console.error('Error saving invoice:', error);
      setErrors({ general: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // Create printable version
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">HospitalCare</h1>
          <p style="color: #666; margin: 5px 0;">Système de Gestion Hospitalière</p>
          <h2 style="color: #333; margin-top: 20px;">FACTURE ${invoice?.id || 'NOUVELLE'}</h2>
        </header>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Informations Patient</h3>
            <p><strong>Nom:</strong> ${invoiceData.patientName}</p>
            <p><strong>Téléphone:</strong> ${invoiceData.patientPhone}</p>
            ${invoiceData.patientId ? `<p><strong>ID Patient:</strong> ${invoiceData.patientId}</p>` : ''}
          </div>
          <div>
            <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Informations Facture</h3>
            <p><strong>Date:</strong> ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}</p>
            <p><strong>Échéance:</strong> ${format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy', { locale: fr })}</p>
            ${invoiceData.insuranceProvider ? `<p><strong>Assurance:</strong> ${invoiceData.insuranceProvider} (${invoiceData.insuranceCoverage}%)</p>` : ''}
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Service</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Montant</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.services.map(service => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px;">${serviceTypes.find(t => t.value === service.type)?.label || service.type}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${service.description}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(service.amount)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr style="background-color: #f5f5f5; font-weight: bold;">
              <td colspan="2" style="border: 1px solid #ddd; padding: 12px; text-align: right;">Total:</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(totalAmount)}</td>
            </tr>
            ${invoiceData.insuranceProvider ? `
              <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 12px; text-align: right;">Pris en charge assurance (${invoiceData.insuranceCoverage}%):</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(insuranceAmount)}</td>
              </tr>
              <tr style="background-color: #e8f5e8; font-weight: bold;">
                <td colspan="2" style="border: 1px solid #ddd; padding: 12px; text-align: right;">À payer par le patient:</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${formatCurrency(patientAmount)}</td>
              </tr>
            ` : ''}
          </tfoot>
        </table>
        
        ${invoiceData.notes ? `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Notes</h3>
            <p>${invoiceData.notes}</p>
          </div>
        ` : ''}
        
        <footer style="text-align: center; border-top: 1px solid #ccc; padding-top: 20px; color: #666;">
          <p>Merci de votre confiance</p>
          <p style="font-size: 12px;">Cette facture a été générée le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}</p>
        </footer>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${invoice?.id || 'NOUVELLE'}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: A4; margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {isCreating ? 'Nouvelle Facture' : `Facture ${invoice?.id}`}
            </h2>
            {!isCreating && invoice && (
              <p className="text-sm text-muted-foreground">
                Créée le {format(new Date(invoice.invoiceDate), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCreating && (
              <Button variant="outline" onClick={handlePrint}>
                <Icon name="Printer" size={16} className="mr-2" />
                Imprimer
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Informations Patient</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom du patient *
                  </label>
                  <Input
                    type="text"
                    value={invoiceData.patientName}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientName: e.target.value }))}
                    error={errors.patientName}
                    disabled={!isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    value={invoiceData.patientPhone}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientPhone: e.target.value }))}
                    error={errors.patientPhone}
                    disabled={!isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ID Patient
                  </label>
                  <Input
                    type="text"
                    value={invoiceData.patientId}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientId: e.target.value }))}
                    disabled={!isCreating}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Assurance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Assureur
                  </label>
                  <Select
                    value={invoiceData.insuranceProvider}
                    onValueChange={(value) => setInvoiceData(prev => ({ ...prev, insuranceProvider: value }))}
                    options={insuranceProviders}
                    disabled={!isCreating}
                  />
                </div>
                {invoiceData.insuranceProvider && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Numéro d'assurance
                      </label>
                      <Input
                        type="text"
                        value={invoiceData.insuranceNumber}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                        error={errors.insuranceNumber}
                        disabled={!isCreating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Taux de couverture (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={invoiceData.insuranceCoverage}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, insuranceCoverage: parseInt(e.target.value) || 0 }))}
                        disabled={!isCreating}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Services</h3>
              {isCreating && (
                <Button type="button" variant="outline" onClick={addService}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Ajouter un service
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {invoiceData.services.map((service, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Type de service
                      </label>
                      <Select
                        value={service.type}
                        onValueChange={(value) => handleServiceChange(index, 'type', value)}
                        options={serviceTypes.map(type => ({
                          value: type.value,
                          label: type.label
                        }))}
                        disabled={!isCreating}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Description *
                      </label>
                      <Input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        error={errors[`service_${index}_description`]}
                        disabled={!isCreating}
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Montant (FCFA) *
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={service.amount}
                          onChange={(e) => handleServiceChange(index, 'amount', parseInt(e.target.value) || 0)}
                          error={errors[`service_${index}_amount`]}
                          disabled={!isCreating}
                        />
                      </div>
                      {isCreating && invoiceData.services.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeService(index)}
                          className="text-error hover:bg-error/10"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                  {(service.type === 'consultation' || service.type === 'surgery') && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Médecin
                      </label>
                      <Input
                        type="text"
                        value={service.doctor || ''}
                        onChange={(e) => handleServiceChange(index, 'doctor', e.target.value)}
                        placeholder="Nom du médecin"
                        disabled={!isCreating}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-muted/20 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total des services</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
              </div>
              {invoiceData.insuranceProvider && (
                <>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Pris en charge</p>
                    <p className="text-xl font-bold text-success">{formatCurrency(insuranceAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">À payer</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(patientAmount)}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Langue de la facture
              </label>
              <Select
                value={invoiceData.language}
                onValueChange={(value) => setInvoiceData(prev => ({ ...prev, language: value }))}
                options={languages}
                disabled={!isCreating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes additionnelles..."
                disabled={!isCreating}
              />
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-error" />
                <span className="text-sm text-error">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              {isCreating ? 'Annuler' : 'Fermer'}
            </Button>
            {isCreating && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={16} className="mr-2" />
                    Créer la Facture
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;