import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InventoryFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    supplier: '',
    stockStatus: '',
    expirationStatus: '',
    prescriptionRequired: '',
    refrigerated: ''
  });

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
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

  const stockStatusOptions = [
    { value: '', label: 'Tous les statuts de stock' },
    { value: 'available', label: 'Stock disponible' },
    { value: 'low_stock', label: 'Stock faible' },
    { value: 'critical_stock', label: 'Stock critique' },
    { value: 'out_of_stock', label: 'Rupture de stock' }
  ];

  const expirationStatusOptions = [
    { value: '', label: 'Toutes les expirations' },
    { value: 'valid', label: 'Valide (>30 jours)' },
    { value: 'expiring_soon', label: 'Expire bientôt (<30 jours)' },
    { value: 'expired', label: 'Expiré' }
  ];

  const booleanOptions = [
    { value: '', label: 'Tous' },
    { value: true, label: 'Oui' },
    { value: false, label: 'Non' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      searchTerm: '',
      category: '',
      supplier: '',
      stockStatus: '',
      expirationStatus: '',
      prescriptionRequired: '',
      refrigerated: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filtres d'Inventaire
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} className="mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search Term */}
        <Input
          label="Recherche générale"
          type="search"
          placeholder="Nom, code-barres, lot..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full"
        />

        {/* Category */}
        <Select
          label="Catégorie"
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Supplier */}
        <Input
          label="Fournisseur"
          type="text"
          placeholder="Nom du fournisseur..."
          value={filters.supplier}
          onChange={(e) => handleFilterChange('supplier', e.target.value)}
          className="w-full"
        />

        {/* Stock Status */}
        <Select
          label="Statut du stock"
          options={stockStatusOptions}
          value={filters.stockStatus}
          onChange={(value) => handleFilterChange('stockStatus', value)}
        />

        {/* Expiration Status */}
        <Select
          label="Statut d'expiration"
          options={expirationStatusOptions}
          value={filters.expirationStatus}
          onChange={(value) => handleFilterChange('expirationStatus', value)}
        />

        {/* Prescription Required */}
        <Select
          label="Prescription requise"
          options={booleanOptions}
          value={filters.prescriptionRequired}
          onChange={(value) => handleFilterChange('prescriptionRequired', value)}
        />

        {/* Refrigerated */}
        <Select
          label="Réfrigération"
          options={booleanOptions}
          value={filters.refrigerated}
          onChange={(value) => handleFilterChange('refrigerated', value)}
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">Filtres rapides</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('stockStatus', 'low_stock')}
            className="text-xs"
          >
            <Icon name="AlertTriangle" size={14} className="mr-1" />
            Stock Faible
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('expirationStatus', 'expiring_soon')}
            className="text-xs"
          >
            <Icon name="Clock" size={14} className="mr-1" />
            Expire Bientôt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('prescriptionRequired', true)}
            className="text-xs"
          >
            <Icon name="FileText" size={14} className="mr-1" />
            Prescription
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('refrigerated', true)}
            className="text-xs"
          >
            <Icon name="Snowflake" size={14} className="mr-1" />
            Réfrigéré
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;