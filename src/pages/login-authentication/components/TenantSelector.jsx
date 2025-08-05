import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import authService from '../../../utils/authService';
import Icon from '../../../components/AppIcon';

const TenantSelector = ({ selectedTenant, onTenantChange, language, error }) => {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        
        const result = await authService.getOrganizations();
        
        if (result?.success) {
          setOrganizations(result.data || []);
        } else {
          setLoadError(result?.error || 'Failed to load organizations');
        }
      } catch (error) {
        setLoadError('Failed to load organizations');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  // Mock options as fallback when Supabase is not available
  const mockOptions = [
    {
      id: 'chu-yaounde',
      name: language === 'fr' ? 'Centre Hospitalier de Yaoundé' : 'Yaoundé Medical Center',
      slug: 'chu-yaounde',
      plan: 'professional'
    },
    {
      id: 'clinique-sainte-marie',
      name: language === 'fr' ? 'Clinique Sainte Marie' : 'Sainte Marie Clinic',
      slug: 'clinique-sainte-marie',
      plan: 'basic'
    },
    {
      id: 'hopital-central',
      name: language === 'fr' ? 'Hôpital Central de Yaoundé' : 'Yaoundé Central Hospital',
      slug: 'hopital-central',
      plan: 'enterprise'
    },
    {
      id: 'clinique-des-oliviers',
      name: language === 'fr' ? 'Clinique des Oliviers' : 'Oliviers Clinic',
      slug: 'clinique-des-oliviers',
      plan: 'basic'
    }
  ];

  const displayOptions = organizations?.length > 0 ? organizations : mockOptions;

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan) => {
    switch (plan) {
      case 'basic':
        return language === 'fr' ? 'Basique' : 'Basic';
      case 'professional':
        return language === 'fr' ? 'Professionnel' : 'Professional';
      case 'enterprise':
        return language === 'fr' ? 'Entreprise' : 'Enterprise';
      default:
        return plan;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {language === 'fr' ? 'Sélectionner l\'établissement' : 'Select Organization'}
        </label>
        <div className="flex items-center justify-center p-4 border border-border rounded-lg bg-muted/30">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
          <span className="text-sm text-muted-foreground">
            {language === 'fr' ? 'Chargement des établissements...' : 'Loading organizations...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {language === 'fr' ? 'Sélectionner l\'établissement' : 'Select Organization'}
        <span className="text-error ml-1">*</span>
      </label>

      {loadError && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={14} className="text-warning" />
            <span className="text-xs text-warning">
              {language === 'fr' ? 'Utilisation des données de démonstration (Supabase non connecté)': 'Using demo data (Supabase not connected)'
              }
            </span>
          </div>
        </div>
      )}

      <Select
        value={selectedTenant}
        onValueChange={onTenantChange}
        placeholder={language === 'fr' ? 'Choisir un établissement...' : 'Choose an organization...'}
        error={error}
      >
        {displayOptions?.map((org) => (
          <div key={org.id || org.slug} className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted/50 rounded">
            <div className="flex-1">
              <div className="font-medium text-foreground">{org.name}</div>
              <div className="text-xs text-muted-foreground">{org.slug}</div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeColor(org.plan)}`}>
              {getPlanLabel(org.plan)}
            </span>
          </div>
        ))}
      </Select>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        {language === 'fr' ? 'Sélectionnez l\'établissement auquel vous appartenez pour vous connecter.' : 'Select the organization you belong to in order to sign in.'
        }
      </p>

      {/* Organization Status Indicator */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${organizations?.length > 0 ? 'bg-success' : 'bg-warning'}`}></div>
        <span>
          {organizations?.length > 0 
            ? (language === 'fr' ? 'Connecté à Supabase' : 'Connected to Supabase')
            : (language === 'fr' ? 'Mode démonstration' : 'Demo mode')
          }
        </span>
      </div>
    </div>
  );
};

export default TenantSelector;