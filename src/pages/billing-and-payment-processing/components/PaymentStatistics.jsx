import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const PaymentStatistics = ({ invoices }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  // Payment method distribution
  const paymentMethodData = invoices
    .filter(invoice => invoice.paymentMethod)
    .reduce((acc, invoice) => {
      const method = invoice.paymentMethod;
      acc[method] = (acc[method] || 0) + invoice.paidAmount;
      return acc;
    }, {});

  const paymentMethodChartData = Object.entries(paymentMethodData).map(([method, amount]) => {
    const labels = {
      'cash': 'Espèces',
      'card': 'Carte',
      'bank_transfer': 'Virement',
      'mtn_money': 'MTN Money',
      'orange_money': 'Orange Money',
      'check': 'Chèque'
    };
    return {
      name: labels[method] || method,
      value: amount,
      method
    };
  });

  // Status distribution
  const statusData = invoices.reduce((acc, invoice) => {
    acc[invoice.status] = (acc[invoice.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => {
    const labels = {
      'paid': 'Payé',
      'pending': 'En attente',
      'partial': 'Partiel',
      'overdue': 'En retard',
      'cancelled': 'Annulé'
    };
    return {
      name: labels[status] || status,
      value: count,
      status
    };
  });

  // Daily revenue for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const dailyRevenue = last7Days.map(date => {
    const dayRevenue = invoices
      .filter(invoice => {
        if (!invoice.paidDate) return false;
        const paidDate = new Date(invoice.paidDate);
        return paidDate.toDateString() === date.toDateString();
      })
      .reduce((sum, invoice) => sum + invoice.paidAmount, 0);

    return {
      date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      revenue: dayRevenue
    };
  });

  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: '#6b7280'
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Moyens de Paiement</h3>
          <Icon name="PieChart" size={20} className="text-muted-foreground" />
        </div>
        
        {paymentMethodChartData.length > 0 ? (
          <>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentMethodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {paymentMethodChartData.map((entry, index) => (
                <div key={entry.method} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-foreground">{entry.name}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="PieChart" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Aucun paiement traité</p>
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Statuts des Factures</h3>
          <Icon name="BarChart3" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-3">
          {statusChartData.map((entry, index) => {
            const percentage = (entry.value / invoices.length) * 100;
            return (
              <div key={entry.status}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground">{entry.name}</span>
                  <span className="font-medium text-foreground">{entry.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Revenue */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Revenus - 7 derniers jours</h3>
          <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                stroke="#6b7280"
              />
              <YAxis 
                fontSize={12}
                stroke="#6b7280"
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenus']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="revenue" fill={colors.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Statistiques Rapides</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-success" />
              <span className="text-sm text-foreground">Taux de paiement</span>
            </div>
            <span className="font-medium text-foreground">
              {invoices.length > 0 
                ? Math.round((invoices.filter(inv => inv.status === 'paid').length / invoices.length) * 100)
                : 0
              }%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-sm text-foreground">Délai moyen</span>
            </div>
            <span className="font-medium text-foreground">3.2 jours</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-sm text-foreground">Revenus moyens</span>
            </div>
            <span className="font-medium text-foreground">
              {formatCurrency(
                invoices.length > 0 
                  ? invoices.reduce((sum, inv) => sum + inv.totalAmount, 0) / invoices.length 
                  : 0
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatistics;