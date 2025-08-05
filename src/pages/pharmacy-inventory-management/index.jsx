import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import InventoryFilters from './components/InventoryFilters';
import MedicationTable from './components/MedicationTable';
import InventoryStatistics from './components/InventoryStatistics';
import AddMedicationModal from './components/AddMedicationModal';
import ReceiveStockModal from './components/ReceiveStockModal';
import DispensingModal from './components/DispensingModal';

const PharmacyInventoryManagement = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [showReceiveStockModal, setShowReceiveStockModal] = useState(false);
  const [showDispensingModal, setShowDispensingModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  // Mock medication data
  useEffect(() => {
    const mockMedications = [
      {
        id: "1",
        frenchName: "Paracétamol",
        englishName: "Paracetamol",
        genericName: "Paracétamol",
        brandName: "Doliprane",
        category: "analgesique",
        dosage: "500mg",
        form: "comprime",
        currentStock: 250,
        minimumThreshold: 50,
        maximumThreshold: 1000,
        unitPrice: 150,
        totalValue: 37500,
        supplier: "Laboratoires STERIPHARMA",
        batchNumber: "PCM2024-001",
        expirationDate: "2025-12-15",
        receivedDate: "2024-01-10",
        barcode: "3401597405101",
        location: "Étagère A-12",
        activeIngredient: "Paracétamol 500mg",
        sideEffects: "Nausées, vomissements rares",
        contraindications: "Insuffisance hépatique sévère",
        dosageInstructions: "1-2 comprimés toutes les 6 heures, max 8/jour",
        prescriptionRequired: false,
        refrigerated: false,
        status: "available"
      },
      {
        id: "2",
        frenchName: "Amoxicilline",
        englishName: "Amoxicillin",
        genericName: "Amoxicilline",
        brandName: "Clamoxyl",
        category: "antibiotique",
        dosage: "250mg",
        form: "gelule",
        currentStock: 15,
        minimumThreshold: 30,
        maximumThreshold: 500,
        unitPrice: 450,
        totalValue: 6750,
        supplier: "GSK Cameroun",
        batchNumber: "AMX2024-089",
        expirationDate: "2024-03-20",
        receivedDate: "2023-12-05",
        barcode: "3401355794523",
        location: "Réfrigérateur-B3",
        activeIngredient: "Amoxicilline trihydratée 250mg",
        sideEffects: "Diarrhée, nausées, éruptions cutanées",
        contraindications: "Allergie aux pénicillines",
        dosageInstructions: "1 gélule 3 fois par jour pendant 7-10 jours",
        prescriptionRequired: true,
        refrigerated: true,
        status: "low_stock"
      },
      {
        id: "3",
        frenchName: "Insuline",
        englishName: "Insulin",
        genericName: "Insuline humaine",
        brandName: "Humulin",
        category: "hormone",
        dosage: "100UI/ml",
        form: "injection",
        currentStock: 45,
        minimumThreshold: 20,
        maximumThreshold: 200,
        unitPrice: 15000,
        totalValue: 675000,
        supplier: "Sanofi Aventis",
        batchNumber: "INS2024-156",
        expirationDate: "2024-02-28",
        receivedDate: "2023-11-15",
        barcode: "3400937435601",
        location: "Réfrigérateur-A1",
        activeIngredient: "Insuline humaine 100UI/ml",
        sideEffects: "Hypoglycémie, réactions au site d'injection",
        contraindications: "Hypoglycémie",
        dosageInstructions: "Selon prescription médicale",
        prescriptionRequired: true,
        refrigerated: true,
        status: "expiring_soon"
      },
      {
        id: "4",
        frenchName: "Aspirine",
        englishName: "Aspirin",
        genericName: "Acide acétylsalicylique",
        brandName: "Aspégic",
        category: "analgesique",
        dosage: "100mg",
        form: "comprime",
        currentStock: 180,
        minimumThreshold: 75,
        maximumThreshold: 800,
        unitPrice: 95,
        totalValue: 17100,
        supplier: "Bayer Healthcare",
        batchNumber: "ASP2024-203",
        expirationDate: "2026-08-30",
        receivedDate: "2024-01-20",
        barcode: "3400934559891",
        location: "Étagère B-08",
        activeIngredient: "Acide acétylsalicylique 100mg",
        sideEffects: "Troubles gastro-intestinaux, saignements",
        contraindications: "Ulcère gastrique, allergie aux salicylés",
        dosageInstructions: "1 comprimé par jour après repas",
        prescriptionRequired: false,
        refrigerated: false,
        status: "available"
      },
      {
        id: "5",
        frenchName: "Métformine",
        englishName: "Metformin",
        genericName: "Chlorhydrate de métformine",
        brandName: "Glucophage",
        category: "antidiabetique",
        dosage: "850mg",
        form: "comprime",
        currentStock: 5,
        minimumThreshold: 25,
        maximumThreshold: 400,
        unitPrice: 280,
        totalValue: 1400,
        supplier: "Merck Serono",
        batchNumber: "MET2024-445",
        expirationDate: "2025-06-15",
        receivedDate: "2023-10-08",
        barcode: "3400936457821",
        location: "Étagère C-15",
        activeIngredient: "Chlorhydrate de métformine 850mg",
        sideEffects: "Troubles digestifs, goût métallique",
        contraindications: "Insuffisance rénale, acidose lactique",
        dosageInstructions: "1 comprimé 2-3 fois par jour avec repas",
        prescriptionRequired: true,
        refrigerated: false,
        status: "critical_stock"
      },
      {
        id: "6",
        frenchName: "Oméprazole",
        englishName: "Omeprazole",
        genericName: "Oméprazole",
        brandName: "Mopral",
        category: "gastroprotecteur",
        dosage: "20mg",
        form: "gelule",
        currentStock: 95,
        minimumThreshold: 40,
        maximumThreshold: 600,
        unitPrice: 320,
        totalValue: 30400,
        supplier: "AstraZeneca",
        batchNumber: "OME2024-678",
        expirationDate: "2025-10-22",
        receivedDate: "2024-01-12",
        barcode: "3400938756432",
        location: "Étagère D-09",
        activeIngredient: "Oméprazole magnésien 20mg",
        sideEffects: "Maux de tête, troubles digestifs",
        contraindications: "Hypersensibilité aux benzimidazoles",
        dosageInstructions: "1 gélule le matin à jeun",
        prescriptionRequired: true,
        refrigerated: false,
        status: "available"
      }
    ];

    // Generate alerts based on stock levels and expiration dates
    const generateAlerts = (meds) => {
      const alertsList = [];
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      meds.forEach(med => {
        // Stock level alerts
        if (med.currentStock <= med.minimumThreshold * 0.5) {
          alertsList.push({
            id: `stock-critical-${med.id}`,
            type: 'critical',
            medication: med,
            message: `Stock critique pour ${med.frenchName}: ${med.currentStock} unités restantes`
          });
        } else if (med.currentStock <= med.minimumThreshold) {
          alertsList.push({
            id: `stock-low-${med.id}`,
            type: 'warning',
            medication: med,
            message: `Stock faible pour ${med.frenchName}: ${med.currentStock} unités restantes`
          });
        }

        // Expiration alerts
        const expDate = new Date(med.expirationDate);
        if (expDate <= now) {
          alertsList.push({
            id: `exp-expired-${med.id}`,
            type: 'critical',
            medication: med,
            message: `${med.frenchName} est expiré depuis le ${expDate.toLocaleDateString('fr-FR')}`
          });
        } else if (expDate <= thirtyDaysFromNow) {
          alertsList.push({
            id: `exp-soon-${med.id}`,
            type: 'warning',
            medication: med,
            message: `${med.frenchName} expire le ${expDate.toLocaleDateString('fr-FR')}`
          });
        }
      });

      return alertsList;
    };

    setTimeout(() => {
      setMedications(mockMedications);
      setFilteredMedications(mockMedications);
      setAlerts(generateAlerts(mockMedications));
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilteredMedications(medications);
  };

  const applyFilters = (filterValues) => {
    let filtered = [...medications];

    // Search term filter
    if (filterValues.searchTerm) {
      const searchLower = filterValues.searchTerm.toLowerCase();
      filtered = filtered.filter(med => 
        med.frenchName.toLowerCase().includes(searchLower) ||
        med.englishName.toLowerCase().includes(searchLower) ||
        med.genericName.toLowerCase().includes(searchLower) ||
        med.brandName.toLowerCase().includes(searchLower) ||
        med.barcode.includes(searchLower) ||
        med.batchNumber.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filterValues.category) {
      filtered = filtered.filter(med => med.category === filterValues.category);
    }

    // Supplier filter
    if (filterValues.supplier) {
      filtered = filtered.filter(med => med.supplier.toLowerCase().includes(filterValues.supplier.toLowerCase()));
    }

    // Stock status filter
    if (filterValues.stockStatus) {
      filtered = filtered.filter(med => {
        switch (filterValues.stockStatus) {
          case 'available':
            return med.currentStock > med.minimumThreshold;
          case 'low_stock':
            return med.currentStock <= med.minimumThreshold && med.currentStock > med.minimumThreshold * 0.5;
          case 'critical_stock':
            return med.currentStock <= med.minimumThreshold * 0.5;
          case 'out_of_stock':
            return med.currentStock === 0;
          default:
            return true;
        }
      });
    }

    // Expiration status filter
    if (filterValues.expirationStatus) {
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(med => {
        const expDate = new Date(med.expirationDate);
        switch (filterValues.expirationStatus) {
          case 'valid':
            return expDate > thirtyDaysFromNow;
          case 'expiring_soon':
            return expDate <= thirtyDaysFromNow && expDate > now;
          case 'expired':
            return expDate <= now;
          default:
            return true;
        }
      });
    }

    // Prescription required filter
    if (filterValues.prescriptionRequired !== undefined && filterValues.prescriptionRequired !== '') {
      filtered = filtered.filter(med => med.prescriptionRequired === filterValues.prescriptionRequired);
    }

    // Refrigerated filter
    if (filterValues.refrigerated !== undefined && filterValues.refrigerated !== '') {
      filtered = filtered.filter(med => med.refrigerated === filterValues.refrigerated);
    }

    setFilteredMedications(filtered);
  };

  const handleAddMedication = (medicationData) => {
    const newMedication = {
      ...medicationData,
      id: Date.now().toString(),
      receivedDate: new Date().toISOString().split('T')[0],
      totalValue: medicationData.currentStock * medicationData.unitPrice,
      status: medicationData.currentStock > medicationData.minimumThreshold ? 'available' : 'low_stock'
    };
    
    const updatedMedications = [newMedication, ...medications];
    setMedications(updatedMedications);
    setFilteredMedications(updatedMedications);
  };

  const handleReceiveStock = (stockData) => {
    const updatedMedications = medications.map(med => {
      if (med.id === stockData.medicationId) {
        const newStock = med.currentStock + stockData.quantity;
        return {
          ...med,
          currentStock: newStock,
          totalValue: newStock * med.unitPrice,
          batchNumber: stockData.batchNumber || med.batchNumber,
          expirationDate: stockData.expirationDate || med.expirationDate,
          status: newStock > med.minimumThreshold ? 'available' : 'low_stock'
        };
      }
      return med;
    });
    
    setMedications(updatedMedications);
    setFilteredMedications(updatedMedications);
  };

  const handleDispenseMedication = (dispensingData) => {
    const updatedMedications = medications.map(med => {
      if (med.id === dispensingData.medicationId) {
        const newStock = Math.max(0, med.currentStock - dispensingData.quantity);
        return {
          ...med,
          currentStock: newStock,
          totalValue: newStock * med.unitPrice,
          status: newStock === 0 ? 'out_of_stock' : 
                 newStock <= med.minimumThreshold * 0.5 ? 'critical_stock' :
                 newStock <= med.minimumThreshold ? 'low_stock' : 'available'
        };
      }
      return med;
    });
    
    setMedications(updatedMedications);
    setFilteredMedications(updatedMedications);
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setShowAddMedicationModal(true);
  };

  const handleDispenseClick = (medication) => {
    setSelectedMedication(medication);
    setShowDispensingModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <PrimarySidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement de l'inventaire...</span>
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
                <h1 className="text-2xl font-bold text-foreground">Gestion d'Inventaire Pharmacie</h1>
                <p className="text-muted-foreground">
                  Contrôle complet du stock de médicaments et dispensation des prescriptions
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setShowReceiveStockModal(true)} variant="outline">
                  <Icon name="PackagePlus" size={20} className="mr-2" />
                  Recevoir Stock
                </Button>
                <Button onClick={() => setShowAddMedicationModal(true)}>
                  <Icon name="Plus" size={20} className="mr-2" />
                  Ajouter Médicament
                </Button>
              </div>
            </div>

            {/* Alerts Section */}
            {alerts?.length > 0 && (
              <div className="mb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <Icon name="AlertTriangle" size={20} className="mr-2 text-warning" />
                    Alertes ({alerts.length})
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {alerts.slice(0, 5).map(alert => (
                      <div
                        key={alert.id}
                        className={`flex items-center p-2 rounded-md ${
                          alert.type === 'critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                        }`}
                      >
                        <Icon 
                          name={alert.type === 'critical' ? 'XCircle' : 'AlertCircle'} 
                          size={16} 
                          className="mr-2" 
                        />
                        <span className="text-sm">{alert.message}</span>
                      </div>
                    ))}
                    {alerts.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        +{alerts.length - 5} autres alertes...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Médicaments</p>
                    <p className="text-2xl font-bold text-primary">{medications.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="Pill" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stock Faible</p>
                    <p className="text-2xl font-bold text-warning">
                      {medications.filter(m => m.currentStock <= m.minimumThreshold).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-warning/10">
                    <Icon name="AlertTriangle" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expire Bientôt</p>
                    <p className="text-2xl font-bold text-destructive">
                      {medications.filter(m => {
                        const expDate = new Date(m.expirationDate);
                        const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        return expDate <= thirtyDays;
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-destructive/10">
                    <Icon name="Clock" size={24} className="text-destructive" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valeur Totale</p>
                    <p className="text-2xl font-bold text-success">
                      {medications.reduce((sum, m) => sum + m.totalValue, 0).toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-success/10">
                    <Icon name="TrendingUp" size={24} className="text-success" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Inventory Filters - Left Panel */}
              <div className="lg:col-span-3">
                <InventoryFilters
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Medication Table - Center Panel */}
              <div className="lg:col-span-6">
                <MedicationTable
                  medications={filteredMedications}
                  onEditMedication={handleEditMedication}
                  onDispenseMedication={handleDispenseClick}
                />
              </div>

              {/* Inventory Statistics - Right Panel */}
              <div className="lg:col-span-3">
                <InventoryStatistics 
                  medications={medications}
                  alerts={alerts} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMedicationModal
        isOpen={showAddMedicationModal}
        onClose={() => {
          setShowAddMedicationModal(false);
          setSelectedMedication(null);
        }}
        onSave={handleAddMedication}
        medication={selectedMedication}
      />

      <ReceiveStockModal
        isOpen={showReceiveStockModal}
        onClose={() => setShowReceiveStockModal(false)}
        onSave={handleReceiveStock}
        medications={medications}
      />

      <DispensingModal
        isOpen={showDispensingModal}
        onClose={() => {
          setShowDispensingModal(false);
          setSelectedMedication(null);
        }}
        onSave={handleDispenseMedication}
        medication={selectedMedication}
      />
    </div>
  );
};

export default PharmacyInventoryManagement;