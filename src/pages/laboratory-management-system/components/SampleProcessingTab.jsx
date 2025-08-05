import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SampleProcessingTab = ({ samples, onProcessSample }) => {
  const [sortField, setSortField] = useState('collectionDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSamples = [...samples].sort((a, b) => {
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
      case 'collected':
        return 'text-warning bg-warning/10';
      case 'processing':
        return 'text-primary bg-primary/10';
      case 'completed':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'collected':
        return 'Collecté';
      case 'processing':
        return 'En traitement';
      case 'completed':
        return 'Traité';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getSampleTypeIcon = (sampleType) => {
    switch (sampleType?.toLowerCase()) {
      case 'sang':
        return 'Droplets';
      case 'urine':
        return 'TestTube';
      case 'salive':
        return 'CircleDot';
      default:
        return 'TestTube';
    }
  };

  const getTemperatureColor = (temperature) => {
    switch (temperature) {
      case 'refrigerated':
        return 'text-blue-500';
      case 'frozen':
        return 'text-blue-700';
      case 'ambient':
        return 'text-green-500';
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

  if (samples.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="TestTube" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Aucun échantillon à traiter</h3>
        <p className="text-muted-foreground">
          Les échantillons collectés apparaîtront ici pour traitement.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="TestTube" size={20} className="mr-2" />
          Traitement d'Échantillons ({samples.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="barcode">Code-barres</SortableHeader>
              <SortableHeader field="patientName">Patient</SortableHeader>
              <SortableHeader field="sampleType">Type</SortableHeader>
              <SortableHeader field="collectionDate">Date Collecte</SortableHeader>
              <SortableHeader field="collectedBy">Collecté par</SortableHeader>
              <SortableHeader field="status">Statut</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Conditions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedSamples.map((sample) => (
              <tr key={sample.id} className="hover:bg-muted/20">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name={getSampleTypeIcon(sample.sampleType)} size={20} className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {sample.barcode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {sample.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {sample.patientName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Commande: {sample.testOrderId}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground capitalize">
                    {sample.sampleType}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sample.volume}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {formatDate(sample.collectionDate)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {sample.collectedBy}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                    {getStatusText(sample.status)}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {sample.processingStatus && (
                      <span>Traitement: {sample.processingStatus}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <Icon 
                      name="Thermometer" 
                      size={14} 
                      className={`mr-1 ${getTemperatureColor(sample.temperature)}`}
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {sample.temperature === 'refrigerated' ? 'Réfrigéré' :
                       sample.temperature === 'frozen' ? 'Congelé' : 
                       sample.temperature === 'ambient' ? 'Ambiant' : sample.temperature}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Vol: {sample.volume}
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
                      title="Traiter"
                      disabled={sample.status === 'completed' || sample.status === 'rejected'}
                    >
                      <Icon name="Play" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Étiqueter"
                    >
                      <Icon name="Tag" size={14} />
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

      {/* Sample Processing Notes */}
      <div className="px-6 py-4 bg-muted/20 border-t border-border">
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon name="Info" size={16} className="mr-2" />
          <span>
            Temps de traitement estimé: 30-120 minutes selon le type de test. 
            Les échantillons critiques sont traités en priorité.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SampleProcessingTab;