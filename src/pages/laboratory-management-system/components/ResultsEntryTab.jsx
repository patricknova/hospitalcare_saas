import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResultsEntryTab = ({ results, onResultEntry }) => {
  const [sortField, setSortField] = useState('completedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
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
      case 'validated':
        return 'text-success bg-success/10';
      case 'critical':
        return 'text-destructive bg-destructive/10';
      case 'reported':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'validated':
        return 'Validé';
      case 'critical':
        return 'Critique';
      case 'reported':
        return 'Rapporté';
      default:
        return status;
    }
  };

  const getResultStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'slightly_high': case'slightly_low':
        return 'text-warning';
      case 'high': case'low': case'critical':
        return 'text-destructive';
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

  if (results.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="ClipboardCheck" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Aucun résultat à saisir</h3>
        <p className="text-muted-foreground">
          Les résultats de tests apparaîtront ici pour validation et rapport.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="ClipboardCheck" size={20} className="mr-2" />
            Saisie de Résultats ({results.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <SortableHeader field="testName">Test</SortableHeader>
                <SortableHeader field="patientName">Patient</SortableHeader>
                <SortableHeader field="completedDate">Date</SortableHeader>
                <SortableHeader field="technician">Technicien</SortableHeader>
                <SortableHeader field="status">Statut</SortableHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Résultats
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedResults.map((result) => (
                <tr key={result.id} className="hover:bg-muted/20">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="FileText" size={20} className="text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">
                          {result.testName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.category} • ID: {result.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {result.patientName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Commande: {result.testOrderId}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">
                      {formatDate(result.completedDate)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground">
                      {result.technician}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status === 'critical' && (
                          <Icon name="AlertTriangle" size={12} className="mr-1" />
                        )}
                        {getStatusText(result.status)}
                      </span>
                      {result.criticalValues && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-destructive bg-destructive/10">
                          <Icon name="AlertCircle" size={10} className="mr-1" />
                          Valeurs critiques
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 max-w-xs">
                      {Object.entries(result.results || {}).slice(0, 3).map(([param, data]) => (
                        <div key={param} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground truncate mr-2">{param}:</span>
                          <span className={`font-medium ${getResultStatusColor(data.status)}`}>
                            {data.value} {data.unit}
                          </span>
                        </div>
                      ))}
                      {Object.keys(result.results || {}).length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{Object.keys(result.results).length - 3} autres...
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Voir résultats complets"
                      >
                        <Icon name="Eye" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Modifier résultats"
                        disabled={result.status === 'reported'}
                      >
                        <Icon name="Edit2" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Générer rapport"
                        disabled={!result.reportGenerated}
                      >
                        <Icon name="FileDown" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Plus d'options"
                      >
                        <Icon name="MoreHorizontal" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Details for Selected Entry */}
      {results.length > 0 && results[0].results && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="BarChart3" size={20} className="mr-2" />
            Détails des Résultats - {results[0].testName}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results[0].results).map(([parameter, data]) => (
              <div key={parameter} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-foreground">{parameter}</h5>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    data.status === 'normal' ? 'bg-success/10 text-success' :
                    data.status === 'critical'? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                  }`}>
                    {data.status === 'normal' ? 'Normal' :
                     data.status === 'critical' ? 'Critique' :
                     data.status === 'slightly_high' ? 'Légèrement élevé' :
                     data.status === 'slightly_low' ? 'Légèrement bas' : data.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valeur:</span>
                    <span className={`font-medium ${getResultStatusColor(data.status)}`}>
                      {data.value} {data.unit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Normale:</span>
                    <span className="text-foreground">{data.normalRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results[0].notes && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <h6 className="text-sm font-medium text-foreground mb-2">Notes du technicien:</h6>
              <p className="text-sm text-muted-foreground">{results[0].notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsEntryTab;