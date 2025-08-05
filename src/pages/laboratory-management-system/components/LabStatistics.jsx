import React from 'react';
import Icon from '../../../components/AppIcon';

const LabStatistics = ({ testOrders, samples, results }) => {
  const calculateStats = () => {
    const today = new Date();
    const todayStr = today.toDateString();

    // Test Orders Stats
    const todayOrders = testOrders.filter(order => 
      new Date(order.orderDate).toDateString() === todayStr
    ).length;
    
    const urgentOrders = testOrders.filter(order => 
      order.priority === 'urgent' || order.priority === 'critical'
    ).length;

    const pendingOrders = testOrders.filter(order => 
      order.status === 'pending'
    ).length;

    // Sample Stats
    const samplesInProcess = samples.filter(sample => 
      sample.status === 'processing'
    ).length;

    const samplesCompleted = samples.filter(sample => 
      sample.status === 'completed'
    ).length;

    // Results Stats
    const criticalResults = results.filter(result => 
      result.status === 'critical' || result.criticalValues
    ).length;

    const validatedResults = results.filter(result => 
      result.status === 'validated'
    ).length;

    // Category Distribution
    const categoryStats = testOrders.reduce((acc, order) => {
      order.tests?.forEach(test => {
        acc[test.category] = (acc[test.category] || 0) + 1;
      });
      return acc;
    }, {});

    // Revenue Stats
    const totalRevenue = testOrders.reduce((sum, order) => sum + (order.totalCost || 0), 0);
    const todayRevenue = testOrders
      .filter(order => new Date(order.orderDate).toDateString() === todayStr)
      .reduce((sum, order) => sum + (order.totalCost || 0), 0);

    return {
      todayOrders,
      urgentOrders,
      pendingOrders,
      samplesInProcess,
      samplesCompleted,
      criticalResults,
      validatedResults,
      categoryStats,
      totalRevenue,
      todayRevenue
    };
  };

  const stats = calculateStats();

  const getRecentActivity = () => [
    {
      id: 1,
      type: 'critical_result',
      message: 'Résultat critique pour Marie Kouam',
      time: '10:30',
      icon: 'AlertTriangle',
      color: 'text-destructive'
    },
    {
      id: 2,
      type: 'sample_completed',
      message: 'Échantillon LAB2024-003 traité',
      time: '09:45',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 3,
      type: 'new_order',
      message: 'Nouvelle commande TO004 reçue',
      time: '09:15',
      icon: 'FileText',
      color: 'text-primary'
    },
    {
      id: 4,
      type: 'sample_collected',
      message: 'Échantillon collecté pour Jean Dupont',
      time: '08:30',
      icon: 'TestTube',
      color: 'text-warning'
    }
  ];

  const recentActivity = getRecentActivity();

  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Calendar" size={20} className="mr-2" />
          Résumé du Jour
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Nouvelles commandes</span>
            <span className="text-sm font-medium text-foreground">{stats.todayOrders}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Tests urgents</span>
            <span className="text-sm font-medium text-destructive">{stats.urgentOrders}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">En traitement</span>
            <span className="text-sm font-medium text-warning">{stats.samplesInProcess}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Résultats validés</span>
            <span className="text-sm font-medium text-success">{stats.validatedResults}</span>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          État des Équipements
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center">
              <Icon name="Circle" size={8} className="mr-3 text-success fill-current" />
              <span className="text-sm font-medium">Analyseur hématologique</span>
            </div>
            <span className="text-xs text-success">Opérationnel</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center">
              <Icon name="Circle" size={8} className="mr-3 text-success fill-current" />
              <span className="text-sm font-medium">Analyseur biochimique</span>
            </div>
            <span className="text-xs text-success">Opérationnel</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
            <div className="flex items-center">
              <Icon name="Circle" size={8} className="mr-3 text-warning fill-current" />
              <span className="text-sm font-medium">Microscope</span>
            </div>
            <span className="text-xs text-warning">Maintenance</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
            <div className="flex items-center">
              <Icon name="Circle" size={8} className="mr-3 text-success fill-current" />
              <span className="text-sm font-medium">Centrifugeuse</span>
            </div>
            <span className="text-xs text-success">Opérationnel</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Activité Récente
        </h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 bg-muted/20 rounded-lg">
              <div className="flex-shrink-0">
                <Icon 
                  name={activity.icon} 
                  size={16} 
                  className={`mr-3 mt-0.5 ${activity.color}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Categories */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="PieChart" size={20} className="mr-2" />
          Répartition des Tests
        </h3>
        
        <div className="space-y-3">
          {Object.entries(stats.categoryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {category === 'biochimie' ? 'Biochimie' :
                   category === 'hematologie' ? 'Hématologie' :
                   category === 'microbiologie' ? 'Microbiologie' :
                   category === 'immunologie' ? 'Immunologie' :
                   category === 'cardiologie' ? 'Cardiologie' :
                   category === 'urologie' ? 'Urologie' : category}
                </span>
                <div className="flex items-center">
                  <div className="w-16 bg-muted rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(count / Math.max(...Object.values(stats.categoryStats))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-6 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2" />
          Revenus du Laboratoire
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Aujourd'hui</span>
            <span className="text-sm font-medium text-success">{formatCurrency(stats.todayRevenue)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Total général</span>
            <span className="text-sm font-medium text-foreground">{formatCurrency(stats.totalRevenue)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Tests facturés</span>
            <span className="text-sm font-medium text-foreground">
              {testOrders.reduce((sum, order) => sum + (order.tests?.length || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Quality Control */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Contrôle Qualité
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg">
            <span className="text-sm text-success">Calibration hebdomadaire</span>
            <Icon name="CheckCircle" size={16} className="text-success" />
          </div>
          
          <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
            <span className="text-sm text-warning">Contrôle qualité quotidien</span>
            <Icon name="Clock" size={16} className="text-warning" />
          </div>
          
          <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg">
            <span className="text-sm text-success">Réactifs en stock</span>
            <Icon name="CheckCircle" size={16} className="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabStatistics;