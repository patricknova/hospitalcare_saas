import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MedicationTable = ({ medications, onEditMedication, onDispenseMedication }) => {
  const [sortField, setSortField] = useState('frenchName');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedMedications = [...medications].sort((a, b) => {
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

  const getStatusColor = (medication) => {
    if (medication.currentStock === 0) return 'text-destructive bg-destructive/10';
    if (medication.currentStock <= medication.minimumThreshold * 0.5) return 'text-destructive bg-destructive/10';
    if (medication.currentStock <= medication.minimumThreshold) return 'text-warning bg-warning/10';
    return 'text-success bg-success/10';
  };

  const getStatusText = (medication) => {
    if (medication.currentStock === 0) return 'Rupture';
    if (medication.currentStock <= medication.minimumThreshold * 0.5) return 'Critique';
    if (medication.currentStock <= medication.minimumThreshold) return 'Faible';
    return 'Disponible';
  };

  const getExpirationColor = (expirationDate) => {
    const expDate = new Date(expirationDate);
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expDate <= now) return 'text-destructive';
    if (expDate <= thirtyDays) return 'text-warning';
    return 'text-success';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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

  if (medications.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Aucun médicament trouvé</h3>
        <p className="text-muted-foreground">
          Ajustez vos filtres ou ajoutez de nouveaux médicaments à l'inventaire.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Package" size={20} className="mr-2" />
          Liste des Médicaments ({medications.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <SortableHeader field="frenchName">Médicament</SortableHeader>
              <SortableHeader field="category">Catégorie</SortableHeader>
              <SortableHeader field="currentStock">Stock</SortableHeader>
              <SortableHeader field="unitPrice">Prix</SortableHeader>
              <SortableHeader field="expirationDate">Expiration</SortableHeader>
              <SortableHeader field="supplier">Fournisseur</SortableHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedMedications.map((medication) => (
              <tr key={medication.id} className="hover:bg-muted/20">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon name="Pill" size={20} className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">
                        {medication.frenchName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {medication.brandName} • {medication.dosage}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Lot: {medication.batchNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                    {medication.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-foreground">
                      {medication.currentStock}
                    </div>
                    <div className="ml-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication)}`}>
                        {getStatusText(medication)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Min: {medication.minimumThreshold}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-foreground">
                    {medication.unitPrice.toLocaleString()} FCFA
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total: {medication.totalValue.toLocaleString()} FCFA
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className={`text-sm font-medium ${getExpirationColor(medication.expirationDate)}`}>
                    {formatDate(medication.expirationDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {medication.location}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {medication.supplier}
                  </div>
                  <div className="flex items-center mt-1">
                    {medication.prescriptionRequired && (
                      <Icon name="FileText" size={12} className="text-warning mr-1" title="Prescription requise" />
                    )}
                    {medication.refrigerated && (
                      <Icon name="Snowflake" size={12} className="text-blue-500 mr-1" title="Réfrigération requise" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditMedication(medication)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDispenseMedication(medication)}
                      disabled={medication.currentStock === 0}
                      className="h-8 w-8 p-0"
                    >
                      <Icon name="ShoppingCart" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
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
  );
};

export default MedicationTable;