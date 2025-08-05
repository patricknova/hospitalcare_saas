import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const LabFilters = ({ onFiltersChange, onClearFilters, activeTab }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    department: '',
    priority: '',
    category: '',
    dateRange: ''
  });

  const statusOptions = {
    orders: [
      { value: '', label: 'Tous les statuts' },
      { value: 'pending', label: 'En attente' },
      { value: 'in_progress', label: 'En cours' },
      { value: 'completed', label: 'Terminé' },
      { value: 'cancelled', label: 'Annulé' }
    ],
    samples: [
      { value: '', label: 'Tous les statuts' },
      { value: 'collected', label: 'Collecté' },
      { value: 'processing', label: 'En traitement' },
      { value: 'completed', label: 'Traité' },
      { value: 'rejected', label: 'Rejeté' }
    ],
    results: [
      { value: '', label: 'Tous les statuts' },
      { value: 'pending', label: 'En attente' },
      { value: 'validated', label: 'Validé' },
      { value: 'critical', label: 'Critique' },
      { value: 'reported', label: 'Rapporté' }
    ]
  };

  const departmentOptions = [
    { value: '', label: 'Tous les départements' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'urgences', label: 'Urgences' },
    { value: 'pediatrie', label: 'Pédiatrie' },
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'pneumologie', label: 'Pneumologie' },
    { value: 'neurologie', label: 'Neurologie' },
    { value: 'gastro', label: 'Gastro-entérologie' },
    { value: 'chirurgie', label: 'Chirurgie' }
  ];

  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'routine', label: 'Routine' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critique' },
    { value: 'stat', label: 'STAT' }
  ];

  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'hematologie', label: 'Hématologie' },
    { value: 'biochimie', label: 'Biochimie' },
    { value: 'microbiologie', label: 'Microbiologie' },
    { value: 'immunologie', label: 'Immunologie' },
    { value: 'parasitologie', label: 'Parasitologie' },
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'endocrinologie', label: 'Endocrinologie' },
    { value: 'urologie', label: 'Urologie' },
    { value: 'toxicologie', label: 'Toxicologie' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Toutes les dates' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      searchTerm: '',
      status: '',
      department: '',
      priority: '',
      category: '',
      dateRange: ''
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
          Filtres
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
          label="Recherche"
          type="search"
          placeholder="Patient, ID, code-barres..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full"
        />

        {/* Status */}
        <Select
          label="Statut"
          options={statusOptions[activeTab] || statusOptions.orders}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        {/* Department */}
        <Select
          label="Département"
          options={departmentOptions}
          value={filters.department}
          onChange={(value) => handleFilterChange('department', value)}
        />

        {/* Priority */}
        <Select
          label="Priorité"
          options={priorityOptions}
          value={filters.priority}
          onChange={(value) => handleFilterChange('priority', value)}
        />

        {/* Category */}
        <Select
          label="Catégorie"
          options={categoryOptions}
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        {/* Date Range */}
        <Select
          label="Période"
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">Filtres rapides</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('priority', 'urgent')}
            className="text-xs"
          >
            <Icon name="AlertTriangle" size={14} className="mr-1" />
            Urgent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('dateRange', 'today')}
            className="text-xs"
          >
            <Icon name="Calendar" size={14} className="mr-1" />
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('status', activeTab === 'results' ? 'critical' : 'in_progress')}
            className="text-xs"
          >
            <Icon name="Clock" size={14} className="mr-1" />
            {activeTab === 'results' ? 'Critique' : 'En cours'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabFilters;