import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvoiceTable = ({ 
  invoices, 
  selectedInvoices, 
  onInvoiceSelect, 
  onPaymentProcess, 
  onViewInvoice 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'partial': return 'text-primary bg-primary/10';
      case 'overdue': return 'text-error bg-error/10';
      case 'cancelled': return 'text-muted-foreground bg-muted/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'partial': return 'Partiel';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'card': return 'Carte';
      case 'bank_transfer': return 'Virement';
      case 'mtn_money': return 'MTN Money';
      case 'orange_money': return 'Orange Money';
      case 'check': return 'Chèque';
      default: return 'Non défini';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = invoices.map(invoice => invoice.id);
      allIds.forEach(id => onInvoiceSelect(id, true));
    } else {
      selectedInvoices.forEach(id => onInvoiceSelect(id, false));
    }
  };

  const isAllSelected = invoices.length > 0 && selectedInvoices.length === invoices.length;
  const isIndeterminate = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  if (invoices.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucune facture trouvée</h3>
        <p className="text-muted-foreground">
          Aucune facture ne correspond aux filtres sélectionnés.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Factures</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedInvoices.length > 0 ? `${selectedInvoices.length} sélectionnée(s)` : 'Tout sélectionner'}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sélection
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Facture
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Patient
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Services
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Montant
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Échéance
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-muted/25">
                <td className="px-4 py-4">
                  <Checkbox
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) => onInvoiceSelect(invoice.id, checked)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{invoice.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(invoice.invoiceDate), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">{invoice.patientName}</div>
                    <div className="text-xs text-muted-foreground">{invoice.patientPhone}</div>
                    {invoice.insuranceProvider && (
                      <div className="text-xs text-primary mt-1">
                        <Icon name="Shield" size={12} className="inline mr-1" />
                        {invoice.insuranceProvider}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {invoice.services.slice(0, 2).map((service, index) => (
                      <div key={index} className="text-xs text-foreground">
                        {service.description}
                      </div>
                    ))}
                    {invoice.services.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{invoice.services.length - 2} autres
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {formatCurrency(invoice.totalAmount)}
                    </div>
                    {invoice.outstandingBalance > 0 && (
                      <div className="text-xs text-error">
                        Reste: {formatCurrency(invoice.outstandingBalance)}
                      </div>
                    )}
                    {invoice.paidAmount > 0 && (
                      <div className="text-xs text-success">
                        Payé: {formatCurrency(invoice.paidAmount)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                  {invoice.paymentMethod && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {getPaymentMethodLabel(invoice.paymentMethod)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">
                    {format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                  {invoice.status === 'overdue' && (
                    <div className="text-xs text-error">
                      <Icon name="AlertTriangle" size={12} className="inline mr-1" />
                      En retard
                    </div>
                  )}
                  {invoice.installmentPlan && invoice.nextPaymentDate && (
                    <div className="text-xs text-warning">
                      <Icon name="Calendar" size={12} className="inline mr-1" />
                      Prochain: {format(new Date(invoice.nextPaymentDate), 'dd/MM', { locale: fr })}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewInvoice(invoice)}
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    {(invoice.status === 'pending' || invoice.status === 'partial' || invoice.status === 'overdue') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPaymentProcess(invoice)}
                      >
                        <Icon name="CreditCard" size={16} className="mr-1" />
                        Payer
                      </Button>
                    )}
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

export default InvoiceTable;