import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BillingFilters from './components/BillingFilters';
import InvoiceTable from './components/InvoiceTable';
import PaymentStatistics from './components/PaymentStatistics';
import PaymentModal from './components/PaymentModal';
import InvoiceModal from './components/InvoiceModal';
import InsuranceClaimsPanel from './components/InsuranceClaimsPanel';

const BillingAndPaymentProcessing = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Mock invoice data
  useEffect(() => {
    const mockInvoices = [
      {
        id: "INV-2024-001",
        patientId: "1",
        patientName: "Jean Dupont",
        patientPhone: "+237 677 123 456",
        services: [
          { type: "consultation", description: "Consultation générale", amount: 15000, doctor: "Dr. Martin" },
          { type: "pharmacy", description: "Médicaments prescrits", amount: 8500, items: 3 },
          { type: "laboratory", description: "Analyses sanguines", amount: 12000, tests: 2 }
        ],
        totalAmount: 35500,
        paidAmount: 0,
        outstandingBalance: 35500,
        status: "pending",
        paymentMethod: null,
        insuranceProvider: "CNPS",
        insuranceNumber: "CNP123456789",
        insuranceCoverage: 80,
        insuranceAmount: 28400,
        patientAmount: 7100,
        invoiceDate: "2024-01-27T08:30:00Z",
        dueDate: "2024-02-10T23:59:59Z",
        language: "fr"
      },
      {
        id: "INV-2024-002",
        patientId: "2",
        patientName: "Marie Kouam",
        patientPhone: "+237 655 987 654",
        services: [
          { type: "consultation", description: "Consultation spécialisée", amount: 25000, doctor: "Dr. Kouam" },
          { type: "laboratory", description: "Test diabète", amount: 18000, tests: 4 }
        ],
        totalAmount: 43000,
        paidAmount: 43000,
        outstandingBalance: 0,
        status: "paid",
        paymentMethod: "mtn_money",
        insuranceProvider: "Private Insurance",
        insuranceNumber: "PI987654321",
        insuranceCoverage: 90,
        insuranceAmount: 38700,
        patientAmount: 4300,
        invoiceDate: "2024-01-26T14:15:00Z",
        dueDate: "2024-02-09T23:59:59Z",
        paidDate: "2024-01-26T16:30:00Z",
        language: "fr"
      },
      {
        id: "INV-2024-003",
        patientId: "3",
        patientName: "Paul Mbarga",
        patientPhone: "+237 699 456 789",
        services: [
          { type: "consultation", description: "Suivi asthme", amount: 20000, doctor: "Dr. Ngono" },
          { type: "pharmacy", description: "Inhalateurs", amount: 45000, items: 2 }
        ],
        totalAmount: 65000,
        paidAmount: 30000,
        outstandingBalance: 35000,
        status: "partial",
        paymentMethod: "cash",
        insuranceProvider: null,
        insuranceNumber: null,
        insuranceCoverage: 0,
        insuranceAmount: 0,
        patientAmount: 65000,
        invoiceDate: "2024-01-25T11:20:00Z",
        dueDate: "2024-02-08T23:59:59Z",
        installmentPlan: true,
        nextPaymentDate: "2024-02-05T00:00:00Z",
        language: "en"
      },
      {
        id: "INV-2024-004",
        patientId: "4",
        patientName: "Claire Fouda",
        patientPhone: "+237 677 321 654",
        services: [
          { type: "consultation", description: "Pediatric check-up", amount: 18000, doctor: "Dr. Mbarga" },
          { type: "laboratory", description: "Routine blood work", amount: 15000, tests: 3 }
        ],
        totalAmount: 33000,
        paidAmount: 0,
        outstandingBalance: 33000,
        status: "overdue",
        paymentMethod: null,
        insuranceProvider: "CNPS",
        insuranceNumber: "CNP456789123",
        insuranceCoverage: 100,
        insuranceAmount: 33000,
        patientAmount: 0,
        invoiceDate: "2024-01-20T09:00:00Z",
        dueDate: "2024-01-30T23:59:59Z",
        language: "en"
      },
      {
        id: "INV-2024-005",
        patientId: "5",
        patientName: "André Ngono",
        patientPhone: "+237 655 789 123",
        services: [
          { type: "consultation", description: "Consultation cardiologie", amount: 30000, doctor: "Dr. Fouda" },
          { type: "pharmacy", description: "Médicaments cardiaques", amount: 22000, items: 4 },
          { type: "laboratory", description: "ECG et analyses", amount: 25000, tests: 5 }
        ],
        totalAmount: 77000,
        paidAmount: 77000,
        outstandingBalance: 0,
        status: "paid",
        paymentMethod: "orange_money",
        insuranceProvider: "Private Insurance",
        insuranceNumber: "PI123789456",
        insuranceCoverage: 85,
        insuranceAmount: 65450,
        patientAmount: 11550,
        invoiceDate: "2024-01-24T10:15:00Z",
        dueDate: "2024-02-07T23:59:59Z",
        paidDate: "2024-01-25T08:45:00Z",
        language: "fr"
      }
    ];

    setTimeout(() => {
      setInvoices(mockInvoices);
      setFilteredInvoices(mockInvoices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredInvoices(invoices);
  };

  const applyFilters = (filterValues) => {
    let filtered = [...invoices];

    // Search term filter
    if (filterValues.searchTerm) {
      const searchLower = filterValues.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.patientName.toLowerCase().includes(searchLower) ||
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.patientPhone.includes(searchLower)
      );
    }

    // Status filter
    if (filterValues.status) {
      filtered = filtered.filter(invoice => invoice.status === filterValues.status);
    }

    // Payment method filter
    if (filterValues.paymentMethod) {
      filtered = filtered.filter(invoice => invoice.paymentMethod === filterValues.paymentMethod);
    }

    // Insurance provider filter
    if (filterValues.insuranceProvider) {
      filtered = filtered.filter(invoice => 
        invoice.insuranceProvider && invoice.insuranceProvider.toLowerCase().includes(filterValues.insuranceProvider.toLowerCase())
      );
    }

    // Date range filter
    if (filterValues.dateRange) {
      const now = new Date();
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.invoiceDate);
        switch (filterValues.dateRange) {
          case 'today':
            return invoiceDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case 'month':
            return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Amount range filter
    if (filterValues.amountRange) {
      const [min, max] = filterValues.amountRange.split('-').map(val => parseInt(val) * 1000);
      filtered = filtered.filter(invoice => {
        if (filterValues.amountRange.includes('+')) {
          return invoice.totalAmount >= min;
        }
        return invoice.totalAmount >= min && invoice.totalAmount <= max;
      });
    }

    setFilteredInvoices(filtered);
  };

  const handlePaymentProcess = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleNewInvoice = () => {
    setShowNewInvoiceModal(true);
  };

  const handleInvoiceSelect = (invoiceId, selected) => {
    if (selected) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleBulkPayment = () => {
    if (selectedInvoices.length > 0) {
      // Process bulk payment
      console.log('Processing bulk payment for:', selectedInvoices);
    }
  };

  const handleCreateInvoice = (invoiceData) => {
    const newInvoice = {
      ...invoiceData,
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
  };

  const handlePaymentComplete = (invoiceId, paymentData) => {
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === invoiceId) {
        return {
          ...invoice,
          paidAmount: invoice.paidAmount + paymentData.amount,
          outstandingBalance: invoice.outstandingBalance - paymentData.amount,
          status: invoice.outstandingBalance - paymentData.amount <= 0 ? 'paid' : 'partial',
          paymentMethod: paymentData.method,
          paidDate: paymentData.amount === invoice.outstandingBalance ? new Date().toISOString() : invoice.paidDate
        };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <PrimarySidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement de la facturation...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      <div className="flex">
        <PrimarySidebar />
        
        <div className="flex-1">
          <BreadcrumbNavigation />
          
          {/* Main Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Facturation et Paiements</h1>
                <p className="text-muted-foreground">
                  Gérez les factures, paiements et réclamations d'assurance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {selectedInvoices.length > 0 && (
                  <Button variant="outline" onClick={handleBulkPayment}>
                    <Icon name="CreditCard" size={20} className="mr-2" />
                    Paiement Groupé ({selectedInvoices.length})
                  </Button>
                )}
                <Button onClick={handleNewInvoice}>
                  <Icon name="Plus" size={20} className="mr-2" />
                  Nouvelle Facture
                </Button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Factures</p>
                    <p className="text-2xl font-bold text-primary">{invoices.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenus Totaux</p>
                    <p className="text-2xl font-bold text-success">
                      {new Intl.NumberFormat('fr-FR').format(
                        invoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
                      )} FCFA
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-success/10">
                    <Icon name="TrendingUp" size={24} className="text-success" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                    <p className="text-2xl font-bold text-warning">
                      {new Intl.NumberFormat('fr-FR').format(
                        invoices.reduce((sum, inv) => sum + inv.outstandingBalance, 0)
                      )} FCFA
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-warning/10">
                    <Icon name="Clock" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Retard</p>
                    <p className="text-2xl font-bold text-error">
                      {invoices.filter(inv => inv.status === 'overdue').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-error/10">
                    <Icon name="AlertTriangle" size={24} className="text-error" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Billing Filters - Left Panel */}
              <div className="lg:col-span-3">
                <BillingFilters
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Invoice Table - Center Panel */}
              <div className="lg:col-span-6">
                <InvoiceTable
                  invoices={filteredInvoices}
                  selectedInvoices={selectedInvoices}
                  onInvoiceSelect={handleInvoiceSelect}
                  onPaymentProcess={handlePaymentProcess}
                  onViewInvoice={handleViewInvoice}
                />
              </div>

              {/* Payment Statistics & Insurance Claims - Right Panel */}
              <div className="lg:col-span-3 space-y-6">
                <PaymentStatistics invoices={invoices} />
                <InsuranceClaimsPanel invoices={invoices} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={selectedInvoice}
        onPaymentComplete={handlePaymentComplete}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
      />

      <InvoiceModal
        isOpen={showNewInvoiceModal}
        onClose={() => setShowNewInvoiceModal(false)}
        isCreating={true}
        onSave={handleCreateInvoice}
      />
    </div>
  );
};

export default BillingAndPaymentProcessing;