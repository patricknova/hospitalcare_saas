import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import authService from '../../../utils/authService';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ language, selectedTenant, onShowTwoFactor }) => {
  const navigate = useNavigate();
  const { signIn, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

  // Clear auth errors when component mounts or form data changes
  useEffect(() => {
    clearError();
  }, [formData.email, formData.password, clearError]);

  // Mock credentials for different user types (updated with real Supabase accounts)
  const mockCredentials = {
    admin: {
      email: 'admin@hospitalcare.cm',
      password: 'Admin123!',
      role: 'Administrateur'
    },
    doctor: {
      email: 'dr.martin@hospitalcare.cm',
      password: 'Doctor123!',
      role: 'Médecin'
    },
    nurse: {
      email: 'nurse.marie@hospitalcare.cm',
      password: 'Nurse123!',
      role: 'Infirmière'
    },
    receptionist: {
      email: 'reception@hospitalcare.cm',
      password: 'Reception123!',
      role: 'Réceptionniste'
    },
    patient: {
      email: 'patient@hospitalcare.cm',
      password: 'Patient123!',
      role: 'Patient'
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedTenant) {
      newErrors.tenant = language === 'fr' ? 'Veuillez sélectionner un établissement' : 'Please select a facility';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    clearError();

    try {
      // Use real Supabase authentication
      const result = await signIn(formData.email, formData.password);

      if (!result?.success) {
        setIsLoading(false);
        return;
      }

      // Store additional login state for compatibility
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('selectedTenant', selectedTenant);
      localStorage.setItem('currentLanguage', language);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Simulate 2FA check (randomly trigger for demo - 30% chance)
      const requires2FA = Math.random() > 0.7;
      
      if (requires2FA && onShowTwoFactor) {
        onShowTwoFactor();
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      navigate('/dashboard-overview');

    } catch (error) {
      setErrors({
        general: language === 'fr' ? 'Erreur de connexion. Veuillez réessayer.' : 'Connection error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert(language === 'fr' ? 'Veuillez saisir votre email d\'abord.' : 'Please enter your email first.');
      return;
    }

    try {
      const result = await authService.resetPassword(formData.email);
      if (result?.success) {
        alert(language === 'fr' ? 'Un email de récupération a été envoyé à votre adresse.': 'A recovery email has been sent to your address.'
        );
      } else {
        alert(result?.error || (language === 'fr' ? 'Erreur lors de l\'envoi de l\'email de récupération.' : 'Error sending recovery email.'
        ));
      }
    } catch (error) {
      alert(language === 'fr' ? 'Erreur lors de l\'envoi de l\'email de récupération.' : 'Error sending recovery email.'
      );
    }
  };

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

      {/* Email Field */}
      <Input
        label={language === 'fr' ? 'Adresse email' : 'Email address'}
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder={language === 'fr' ? 'votre.email@hopital.cm' : 'your.email@hospital.cm'}
        error={errors.email}
        required
        disabled={isLoading}
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          label={language === 'fr' ? 'Mot de passe' : 'Password'}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder={language === 'fr' ? 'Entrez votre mot de passe' : 'Enter your password'}
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Checkbox
          label={language === 'fr' ? 'Se souvenir de moi' : 'Remember me'}
          checked={formData.rememberMe}
          onChange={handleInputChange}
          name="rememberMe"
          disabled={isLoading}
        />
        
        <Button
          type="button"
          variant="link"
          onClick={handleForgotPassword}
          className="text-sm"
          disabled={isLoading}
        >
          {language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
        </Button>
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
        {language === 'fr' ? 'Se Connecter' : 'Sign In'}
      </Button>

      {/* Mock Credentials Helper - Show real Supabase accounts */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">
          {language === 'fr' ? 'Comptes de démonstration (Supabase) :' : 'Demo Accounts (Supabase):'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {Object.entries(mockCredentials).map(([key, cred]) => (
            <div key={key} className="space-y-1">
              <div className="font-medium text-primary">{cred.role}</div>
              <div className="text-muted-foreground">{cred.email}</div>
              <div className="text-muted-foreground">{cred.password}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-2 bg-primary/5 rounded text-xs text-primary">
          <Icon name="Info" size={12} className="inline mr-1" />
          {language === 'fr' ? 'Ces comptes sont créés dans Supabase et utilisent une vraie authentification.': 'These accounts are created in Supabase and use real authentication.'
          }
        </div>
      </div>
    </form>
  );
};

export default LoginForm;