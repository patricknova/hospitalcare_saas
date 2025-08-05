import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStatistics = ({ medications, alerts }) => {
  const calculateStats = () => {
    const totalValue = medications.reduce((sum, med) => sum + med.totalValue, 0);
    const totalStock = medications.reduce((sum, med) => sum + med.currentStock, 0);
    const lowStockCount = medications.filter(med => med.currentStock <= med.minimumThreshold).length;
    const expiringSoonCount = medications.filter(med => {
      const expDate = new Date(med.expirationDate);
      const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return expDate <= thirtyDays;
    }).length;

    const categoryStats = medications.reduce((acc, med) => {
      acc[med.category] = (acc[med.category] || 0) + 1;
      return acc;
    }, {});

    const supplierStats = medications.reduce((acc, med) => {
      acc[med.supplier] = (acc[med.supplier] || 0) + 1;
      return acc;
    }, {});

    return {
      totalValue,
      totalStock,
      lowStockCount,
      expiringSoonCount,
      categoryStats,
      supplierStats
    };
  };

  const stats = calculateStats();

  const getRecentTransactions = () => [
    {
      id: 1,
      type: 'dispensed',
      medication: 'Paracétamol',
      quantity: 10,
      timestamp: '2024-01-20T14:30:00Z',
      patient: 'Jean Dupont'
    },
    {
      id: 2,
      type: 'received',
      medication: 'Amoxicilline',
      quantity: 50,
      timestamp: '2024-01-20T10:15:00Z',
      supplier: 'GSK Cameroun'
    },
    {
      id: 3,
      type: 'dispensed',
      medication: 'Insuline',
      quantity: 2,
      timestamp: '2024-01-20T09:45:00Z',
      patient: 'Marie Kouam'
    }
  ];

  const recentTransactions = getRecentTransactions();

  const formatCurrency = (amount) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Résumé d'Inventaire
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Valeur totale</span>
            <span className="text-sm font-medium text-foreground">{formatCurrency(stats.totalValue)}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Unités totales</span>
            <span className="text-sm font-medium text-foreground">{stats.totalStock.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Médicaments différents</span>
            <span className="text-sm font-medium text-foreground">{medications.length}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Valeur moyenne/médicament</span>
            <span className="text-sm font-medium text-foreground">
              {medications.length > 0 ? formatCurrency(stats.totalValue / medications.length) : '0 FCFA'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Zap" size={20} className="mr-2" />
          Actions Rapides
        </h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <Icon name="Search" size={16} className="mr-3 text-primary" />
              <span className="text-sm font-medium">Scanner Code-barres</span>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <Icon name="FileText" size={16} className="mr-3 text-primary" />
              <span className="text-sm font-medium">Rapport d'Inventaire</span>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <Icon name="Download" size={16} className="mr-3 text-primary" />
              <span className="text-sm font-medium">Export Excel</span>
            </div>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Clock" size={20} className="mr-2" />
          Transactions Récentes
        </h3>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center p-3 bg-muted/20 rounded-lg">
              <div className={`p-2 rounded-full mr-3 ${
                transaction.type === 'dispensed' ? 'bg-destructive/10' : 'bg-success/10'
              }`}>
                <Icon 
                  name={transaction.type === 'dispensed' ? 'ArrowUpRight' : 'ArrowDownLeft'} 
                  size={14} 
                  className={transaction.type === 'dispensed' ? 'text-destructive' : 'text-success'}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {transaction.medication}
                </div>
                <div className="text-xs text-muted-foreground">
                  {transaction.type === 'dispensed' 
                    ? `Dispensé à ${transaction.patient}` 
                    : `Reçu de ${transaction.supplier}`
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">
                {transaction.type === 'dispensed' ? '-' : '+'}{transaction.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="PieChart" size={20} className="mr-2" />
          Répartition par Catégorie
        </h3>
        
        <div className="space-y-3">
          {Object.entries(stats.categoryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {category.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-20 bg-muted rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(count / medications.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Critical Alerts Summary */}
      {alerts?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2 text-warning" />
            Alertes Critiques
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-destructive/10 rounded-lg">
              <span className="text-sm text-destructive">Stock critique</span>
              <span className="text-sm font-medium text-destructive">
                {alerts.filter(a => a.type === 'critical').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
              <span className="text-sm text-warning">Stock faible</span>
              <span className="text-sm font-medium text-warning">
                {alerts.filter(a => a.type === 'warning' && a.message.includes('Stock')).length}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-warning/10 rounded-lg">
              <span className="text-sm text-warning">Expire bientôt</span>
              <span className="text-sm font-medium text-warning">
                {alerts.filter(a => a.type === 'warning' && a.message.includes('expire')).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryStatistics;