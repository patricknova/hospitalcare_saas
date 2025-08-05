import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsuranceClaimsPanel = ({ invoices }) => {
  const [activeTab, setActiveTab] = useState('pending');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  // Filter invoices with insurance
  const insuranceInvoices = invoices.filter(invoice => invoice.insuranceProvider);

  // Mock claims data based on invoices
  const claims = insuranceInvoices.map(invoice => ({
    id: `CLAIM-${invoice.id.split('-')[2]}`,
    invoiceId: invoice.id,
    patientName: invoice.patientName,
    insuranceProvider: invoice.insuranceProvider,
    insuranceNumber: invoice.insuranceNumber,
    claimAmount: invoice.insuranceAmount,
    submittedDate: invoice.invoiceDate,
    status: invoice.status === 'paid' ? 'approved' : 
            invoice.status === 'overdue' ? 'rejected' : 'pending',
    processingTime: Math.floor(Math.random() * 14) + 1, // 1-14 days
    notes: invoice.status === 'overdue' ? 'Document manquant' : 
           invoice.status === 'paid' ? 'Traité avec succès' : 'En cours de traitement'
  }));

  const pendingClaims = claims.filter(claim => claim.status === 'pending');
  const approvedClaims = claims.filter(claim => claim.status === 'approved');
  const rejectedClaims = claims.filter(claim => claim.status === 'rejected');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'rejected': return 'XCircle';
      default: return 'HelpCircle';
    }
  };

  const getCurrentClaims = () => {
    switch (activeTab) {
      case 'pending': return pendingClaims;
      case 'approved': return approvedClaims;
      case 'rejected': return rejectedClaims;
      default: return pendingClaims;
    }
  };

  const handleResubmitClaim = (claimId) => {
    console.log('Resubmitting claim:', claimId);
    // In a real app, this would trigger the resubmission process
  };

  const handleDownloadReceipt = (claimId) => {
    console.log('Downloading receipt for claim:', claimId);
    // In a real app, this would download the receipt
  };

  if (insuranceInvoices.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <Icon name="Shield" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucune réclamation d'assurance</h3>
        <p className="text-sm text-muted-foreground">
          Les réclamations d'assurance apparaîtront ici lorsque des factures avec assurance seront créées.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Réclamations d'Assurance</h3>
          <Button variant="outline" size="sm">
            <Icon name="Upload" size={16} className="mr-2" />
            Soumettre
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pending' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Clock" size={16} />
            <span>En attente</span>
            {pendingClaims.length > 0 && (
              <span className="bg-warning/10 text-warning text-xs px-2 py-0.5 rounded-full">
                {pendingClaims.length}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'approved' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="CheckCircle" size={16} />
            <span>Approuvé</span>
            {approvedClaims.length > 0 && (
              <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full">
                {approvedClaims.length}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'rejected' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Icon name="XCircle" size={16} />
            <span>Rejeté</span>
            {rejectedClaims.length > 0 && (
              <span className="bg-error/10 text-error text-xs px-2 py-0.5 rounded-full">
                {rejectedClaims.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {getCurrentClaims().length === 0 ? (
          <div className="p-6 text-center">
            <Icon name={getStatusIcon(activeTab)} size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Aucune réclamation {getStatusLabel(activeTab).toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {getCurrentClaims().map((claim) => (
              <div key={claim.id} className="p-4 hover:bg-muted/25">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{claim.id}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        <Icon name={getStatusIcon(claim.status)} size={12} className="mr-1" />
                        {getStatusLabel(claim.status)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {claim.patientName} • {claim.insuranceProvider}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatCurrency(claim.claimAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>
                    Soumis le {format(new Date(claim.submittedDate), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                  <span>{claim.processingTime} jours</span>
                </div>

                {claim.notes && (
                  <p className="text-xs text-muted-foreground mb-3 bg-muted/20 p-2 rounded">
                    {claim.notes}
                  </p>
                )}

                <div className="flex items-center space-x-2">
                  {claim.status === 'rejected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResubmitClaim(claim.id)}
                      className="text-xs"
                    >
                      <Icon name="RefreshCw" size={12} className="mr-1" />
                      Resoumettre
                    </Button>
                  )}
                  {claim.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadReceipt(claim.id)}
                      className="text-xs"
                    >
                      <Icon name="Download" size={12} className="mr-1" />
                      Reçu
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Icon name="Eye" size={12} className="mr-1" />
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total réclamations</p>
            <p className="text-sm font-bold text-foreground">{claims.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Montant approuvé</p>
            <p className="text-sm font-bold text-success">
              {formatCurrency(approvedClaims.reduce((sum, claim) => sum + claim.claimAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">En attente</p>
            <p className="text-sm font-bold text-warning">
              {formatCurrency(pendingClaims.reduce((sum, claim) => sum + claim.claimAmount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceClaimsPanel;