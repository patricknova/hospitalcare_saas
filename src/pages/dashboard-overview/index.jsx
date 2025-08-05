import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import StatCard from './components/StatCard';
import PatientFlowChart from './components/PatientFlowChart';
import RevenueChart from './components/RevenueChart';
import ServiceDistributionChart from './components/ServiceDistributionChart';
import NotificationsFeed from './components/NotificationsFeed';
import TodayAgenda from './components/TodayAgenda';
import QuickActions from './components/QuickActions';
import RecentActivities from './components/RecentActivities';

const DashboardOverview = () => {
  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      // This would typically update dashboard metrics in real-time
      console.log('Dashboard data refreshed');
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Helmet>
        <title>Tableau de Bord - HospitalCare SaaS</title>
        <meta name="description" content="Centre de commande pour la gestion hospitalière - Métriques, notifications et actions rapides" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <GlobalHeader />
        
        {/* Layout flexbox pour sidebar et contenu au même niveau */}
        <div className="flex pt-16">
          <PrimarySidebar />
          
          <main className="flex-1">
            <BreadcrumbNavigation />
            
            <div className="p-6 space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      Bienvenue, Dr. Marie Dubois
                    </h1>
                    <p className="text-muted-foreground">
                      {currentDate} - Voici un aperçu de votre établissement aujourd'hui
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Heure actuelle</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date().toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Patients Aujourd'hui"
                  value="142"
                  change="+12%"
                  changeType="increase"
                  icon="Users"
                  color="primary"
                />
                <StatCard
                  title="Rendez-vous"
                  value="38"
                  change="+5%"
                  changeType="increase"
                  icon="Calendar"
                  color="accent"
                />
                <StatCard
                  title="Revenus du Jour"
                  value="2.4M FCFA"
                  change="+8%"
                  changeType="increase"
                  icon="DollarSign"
                  color="success"
                />
                <StatCard
                  title="Occupation Lits"
                  value="85%"
                  change="-3%"
                  changeType="decrease"
                  icon="Bed"
                  color="warning"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PatientFlowChart />
                <RevenueChart />
              </div>

              {/* Service Distribution */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ServiceDistributionChart />
                </div>
                <div className="space-y-6">
                  <QuickActions />
                </div>
              </div>

              {/* Right Sidebar Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <NotificationsFeed />
                </div>
                <div className="lg:col-span-1">
                  <TodayAgenda />
                </div>
                <div className="lg:col-span-1">
                  <RecentActivities />
                </div>
              </div>

              {/* System Status Footer */}
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Système opérationnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm text-muted-foreground">Base de données synchronisée</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;