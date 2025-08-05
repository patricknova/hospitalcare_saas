import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TwoFactorModal = ({ isOpen, onClose, language }) => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Mock verification code
  const mockVerificationCode = '123456';

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError(language === 'fr' ?'Veuillez entrer le code de vérification' :'Please enter verification code'
      );
      return;
    }

    if (verificationCode.length !== 6) {
      setError(language === 'fr' ?'Le code doit contenir 6 chiffres' :'Code must be 6 digits'
      );
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (verificationCode !== mockVerificationCode) {
        setError(language === 'fr' ?'Code de vérification incorrect' :'Invalid verification code'
        );
        setIsLoading(false);
        return;
      }

      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('twoFactorVerified', 'true');

      // Redirect to dashboard
      navigate('/dashboard-overview');
      onClose();

    } catch (error) {
      setError(language === 'fr' ?'Erreur de vérification. Veuillez réessayer.' :'Verification error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setTimeLeft(300);
    setError('');
    
    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(language === 'fr' 
      ? `Nouveau code envoyé. Code de démonstration: ${mockVerificationCode}` 
      : `New code sent. Demo code: ${mockVerificationCode}`
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100 p-4">
      <div className="bg-card border border-border rounded-xl shadow-prominent w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              {language === 'fr' ? 'Authentification à deux facteurs' : 'Two-Factor Authentication'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'fr' ?'Entrez le code de vérification envoyé à votre téléphone' :'Enter the verification code sent to your phone'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Verification Code Input */}
            <div className="space-y-2">
              <Input
                label={language === 'fr' ? 'Code de vérification' : 'Verification Code'}
                type="text"
                value={verificationCode}
                onChange={handleInputChange}
                placeholder="123456"
                error={error}
                disabled={isLoading}
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              
              {/* Timer */}
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>
                  {language === 'fr' ? 'Expire dans' : 'Expires in'} {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Demo Code Helper */}
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {language === 'fr' ? 'Code de démonstration' : 'Demo Code'}
                </span>
              </div>
              <div className="text-lg font-mono text-center text-primary font-bold">
                {mockVerificationCode}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isLoading}
                disabled={!verificationCode || verificationCode.length !== 6}
                className="h-12"
              >
                {language === 'fr' ? 'Vérifier' : 'Verify'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={handleResendCode}
                disabled={!canResend || isLoading}
                className="h-10"
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                {language === 'fr' ? 'Renvoyer le code' : 'Resend Code'}
                {!canResend && timeLeft > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    ({formatTime(timeLeft)})
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={14} />
            <span>
              {language === 'fr' ?'Votre compte est protégé par l\'authentification à deux facteurs' 
                : 'Your account is protected by two-factor authentication'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;