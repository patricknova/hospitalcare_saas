import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PatientFlowChart = () => {
  const data = [
    { time: '08:00', patients: 12, consultations: 8 },
    { time: '09:00', patients: 25, consultations: 18 },
    { time: '10:00', patients: 38, consultations: 32 },
    { time: '11:00', patients: 45, consultations: 38 },
    { time: '12:00', patients: 52, consultations: 45 },
    { time: '13:00', patients: 35, consultations: 28 },
    { time: '14:00', patients: 48, consultations: 42 },
    { time: '15:00', patients: 55, consultations: 48 },
    { time: '16:00', patients: 42, consultations: 35 },
    { time: '17:00', patients: 28, consultations: 22 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-moderate">
          <p className="text-sm font-medium text-popover-foreground mb-2">{`Heure: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'patients' ? 'Patients' : 'Consultations'}: {entry.value}
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
        <h3 className="text-lg font-semibold text-foreground mb-2">Flux de Patients Aujourd'hui</h3>
        <p className="text-sm text-muted-foreground">Évolution du nombre de patients et consultations par heure</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="patients" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="consultations" 
              stroke="var(--color-accent)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Patients</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-sm text-muted-foreground">Consultations</span>
        </div>
      </div>
    </div>
  );
};

export default PatientFlowChart;