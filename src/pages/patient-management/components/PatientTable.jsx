import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PatientTable = ({ patients, onPatientSelect, onEditPatient, onViewProfile, onScheduleAppointment }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const patientsPerPage = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortConfig.key === 'name') {
      const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortConfig.direction === 'asc' 
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    if (sortConfig.key === 'lastVisit') {
      return sortConfig.direction === 'asc'
        ? new Date(a.lastVisit) - new Date(b.lastVisit)
        : new Date(b.lastVisit) - new Date(a.lastVisit);
    }
    if (sortConfig.key === 'age') {
      return sortConfig.direction === 'asc'
        ? a.age - b.age
        : b.age - a.age;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const currentPatients = sortedPatients.slice(startIndex, startIndex + patientsPerPage);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPatients(currentPatients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId, checked) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients.filter(id => id !== patientId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Actif' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactif' },
      hospitalized: { color: 'bg-warning text-warning-foreground', label: 'Hospitalisé' },
      discharged: { color: 'bg-primary text-primary-foreground', label: 'Sorti' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedPatients.length > 0 && (
        <div className="bg-primary/10 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary">
              {selectedPatients.length} patient(s) sélectionné(s)
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Mail" size={16} className="mr-2" />
                Envoyer SMS
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Calendar" size={16} className="mr-2" />
                RDV Groupé
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedPatients.length === currentPatients.length && currentPatients.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground">Photo</th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="font-medium p-0 h-auto"
                >
                  Nom complet
                  <Icon name={getSortIcon('name')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Contact</th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('age')}
                  className="font-medium p-0 h-auto"
                >
                  Âge
                  <Icon name={getSortIcon('age')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('lastVisit')}
                  className="font-medium p-0 h-auto"
                >
                  Dernière visite
                  <Icon name={getSortIcon('lastVisit')} size={16} className="ml-2" />
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Médecin assigné</th>
              <th className="text-left p-4 font-medium text-foreground">Statut</th>
              <th className="w-16 p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-border hover:bg-muted/30 cursor-pointer"
                onClick={() => onPatientSelect(patient)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectPatient(patient.id, e.target.checked);
                    }}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={patient.photo}
                      alt={`${patient.firstName} ${patient.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      N° {patient.medicalRecordNumber}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm text-foreground">{patient.phone}</p>
                    <p className="text-sm text-muted-foreground">{patient.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-foreground">{patient.age} ans</span>
                </td>
                <td className="p-4">
                  <span className="text-foreground">{formatDate(patient.lastVisit)}</span>
                </td>
                <td className="p-4">
                  <span className="text-foreground">{patient.assignedDoctor}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(patient.status)}
                </td>
                <td className="p-4">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === patient.id ? null : patient.id);
                      }}
                    >
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                    
                    {showActionMenu === patient.id && (
                      <div className="absolute right-0 top-8 w-48 bg-popover border border-border rounded-lg shadow-prominent z-50">
                        <div className="py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewProfile(patient);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                          >
                            <Icon name="Eye" size={16} className="mr-2" />
                            Voir le profil
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditPatient(patient);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                          >
                            <Icon name="Edit" size={16} className="mr-2" />
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onScheduleAppointment(patient);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center"
                          >
                            <Icon name="Calendar" size={16} className="mr-2" />
                            Planifier RDV
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center">
                            <Icon name="FileText" size={16} className="mr-2" />
                            Historique médical
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center text-error">
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {currentPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-background border border-border rounded-lg p-4 space-y-3"
            onClick={() => onPatientSelect(patient)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedPatients.includes(patient.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectPatient(patient.id, e.target.checked);
                  }}
                  className="rounded border-border"
                />
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={patient.photo}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    N° {patient.medicalRecordNumber}
                  </p>
                </div>
              </div>
              {getStatusBadge(patient.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="text-foreground">{patient.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Âge</p>
                <p className="text-foreground">{patient.age} ans</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dernière visite</p>
                <p className="text-foreground">{formatDate(patient.lastVisit)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Médecin</p>
                <p className="text-foreground">{patient.assignedDoctor}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                onViewProfile(patient);
              }}>
                <Icon name="Eye" size={16} className="mr-2" />
                Voir
              </Button>
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation();
                onScheduleAppointment(patient);
              }}>
                <Icon name="Calendar" size={16} className="mr-2" />
                RDV
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à {Math.min(startIndex + patientsPerPage, sortedPatients.length)} sur {sortedPatients.length} patients
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm text-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  );
};

export default PatientTable;