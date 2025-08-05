import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginAuthentication from "pages/login-authentication";
import DashboardOverview from "pages/dashboard-overview";
import ConsultationManagement from "pages/consultation-management";
import AppointmentScheduling from "pages/appointment-scheduling";
import PatientManagement from "pages/patient-management";
import PharmacyInventoryManagement from "pages/pharmacy-inventory-management";
import LaboratoryManagementSystem from "pages/laboratory-management-system";
import BillingAndPaymentProcessing from "pages/billing-and-payment-processing";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/login-authentication" element={<LoginAuthentication />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/consultation-management" element={<ConsultationManagement />} />
        <Route path="/appointment-scheduling" element={<AppointmentScheduling />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/pharmacy-inventory-management" element={<PharmacyInventoryManagement />} />
        <Route path="/laboratory-management-system" element={<LaboratoryManagementSystem />} />
        <Route path="/billing-and-payment-processing" element={<BillingAndPaymentProcessing />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;