import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantBranding from './components/TenantBranding';
import LanguageSwitcher from './components/LanguageSwitcher';
import TenantSelector from './components/TenantSelector';
import LoginForm from './components/LoginForm';
import TwoFactorModal from './components/TwoFactorModal';
import Icon from '../../components/AppIcon';

const LoginAuthentication = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('fr');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tenantError, setTenantError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard-overview');
      return;
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('currentLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load remembered tenant
    const rememberedTenant = localStorage.getItem('selectedTenant');
    if (rememberedTenant) {
      setSelectedTenant(rememberedTenant);
    }
  }, [navigate]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('currentLanguage', newLanguage);
  };

  const handleTenantChange = (tenantValue) => {
    setSelectedTenant(tenantValue);
    setTenantError('');
  };

  const handleShowTwoFactor = () => {
    setShowTwoFactor(true);
  };

  const handleCloseTwoFactor = () => {
    setShowTwoFactor(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Tenant Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5">
        <TenantBranding 
          tenant={selectedTenant}
          language={language}
        />
      </div>

      {/* Right Side - Authentication Form */}
      <div className="flex-1 lg:w-1/2 xl:w-3/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HospitalCare</h1>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Système de Gestion Hospitalière' : 'Hospital Management System'}
              </p>
            </div>
          </div>
          
          <LanguageSwitcher 
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                {language === 'fr' ? 'Bienvenue' : 'Welcome'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'fr' ?'Connectez-vous à votre compte pour accéder au système' :'Sign in to your account to access the system'
                }
              </p>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Heart" size={32} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {language === 'fr' ? 'Centre Hospitalier de Yaoundé' : 'Yaoundé Medical Center'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'fr' ? 'Excellence en Soins de Santé' : 'Excellence in Healthcare'}
              </p>
            </div>

            {/* Tenant Selection */}
            <TenantSelector
              selectedTenant={selectedTenant}
              onTenantChange={handleTenantChange}
              language={language}
              error={tenantError}
            />

            {/* Login Form */}
            <LoginForm
              language={language}
              selectedTenant={selectedTenant}
              onShowTwoFactor={handleShowTwoFactor}
            />

            {/* Security Notice */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} />
                <span>
                  {language === 'fr' ?'Connexion sécurisée SSL' :'Secure SSL Connection'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {language === 'fr' ? 'Besoin d\'aide ?' : 'Need help?'}
              </span>
              <button className="text-primary hover:underline">
                {language === 'fr' ? 'Support technique' : 'Technical Support'}
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <button className="hover:text-foreground">
                {language === 'fr' ? 'Confidentialité' : 'Privacy'}
              </button>
              <button className="hover:text-foreground">
                {language === 'fr' ? 'Conditions' : 'Terms'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={showTwoFactor}
        onClose={handleCloseTwoFactor}
        language={language}
      />
    </div>
  );
};

export default LoginAuthentication;