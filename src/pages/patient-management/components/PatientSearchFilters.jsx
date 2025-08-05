import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PatientSearchFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    bloodType: '',
    gender: '',
    ageRange: '',
    lastVisitRange: '',
    assignedDoctor: '',
    status: ''
  });

  const bloodTypeOptions = [
    { value: '', label: 'Tous les groupes sanguins' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  const genderOptions = [
    { value: '', label: 'Tous les genres' },
    { value: 'male', label: 'Masculin' },
    { value: 'female', label: 'Féminin' },
    { value: 'other', label: 'Autre' }
  ];

  const ageRangeOptions = [
    { value: '', label: 'Tous les âges' },
    { value: '0-17', label: '0-17 ans (Pédiatrie)' },
    { value: '18-35', label: '18-35 ans (Jeune adulte)' },
    { value: '36-55', label: '36-55 ans (Adulte)' },
    { value: '56-75', label: '56-75 ans (Senior)' },
    { value: '75+', label: '75+ ans (Gériatrie)' }
  ];

  const lastVisitOptions = [
    { value: '', label: 'Toutes les visites' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: '3months', label: '3 derniers mois' },
    { value: '6months', label: '6 derniers mois' },
    { value: 'year', label: 'Cette année' }
  ];

  const doctorOptions = [
    { value: '', label: 'Tous les médecins' },
    { value: 'dr-martin', label: 'Dr. Jean Martin' },
    { value: 'dr-kouam', label: 'Dr. Marie Kouam' },
    { value: 'dr-ngono', label: 'Dr. Paul Ngono' },
    { value: 'dr-mbarga', label: 'Dr. Claire Mbarga' },
    { value: 'dr-fouda', label: 'Dr. André Fouda' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'hospitalized', label: 'Hospitalisé' },
    { value: 'discharged', label: 'Sorti' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      searchTerm: '',
      bloodType: '',
      gender: '',
      ageRange: '',
      lastVisitRange: '',
      assignedDoctor: '',
      status: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Search" size={20} className="mr-2" />
          Filtres de Recherche
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
          placeholder="Nom, téléphone, numéro médical..."
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          className="w-full"
        />

        {/* Blood Type */}
        <Select
          label="Groupe sanguin"
          options={bloodTypeOptions}
          value={filters.bloodType}
          onChange={(value) => handleFilterChange('bloodType', value)}
        />

        {/* Gender */}
        <Select
          label="Genre"
          options={genderOptions}
          value={filters.gender}
          onChange={(value) => handleFilterChange('gender', value)}
        />

        {/* Age Range */}
        <Select
          label="Tranche d'âge"
          options={ageRangeOptions}
          value={filters.ageRange}
          onChange={(value) => handleFilterChange('ageRange', value)}
        />

        {/* Last Visit */}
        <Select
          label="Dernière visite"
          options={lastVisitOptions}
          value={filters.lastVisitRange}
          onChange={(value) => handleFilterChange('lastVisitRange', value)}
        />

        {/* Assigned Doctor */}
        <Select
          label="Médecin assigné"
          options={doctorOptions}
          value={filters.assignedDoctor}
          onChange={(value) => handleFilterChange('assignedDoctor', value)}
          searchable
        />

        {/* Status */}
        <Select
          label="Statut"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
      </div>

      {/* Quick Filter Buttons */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground mb-3">Filtres rapides</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('lastVisitRange', 'today')}
            className="text-xs"
          >
            <Icon name="Calendar" size={14} className="mr-1" />
            Aujourd'hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('status', 'hospitalized')}
            className="text-xs"
          >
            <Icon name="Bed" size={14} className="mr-1" />
            Hospitalisés
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('ageRange', '0-17')}
            className="text-xs"
          >
            <Icon name="Baby" size={14} className="mr-1" />
            Pédiatrie
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('ageRange', '75+')}
            className="text-xs"
          >
            <Icon name="Users" size={14} className="mr-1" />
            Gériatrie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientSearchFilters;