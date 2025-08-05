import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BillingFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    paymentMethod: '',
    insuranceProvider: '',
    dateRange: '',
    amountRange: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      searchTerm: '',
      status: '',
      paymentMethod: '',
      insuranceProvider: '',
      dateRange: '',
      amountRange: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'paid', label: 'Payé' },
    { value: 'partial', label: 'Partiellement payé' },
    { value: 'overdue', label: 'En retard' },
    { value: 'cancelled', label: 'Annulé' }
  ];

  const paymentMethodOptions = [
    { value: '', label: 'Tous les moyens' },
    { value: 'cash', label: 'Espèces' },
    { value: 'card', label: 'Carte bancaire' },
    { value: 'bank_transfer', label: 'Virement bancaire' },
    { value: 'mtn_money', label: 'MTN Mobile Money' },
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'check', label: 'Chèque' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd\'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: 'year', label: 'Cette année' }
  ];

  const amountRangeOptions = [
    { value: '', label: 'Tous les montants' },
    { value: '0-10', label: '0 - 10,000 FCFA' },
    { value: '10-25', label: '10,000 - 25,000 FCFA' },
    { value: '25-50', label: '25,000 - 50,000 FCFA' },
    { value: '50-100', label: '50,000 - 100,000 FCFA' },
    { value: '100+', label: '100,000+ FCFA' }
  ];

  const insuranceProviders = [
    { value: '', label: 'Tous les assureurs' },
    { value: 'cnps', label: 'CNPS' },
    { value: 'private', label: 'Assurance privée' },
    { value: 'none', label: 'Sans assurance' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Icon name="X" size={16} className="mr-1" />
          Effacer
        </Button>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Rechercher
          </label>
          <Input
            type="text"
            placeholder="Patient, N° facture, téléphone..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Statut de paiement
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
            options={statusOptions}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Moyen de paiement
          </label>
          <Select
            value={filters.paymentMethod}
            onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            options={paymentMethodOptions}
          />
        </div>

        {/* Insurance Provider */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Assureur
          </label>
          <Select
            value={filters.insuranceProvider}
            onValueChange={(value) => handleFilterChange('insuranceProvider', value)}
            options={insuranceProviders}
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Période
          </label>
          <Select
            value={filters.dateRange}
            onValueChange={(value) => handleFilterChange('dateRange', value)}
            options={dateRangeOptions}
          />
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Montant
          </label>
          <Select
            value={filters.amountRange}
            onValueChange={(value) => handleFilterChange('amountRange', value)}
            options={amountRangeOptions}
          />
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Actions rapides</h4>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleFilterChange('status', 'overdue')}
            >
              <Icon name="AlertTriangle" size={16} className="mr-2 text-error" />
              Factures en retard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleFilterChange('status', 'pending')}
            >
              <Icon name="Clock" size={16} className="mr-2 text-warning" />
              En attente de paiement
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => handleFilterChange('dateRange', 'today')}
            >
              <Icon name="Calendar" size={16} className="mr-2 text-primary" />
              Factures du jour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingFilters;