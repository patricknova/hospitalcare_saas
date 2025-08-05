import React, { useState, useEffect } from 'react';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimarySidebar from '../../components/ui/PrimarySidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TestOrdersTab from './components/TestOrdersTab';
import SampleProcessingTab from './components/SampleProcessingTab';
import ResultsEntryTab from './components/ResultsEntryTab';
import LabFilters from './components/LabFilters';
import LabStatistics from './components/LabStatistics';

const LaboratoryManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [testOrders, setTestOrders] = useState([]);
  const [samples, setSamples] = useState([]);
  const [results, setResults] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock laboratory data
  useEffect(() => {
    const mockTestOrders = [
      {
        id: "TO001",
        patientId: "MR001234",
        patientName: "Jean Dupont",
        patientAge: 39,
        orderDate: "2024-01-20T08:30:00Z",
        orderedBy: "Dr. Jean Martin",
        department: "consultation",
        tests: [
          {
            id: "T001",
            name: "Numération Formule Sanguine",
            englishName: "Complete Blood Count",
            category: "hematologie",
            urgency: "routine",
            estimatedDuration: 60,
            cost: 15000
          },
          {
            id: "T002", 
            name: "Glycémie à jeun",
            englishName: "Fasting Blood Glucose",
            category: "biochimie",
            urgency: "routine",
            estimatedDuration: 30,
            cost: 8000
          }
        ],
        totalCost: 23000,
        status: "pending",
        priority: "routine",
        sampleRequired: true,
        sampleCollected: false,
        notes: "Patient à jeun depuis 12h"
      },
      {
        id: "TO002",
        patientId: "MR001235",
        patientName: "Marie Kouam",
        patientAge: 32,
        orderDate: "2024-01-20T09:15:00Z",
        orderedBy: "Dr. Marie Kouam",
        department: "urgences",
        tests: [
          {
            id: "T003",
            name: "Troponines cardiaques",
            englishName: "Cardiac Troponins",  
            category: "cardiologie",
            urgency: "urgent",
            estimatedDuration: 45,
            cost: 25000
          }
        ],
        totalCost: 25000,
        status: "in_progress",
        priority: "urgent",
        sampleRequired: true,
        sampleCollected: true,
        notes: "Suspicion d\'infarctus - URGENT"
      },
      {
        id: "TO003",
        patientId: "MR001236",
        patientName: "Paul Mbarga",
        patientAge: 45,
        orderDate: "2024-01-20T10:00:00Z",
        orderedBy: "Dr. Paul Ngono",
        department: "pneumologie",
        tests: [
          {
            id: "T004",
            name: "Analyse d\'urine complète",
            englishName: "Complete Urinalysis",
            category: "urologie",
            urgency: "routine",
            estimatedDuration: 45,
            cost: 12000
          },
          {
            id: "T005",
            name: "Culture d\'urine",
            englishName: "Urine Culture",
            category: "microbiologie",
            urgency: "routine", 
            estimatedDuration: 72,
            cost: 20000
          }
        ],
        totalCost: 32000,
        status: "completed",
        priority: "routine",
        sampleRequired: true,
        sampleCollected: true,
        notes: "Contrôle post-traitement"
      }
    ];

    const mockSamples = [
      {
        id: "S001",
        testOrderId: "TO001",
        patientName: "Jean Dupont",
        sampleType: "sang",
        barcode: "LAB2024-001",
        collectionDate: "2024-01-20T09:00:00Z",
        collectedBy: "Tech. Sylvie Biya",
        status: "collected",
        processingStatus: "pending",
        temperature: "ambient",
        volume: "5ml",
        notes: "Échantillon de qualité"
      },
      {
        id: "S002", 
        testOrderId: "TO002",
        patientName: "Marie Kouam",
        sampleType: "sang",
        barcode: "LAB2024-002",
        collectionDate: "2024-01-20T09:30:00Z",
        collectedBy: "Tech. Michel Etoa",
        status: "processing",
        processingStatus: "in_progress",
        temperature: "refrigerated",
        volume: "3ml",
        notes: "Échantillon urgent - priorité"
      },
      {
        id: "S003",
        testOrderId: "TO003", 
        patientName: "Paul Mbarga",
        sampleType: "urine",
        barcode: "LAB2024-003",
        collectionDate: "2024-01-20T10:30:00Z",
        collectedBy: "Tech. Jeanne Muna",
        status: "completed",
        processingStatus: "completed",
        temperature: "ambient",
        volume: "50ml",
        notes: "Échantillon traité et analysé"
      }
    ];

    const mockResults = [
      {
        id: "R001",
        testOrderId: "TO003",
        sampleId: "S003",
        patientName: "Paul Mbarga",
        testName: "Analyse d\'urine complète",
        category: "urologie",
        completedDate: "2024-01-20T14:30:00Z",
        technician: "Dr. Claire Mbarga",
        results: {
          "Glucose": { value: "Négatif", unit: "", normalRange: "Négatif", status: "normal" },
          "Protéines": { value: "Traces", unit: "mg/dL", normalRange: "<30", status: "normal" },  
          "Hématies": { value: "2-3", unit: "/champ", normalRange: "0-2", status: "slightly_high" },
          "Leucocytes": { value: "5-8", unit: "/champ", normalRange: "0-5", status: "slightly_high" },
          "Densité": { value: "1.020", unit: "", normalRange: "1.003-1.030", status: "normal" }
        },
        status: "validated",
        criticalValues: false,
        notes: "Légère inflammation urinaire, contrôle recommandé",
        reportGenerated: true
      },
      {
        id: "R002",
        testOrderId: "TO002",
        sampleId: "S002", 
        patientName: "Marie Kouam",
        testName: "Troponines cardiaques",
        category: "cardiologie",
        completedDate: "2024-01-20T11:15:00Z",
        technician: "Dr. André Fouda",
        results: {
          "Troponine I": { value: "0.8", unit: "ng/mL", normalRange: "<0.04", status: "critical" },
          "Troponine T": { value: "0.6", unit: "ng/mL", normalRange: "<0.014", status: "critical" }
        },
        status: "critical",
        criticalValues: true,
        notes: "VALEURS CRITIQUES - Infarctus du myocarde confirmé - Contact médecin immédiat",
        reportGenerated: true,
        alertSent: true
      }
    ];

    setTimeout(() => {
      setTestOrders(mockTestOrders);
      setSamples(mockSamples);
      setResults(mockResults);
      setFilteredData(mockTestOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update filtered data when tab or filters change
  useEffect(() => {
    let data = [];
    switch (activeTab) {
      case 'orders':
        data = testOrders;
        break;
      case 'samples':
        data = samples;
        break;
      case 'results':
        data = results;
        break;
      default:
        data = testOrders;
    }
    applyFilters(filters, data);
  }, [activeTab, testOrders, samples, results]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    let data = [];
    switch (activeTab) {
      case 'orders':
        data = testOrders;
        break;
      case 'samples':
        data = samples;
        break;
      case 'results':
        data = results;
        break;
      default:
        data = testOrders;
    }
    applyFilters(newFilters, data);
  };

  const handleClearFilters = () => {
    setFilters({});
    let data = [];
    switch (activeTab) {
      case 'orders':
        data = testOrders;
        break;
      case 'samples':
        data = samples;
        break;
      case 'results':
        data = results;
        break;
      default:
        data = testOrders;
    }
    setFilteredData(data);
  };

  const applyFilters = (filterValues, data) => {
    let filtered = [...data];

    // Search term filter
    if (filterValues.searchTerm) {
      const searchLower = filterValues.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.patientName?.toLowerCase().includes(searchLower) ||
        item.patientId?.toLowerCase().includes(searchLower) ||
        item.id?.toLowerCase().includes(searchLower) ||
        item.barcode?.toLowerCase().includes(searchLower) ||
        item.testName?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filterValues.status) {
      filtered = filtered.filter(item => item.status === filterValues.status);
    }

    // Department filter  
    if (filterValues.department) {
      filtered = filtered.filter(item => item.department === filterValues.department);
    }

    // Priority filter
    if (filterValues.priority) {
      filtered = filtered.filter(item => item.priority === filterValues.priority);
    }

    // Category filter
    if (filterValues.category) {
      filtered = filtered.filter(item => 
        item.category === filterValues.category ||
        item.tests?.some(test => test.category === filterValues.category)
      );
    }

    // Date range filter
    if (filterValues.dateRange) {
      const now = new Date();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.orderDate || item.collectionDate || item.completedDate);
        switch (filterValues.dateRange) {
          case 'today':
            return itemDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
          case 'month':
            return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
  };

  const handleNewTestOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `TO${(testOrders.length + 1).toString().padStart(3, '0')}`,
      orderDate: new Date().toISOString(),
      status: 'pending',
      sampleCollected: false
    };
    
    const updatedOrders = [newOrder, ...testOrders];
    setTestOrders(updatedOrders);
  };

  const handleProcessSample = (sampleData) => {
    const updatedSamples = samples.map(sample => {
      if (sample.id === sampleData.sampleId) {
        return {
          ...sample,
          status: sampleData.status,
          processingStatus: sampleData.processingStatus,
          notes: sampleData.notes || sample.notes
        };
      }
      return sample;
    });
    setSamples(updatedSamples);
  };

  const handleResultEntry = (resultData) => {
    const newResult = {
      ...resultData,
      id: `R${(results.length + 1).toString().padStart(3, '0')}`,
      completedDate: new Date().toISOString(),
      reportGenerated: false
    };
    
    const updatedResults = [newResult, ...results];
    setResults(updatedResults);
  };

  const tabs = [
    { id: 'orders', label: 'Commandes de Tests', icon: 'FileText', count: testOrders.length },
    { id: 'samples', label: 'Traitement d\'Échantillons', icon: 'TestTube', count: samples.length },
    { id: 'results', label: 'Saisie de Résultats', icon: 'ClipboardCheck', count: results.length }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <PrimarySidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Chargement du laboratoire...</span>
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
                <h1 className="text-2xl font-bold text-foreground">Système de Gestion du Laboratoire</h1>
                <p className="text-muted-foreground">
                  Commandes de tests, traitement d'échantillons et saisie de résultats
                </p>
              </div>
              <Button>
                <Icon name="Plus" size={20} className="mr-2" />
                Nouvelle Commande
              </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tests Aujourd'hui</p>
                    <p className="text-2xl font-bold text-primary">
                      {testOrders.filter(order => {
                        const orderDate = new Date(order.orderDate);
                        const today = new Date();
                        return orderDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tests Urgents</p>
                    <p className="text-2xl font-bold text-destructive">
                      {testOrders.filter(order => order.priority === 'urgent').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-destructive/10">
                    <Icon name="AlertTriangle" size={24} className="text-destructive" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Traitement</p>
                    <p className="text-2xl font-bold text-warning">
                      {samples.filter(sample => sample.status === 'processing').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-warning/10">
                    <Icon name="TestTube" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Résultats Prêts</p>
                    <p className="text-2xl font-bold text-success">
                      {results.filter(result => result.status === 'validated').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-success/10">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-card border border-border rounded-lg mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      }`}
                    >
                      <Icon name={tab.icon} size={18} className="mr-2" />
                      {tab.label}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Filters - Left Panel */}
                  <div className="lg:col-span-2">
                    <LabFilters
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      activeTab={activeTab}
                    />
                  </div>

                  {/* Main Content - Center Panel */}
                  <div className="lg:col-span-8">
                    {activeTab === 'orders' && (
                      <TestOrdersTab
                        orders={filteredData}
                        onNewOrder={handleNewTestOrder}
                      />
                    )}
                    {activeTab === 'samples' && (
                      <SampleProcessingTab
                        samples={filteredData}
                        onProcessSample={handleProcessSample}
                      />
                    )}
                    {activeTab === 'results' && (
                      <ResultsEntryTab
                        results={filteredData}
                        onResultEntry={handleResultEntry}
                      />
                    )}
                  </div>

                  {/* Statistics - Right Panel */}
                  <div className="lg:col-span-2">
                    <LabStatistics
                      testOrders={testOrders}
                      samples={samples}
                      results={results}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryManagementSystem;