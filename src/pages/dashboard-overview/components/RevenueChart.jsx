import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const data = [
    { month: 'Jan', revenue: 2400000, consultations: 1800000, pharmacy: 600000 },
    { month: 'Fév', revenue: 2800000, consultations: 2100000, pharmacy: 700000 },
    { month: 'Mar', revenue: 3200000, consultations: 2400000, pharmacy: 800000 },
    { month: 'Avr', revenue: 2900000, consultations: 2200000, pharmacy: 700000 },
    { month: 'Mai', revenue: 3500000, consultations: 2600000, pharmacy: 900000 },
    { month: 'Jun', revenue: 3800000, consultations: 2850000, pharmacy: 950000 },
    { month: 'Jul', revenue: 4200000, consultations: 3150000, pharmacy: 1050000 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Mois: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'consultations' ? 'Consultations' : 
               entry.dataKey === 'pharmacy' ? 'Pharmacie' : 'Total'}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Revenus Mensuels</h3>
        <p className="text-sm text-muted-foreground">Évolution des revenus par service (en FCFA)</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="consultations" 
              stackId="a" 
              fill="var(--color-primary)" 
              radius={[0, 0, 4, 4]}
            />
            <Bar 
              dataKey="pharmacy" 
              stackId="a" 
              fill="var(--color-accent)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Consultations</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-sm text-muted-foreground">Pharmacie</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;