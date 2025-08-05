import React from 'react';
import Icon from '../../../components/AppIcon';

const PatientStatistics = ({ patients }) => {
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;
  const hospitalizedPatients = patients.filter(p => p.status === 'hospitalized').length;
  const newPatientsThisMonth = patients.filter(p => {
    const patientDate = new Date(p.registrationDate);
    const currentDate = new Date();
    return patientDate.getMonth() === currentDate.getMonth() && 
           patientDate.getFullYear() === currentDate.getFullYear();
  }).length;

  const todayVisits = patients.filter(p => {
    const visitDate = new Date(p.lastVisit);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString();
  }).length;

  const averageAge = Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) || 0;

  const genderDistribution = patients.reduce((acc, p) => {
    acc[p.gender] = (acc[p.gender] || 0) + 1;
    return acc;
  }, {});

  const bloodTypeDistribution = patients.reduce((acc, p) => {
    acc[p.bloodType] = (acc[p.bloodType] || 0) + 1;
    return acc;
  }, {});

  const mostCommonBloodType = Object.entries(bloodTypeDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const recentPatients = patients
    .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
    .slice(0, 5);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold text-${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Statistiques Patients
        </h3>
        
        <div className="space-y-4">
          <StatCard
            icon="Users"
            title="Total Patients"
            value={totalPatients}
            subtitle="Patients enregistrés"
            color="primary"
          />
          
          <StatCard
            icon="UserCheck"
            title="Patients Actifs"
            value={activePatients}
            subtitle={`${Math.round((activePatients / totalPatients) * 100)}% du total`}
            color="success"
          />
          
          <StatCard
            icon="Bed"
            title="Hospitalisés"
            value={hospitalizedPatients}
            subtitle="Actuellement"
            color="warning"
          />
          
          <StatCard
            icon="Calendar"
            title="Visites Aujourd'hui"
            value={todayVisits}
            subtitle="Consultations du jour"
            color="accent"
          />
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="PieChart" size={18} className="mr-2" />
          Démographie
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Âge moyen</span>
            <span className="text-sm font-medium text-foreground">{averageAge} ans</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Groupe sanguin le plus fréquent</span>
            <span className="text-sm font-medium text-foreground">{mostCommonBloodType}</span>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Répartition par genre</p>
            <div className="space-y-2">
              {Object.entries(genderDistribution).map(([gender, count]) => {
                const percentage = Math.round((count / totalPatients) * 100);
                const genderLabel = {
                  male: 'Masculin',
                  female: 'Féminin',
                  other: 'Autre'
                }[gender] || gender;
                
                return (
                  <div key={gender} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{genderLabel}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Additions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="UserPlus" size={18} className="mr-2" />
          Nouveaux Patients
        </h4>
        
        <div className="space-y-3">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(patient.registrationDate)}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                {patient.age} ans
              </div>
            </div>
          ))}
          
          {recentPatients.length === 0 && (
            <div className="text-center py-4">
              <Icon name="Users" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucun nouveau patient</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ce mois</span>
            <span className="font-medium text-foreground">+{newPatientsThisMonth} nouveaux</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={18} className="mr-2" />
          Actions Rapides
        </h4>
        
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 text-left">
            <Icon name="Download" size={16} className="text-primary" />
            <span className="text-sm text-foreground">Exporter la liste</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 text-left">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="text-sm text-foreground">Rapport mensuel</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 text-left">
            <Icon name="Mail" size={16} className="text-primary" />
            <span className="text-sm text-foreground">Rappels automatiques</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 text-left">
            <Icon name="Settings" size={16} className="text-primary" />
            <span className="text-sm text-foreground">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientStatistics;