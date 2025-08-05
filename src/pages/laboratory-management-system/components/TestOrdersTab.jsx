import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestOrdersTab = ({ orders, onNewOrder }) => {
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'in_progress':
        return 'text-primary bg-primary/10';
      case 'completed':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': case'critical': case'stat':
        return 'text-destructive';
      case 'routine':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortableHeader = ({ field, children }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon 
          name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
          size={14} 
        />
      </div>
    </th>
  );

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Aucune commande de test trouvée</h3>
        <p className="text-muted-foreground">
          Commencez par créer de nouvelles commandes de tests de laboratoire.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="FileText" size={20} className="mr-2" />
          Commandes de Tests ({orders.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="id">ID Commande</SortableHeader>
              <SortableHeader field="patientName">Patient</SortableHeader>
              <SortableHeader field="orderDate">Date Commande</SortableHeader>
              <SortableHeader field="orderedBy">Commandé par</SortableHeader>
              <SortableHeader field="priority">Priorité</SortableHeader>
              <SortableHeader field="status">Statut</SortableHeader>
              <SortableHeader field="totalCost">Coût</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/20">
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">{order.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.tests?.length} test(s)
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {order.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.patientId} • {order.PatientAge} ans
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(order.orderDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.department}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {order.orderedBy}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                    <Icon 
                      name={order.priority === 'urgent' || order.priority === 'critical' ? 'AlertTriangle' : 'Clock'} 
                      size={12} 
                      className="mr-1" 
                    />
                    {order.priority === 'urgent' ? 'Urgent' : 
                     order.priority === 'critical' ? 'Critique' : 
                     order.priority === 'stat' ? 'STAT' : 'Routine'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {order.sampleRequired && (
                      <span className={order.sampleCollected ? 'text-success' : 'text-warning'}>
                        {order.sampleCollected ? '✓ Échantillon collecté' : '⏳ Échantillon requis'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {order.totalCost?.toLocaleString()} FCFA
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.tests?.length} test(s)
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Voir détails"
                    >
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Modifier"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Collecter échantillon"
                      disabled={order.sampleCollected}
                    >
                      <Icon name="TestTube" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestOrdersTab;