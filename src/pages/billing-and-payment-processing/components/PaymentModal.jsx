import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentModal = ({ isOpen, onClose, invoice, onPaymentComplete }) => {
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: '',
    reference: '',
    notes: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankAccount: '',
    checkNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && invoice) {
      setPaymentData({
        amount: invoice.outstandingBalance,
        method: '',
        reference: '',
        notes: '',
        phoneNumber: invoice.patientPhone || '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        bankAccount: '',
        checkNumber: ''
      });
      setErrors({});
    }
  }, [isOpen, invoice]);

  if (!isOpen || !invoice) return null;

  const paymentMethods = [
    { value: 'cash', label: 'Espèces', icon: 'Banknote' },
    { value: 'card', label: 'Carte bancaire', icon: 'CreditCard' },
    { value: 'bank_transfer', label: 'Virement bancaire', icon: 'Building2' },
    { value: 'mtn_money', label: 'MTN Mobile Money', icon: 'Smartphone' },
    { value: 'orange_money', label: 'Orange Money', icon: 'Smartphone' },
    { value: 'check', label: 'Chèque', icon: 'FileText' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Le montant doit être supérieur à 0';
    }
    if (paymentData.amount > invoice.outstandingBalance) {
      newErrors.amount = 'Le montant ne peut pas être supérieur au solde dû';
    }
    if (!paymentData.method) {
      newErrors.method = 'Veuillez sélectionner un moyen de paiement';
    }

    // Method-specific validations
    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        newErrors.cardNumber = 'Numéro de carte invalide';
      }
      if (!paymentData.expiryDate) {
        newErrors.expiryDate = "Date d'expiration requise";
      }
      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        newErrors.cvv = 'CVV invalide';
      }
    }

    if (paymentData.method === 'mtn_money' || paymentData.method === 'orange_money') {
      if (!paymentData.phoneNumber || paymentData.phoneNumber.length < 9) {
        newErrors.phoneNumber = 'Numéro de téléphone invalide';
      }
    }

    if (paymentData.method === 'bank_transfer') {
      if (!paymentData.bankAccount) {
        newErrors.bankAccount = 'Numéro de compte requis';
      }
      if (!paymentData.reference) {
        newErrors.reference = 'Référence de virement requise';
      }
    }

    if (paymentData.method === 'check') {
      if (!paymentData.checkNumber) {
        newErrors.checkNumber = 'Numéro de chèque requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate reference if not provided
      const reference = paymentData.reference || `PAY-${Date.now()}`;

      onPaymentComplete(invoice.id, {
        ...paymentData,
        reference,
        processedAt: new Date().toISOString()
      });

      onClose();
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({ general: 'Erreur lors du traitement du paiement' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderPaymentFields = () => {
    switch (paymentData.method) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro de carte
              </label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                maxLength={19}
                error={errors.cardNumber}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date d'expiration
                </label>
                <Input
                  type="text"
                  placeholder="MM/AA"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value.replace(/(\d{2})(\d{2})/, '$1/$2'))}
                  maxLength={5}
                  error={errors.expiryDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVV
                </label>
                <Input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength={4}
                  error={errors.cvv}
                />
              </div>
            </div>
          </div>
        );

      case 'mtn_money': case'orange_money':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Numéro de téléphone
            </label>
            <Input
              type="tel"
              placeholder="+237 6XX XXX XXX"
              value={paymentData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              error={errors.phoneNumber}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Un code de confirmation sera envoyé par SMS
            </p>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Numéro de compte
              </label>
              <Input
                type="text"
                placeholder="Numéro de compte bancaire"
                value={paymentData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                error={errors.bankAccount}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Référence de virement
              </label>
              <Input
                type="text"
                placeholder="Référence du virement"
                value={paymentData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                error={errors.reference}
              />
            </div>
          </div>
        );

      case 'check':
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Numéro de chèque
            </label>
            <Input
              type="text"
              placeholder="Numéro du chèque"
              value={paymentData.checkNumber}
              onChange={(e) => handleInputChange('checkNumber', e.target.value)}
              error={errors.checkNumber}
            />
          </div>
        );

      case 'cash':
        return (
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-foreground">
              <Icon name="Info" size={16} className="text-primary" />
              <span>Paiement en espèces - Assurez-vous d'avoir la monnaie exacte</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Traitement du Paiement</h2>
            <p className="text-sm text-muted-foreground">
              Facture {invoice.id} - {invoice.patientName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Invoice Summary */}
          <div className="bg-muted/20 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Montant total:</span>
                <span className="font-medium text-foreground ml-2">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Déjà payé:</span>
                <span className="font-medium text-success ml-2">
                  {formatCurrency(invoice.paidAmount)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Solde dû:</span>
                <span className="font-medium text-error ml-2">
                  {formatCurrency(invoice.outstandingBalance)}
                </span>
              </div>
              {invoice.insuranceProvider && (
                <div>
                  <span className="text-muted-foreground">Assurance:</span>
                  <span className="font-medium text-primary ml-2">
                    {invoice.insuranceProvider} ({invoice.insuranceCoverage}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Montant à payer (FCFA)
              </label>
              <Input
                type="number"
                value={paymentData.amount}
                onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                min="1"
                max={invoice.outstandingBalance}
                error={errors.amount}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Moyen de paiement
              </label>
              <Select
                value={paymentData.method}
                onValueChange={(value) => handleInputChange('method', value)}
                options={paymentMethods.map(method => ({
                  value: method.value,
                  label: method.label
                }))}
                error={errors.method}
              />
            </div>

            {/* Method-specific fields */}
            {paymentData.method && renderPaymentFields()}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes (optionnel)
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows="3"
                placeholder="Notes sur le paiement..."
                value={paymentData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <span className="text-sm text-error">{errors.general}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} className="mr-2" />
                  Confirmer le Paiement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;