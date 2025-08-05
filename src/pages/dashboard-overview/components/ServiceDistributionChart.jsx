import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ServiceDistributionChart = () => {
  const data = [
    { name: 'Médecine Générale', value: 35, patients: 142 },
    { name: 'Pédiatrie', value: 25, patients: 98 },
    { name: 'Gynécologie', value: 20, patients: 76 },
    { name: 'Cardiologie', value: 12, patients: 45 },
    { name: 'Urgences', value: 8, patients: 32 }
  ];

  const COLORS = [
    'var(--color-primary)',
    'var(--color-accent)', 
    'var(--color-secondary)',
    'var(--color-warning)',
    'var(--color-success)'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-popover-foreground mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">Patients: {data.patients}</p>
          <p className="text-sm text-muted-foreground">Pourcentage: {data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-subtle">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Répartition par Service</h3>
        <p className="text-sm text-muted-foreground">Distribution des patients par spécialité médicale</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-foreground">{item.patients}</span>
              <span className="text-xs text-muted-foreground ml-2">({item.value}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDistributionChart;