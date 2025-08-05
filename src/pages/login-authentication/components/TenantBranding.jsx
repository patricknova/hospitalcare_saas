import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TenantBranding = ({ tenant, language }) => {
  const brandingData = {
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop&crop=center",
    facilityName: language === 'fr' ? "Centre Hospitalier de Yaoundé" : "Yaoundé Medical Center",
    tagline: language === 'fr' ? "Excellence en Soins de Santé" : "Excellence in Healthcare",
    certifications: [
      {
        id: 1,
        name: language === 'fr' ? "Certifié MINSANTE" : "MINSANTE Certified",
        icon: "Shield",
        verified: true
      },
      {
        id: 2,
        name: language === 'fr' ? "Accrédité ISO 9001" : "ISO 9001 Accredited",
        icon: "Award",
        verified: true
      },
      {
        id: 3,
        name: language === 'fr' ? "Sécurité des Données" : "Data Security",
        icon: "Lock",
        verified: true
      }
    ],
    stats: [
      {
        id: 1,
        value: "15,000+",
        label: language === 'fr' ? "Patients Traités" : "Patients Treated"
      },
      {
        id: 2,
        value: "50+",
        label: language === 'fr' ? "Médecins Experts" : "Expert Doctors"
      },
      {
        id: 3,
        value: "24/7",
        label: language === 'fr' ? "Service d'Urgence" : "Emergency Service"
      }
    ]
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-primary/5 to-accent/5 p-8 lg:p-12">
      {/* Logo and Facility Name */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 mb-6 rounded-2xl overflow-hidden shadow-moderate bg-white p-2">
          <Image 
            src={brandingData.logo}
            alt={brandingData.facilityName}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          {brandingData.facilityName}
        </h1>
        
        <p className="text-muted-foreground text-lg mb-6">
          {brandingData.tagline}
        </p>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {brandingData.certifications.map((cert) => (
            <div 
              key={cert.id}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full border border-border shadow-subtle"
            >
              <Icon 
                name={cert.icon} 
                size={16} 
                className={cert.verified ? "text-success" : "text-muted-foreground"} 
              />
              <span className="text-sm font-medium text-foreground">
                {cert.name}
              </span>
              {cert.verified && (
                <Icon name="CheckCircle" size={14} className="text-success" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 gap-6">
          {brandingData.stats.map((stat) => (
            <div 
              key={stat.id}
              className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-subtle"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          {language === 'fr' 
            ? `© ${new Date().getFullYear()} HospitalCare SaaS. Tous droits réservés.`
            : `© ${new Date().getFullYear()} HospitalCare SaaS. All rights reserved.`
          }
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'fr' 
            ? "Conforme aux réglementations MINSANTE Cameroun"
            : "Compliant with MINSANTE Cameroon regulations"
          }
        </p>
      </div>
    </div>
  );
};

export default TenantBranding;