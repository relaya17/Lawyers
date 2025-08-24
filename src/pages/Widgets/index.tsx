// Widgets Page - דף וידג'טים
// PWA optimized widgets page

import React, { useState } from 'react';
import { WidgetDashboard } from '@/features/widgets/components/WidgetDashboard';

export const WidgetsPage: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    // Navigate back or close widget view
    window.history.back();
  };

  return (
    <WidgetDashboard
      isFullscreen={isFullscreen}
      onToggleFullscreen={handleToggleFullscreen}
      onClose={handleClose}
    />
  );
};

export default WidgetsPage;
