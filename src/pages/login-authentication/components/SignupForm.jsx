import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../../../utils/authService';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SignupForm = ({ language, selectedTenant, onSuccess }) => {
  const { signUp, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  // Load organizations on component mount
  useEffect(() => {
    const loadOrganizations = async () => {
      const result = await authService.getOrganizations();
      if (result?.success) {
        setOrganizations(result.data || []);
      }
    };
    loadOrganizations();
  }, []);

  // Clear auth errors when form data changes
  useEffect(() => {
    clearError();
  }, [formData, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedTenant) {
      newErrors.tenant = language === 'fr' ? 'Veuillez sélectionner un établissement' : 'Please select an organization';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'fr' ? 'Le prénom est requis' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'fr' ? 'Le nom est requis' : 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'Format d\'email invalide' : 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = language === 'fr' ? 'Le mot de passe est requis' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = language === 'fr' ? 'Confirmez le mot de passe' : 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match';
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = language === 'fr' ? 'Format de téléphone invalide' : 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();

    try {
      // Find selected organization
      const selectedOrg = organizations.find(org => org.slug === selectedTenant || org.id === selectedTenant);

      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
        phone: formData.phone?.trim() || null,
        organizationId: selectedOrg?.id || null
      };

      const result = await signUp(formData.email, formData.password, userData);

      if (result?.success) {
        if (onSuccess) {
          onSuccess(result.data);
        }
      }

    } catch (error) {
      setErrors({
        general: language === 'fr' ? 'Erreur lors de la création du compte. Veuillez réessayer.' : 'Error creating account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'patient', label: language === 'fr' ? 'Patient' : 'Patient' },
    { value: 'doctor', label: language === 'fr' ? 'Médecin' : 'Doctor' },
    { value: 'nurse', label: language === 'fr' ? 'Infirmier(ère)' : 'Nurse' },
    { value: 'receptionist', label: language === 'fr' ? 'Réceptionniste' : 'Receptionist' },
    { value: 'pharmacist', label: language === 'fr' ? 'Pharmacien' : 'Pharmacist' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error - Display authError from context */}
      {(authError || errors.general) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm text-error font-medium">
              {authError || errors.general}
            </span>
          </div>
        </div>
      )}

      {/* Tenant Error */}
      {errors.tenant && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">{errors.tenant}</span>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={language === 'fr' ? 'Prénom' : 'First Name'}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder={language === 'fr' ? 'Votre prénom' : 'Your first name'}
          error={errors.firstName}
          required
          disabled={isLoading}
        />

        <Input
          label={language === 'fr' ? 'Nom' : 'Last Name'}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder={language === 'fr' ? 'Votre nom' : 'Your last name'}
          error={errors.lastName}
          required
          disabled={isLoading}
        />
      </div>

      {/* Email Field */}
      <Input
        label={language === 'fr' ? 'Adresse email' : 'Email Address'}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder={language === 'fr' ? 'votre.email@hopital.cm' : 'your.email@hospital.cm'}
        error={errors.email}
        required
        disabled={isLoading}
      />

      {/* Phone Field */}
      <Input
        label={language === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)'}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder={language === 'fr' ? '+237 6XX XXX XXX' : '+237 6XX XXX XXX'}
        error={errors.phone}
        disabled={isLoading}
      />

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {language === 'fr' ? 'Rôle dans l\'établissement' : 'Role in Organization'}
        </label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleInputChange({ target: { name: 'role', value } })}
          disabled={isLoading}
        >
          {roleOptions.map((option) => (
            <div key={option.value} className="p-2 cursor-pointer hover:bg-muted/50 rounded">
              {option.label}
            </div>
          ))}
        </Select>
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label={language === 'fr' ? 'Mot de passe' : 'Password'}
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={language === 'fr' ? 'Minimum 6 caractères' : 'Minimum 6 characters'}
            error={errors.password}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 h-8 w-8"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
          </Button>
        </div>

        <div className="relative">
          <Input
            label={language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder={language === 'fr' ? 'Répétez le mot de passe' : 'Repeat password'}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 h-8 w-8"
            disabled={isLoading}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={16} />
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={!selectedTenant}
        className="h-12"
      >
        {language === 'fr' ? 'Créer le Compte' : 'Create Account'}
      </Button>

      {/* Terms Notice */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>
          {language === 'fr' ? 'En créant un compte, vous acceptez nos': 'By creating an account, you agree to our'
          }
        </p>
        <div className="space-x-4">
          <button type="button" className="text-primary hover:underline">
            {language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service'}
          </button>
          <span>•</span>
          <button type="button" className="text-primary hover:underline">
            {language === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;