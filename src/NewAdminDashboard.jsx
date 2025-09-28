import React, { useState } from 'react';
import ImprovedAdminLayout from './ImprovedAdminLayout';
import ImprovedOverview from './components/admin/ImprovedOverview';
import ImprovedSensorNetwork from './components/admin/ImprovedSensorNetwork';
import AIPredictive from './components/admin/AIPredictive';
import ImprovedPersonnelTracking from './components/admin/ImprovedPersonnelTracking';
import RiskAnalysis from './components/admin/RiskAnalysis';
import AlertManagement from './components/admin/AlertManagement';
import MineView3D from './components/admin/MineView3D';
import ManualDataEntry from './components/admin/ManualDataEntry';

const NewAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ImprovedOverview />;
      case 'sensor-network':
        return <ImprovedSensorNetwork />;
      case '3d-mine-view':
        return <MineView3D />;
      case 'ai-predictive':
        return <AIPredictive />;
      case 'personnel-tracking':
        return <ImprovedPersonnelTracking />;
      case 'risk-analysis':
        return <RiskAnalysis />;
      case 'alert-management':
        return <AlertManagement />;
      case 'manual-data-entry':
        return <ManualDataEntry />;
      default:
        return <ImprovedOverview />;
    }
  };

  return (
    <ImprovedAdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </ImprovedAdminLayout>
  );
};

export default NewAdminDashboard;