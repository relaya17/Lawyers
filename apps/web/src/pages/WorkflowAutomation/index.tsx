// Workflow Automation Page
// דף אוטומציה של תהליכי עבודה

import React from 'react'
import { Box } from '@mui/material'
import { AccountTree } from '@mui/icons-material'
import { WorkflowDashboard } from '@/features/workflow-automation'
import { PageHero } from '@shared/design/PageHero'

const WorkflowAutomationPage: React.FC = () => {
  return (
    <Box>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <PageHero
          title="אוטומציה משפטית"
          subtitle="בנה תהליכי עבודה חכמים שאוטומטים אישורי חוזים, תזכורות פקיעה, התראות ודוחות אוטומטיים. חוסך שעות ומונע טעויות אנושיות."
          chips={['אישור אוטומטי', 'תזכורות פקיעה', 'דוחות חכמים']}
          icon={<AccountTree sx={{ fontSize: 48 }} />}
        />
      </Box>
      <WorkflowDashboard />
    </Box>
  )
}

export default WorkflowAutomationPage
