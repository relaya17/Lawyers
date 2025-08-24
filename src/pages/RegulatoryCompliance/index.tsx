import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  Button,
  Grid,
  Alert,
  Fab,
  Tooltip
} from '@mui/material'
import {
  Dashboard,
  Analytics,
  Settings,
  Add,
  Security
} from '@mui/icons-material'
import { RegulatoryDashboard, ComplianceAnalyzer } from '../../features/regulatory-analysis'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`regulatory-tabpanel-${index}`}
      aria-labelledby={`regulatory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `regulatory-tab-${index}`,
    'aria-controls': `regulatory-tabpanel-${index}`,
  }
}

export const RegulatoryCompliancePage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          מודול ניתוח רגולציה דינמית
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          ניטור אוטומטי של שינויים רגולטוריים וניתוח תאימות חוזים בזמן אמת
        </Typography>

        {/* Key Features Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            תכונות המודול:
          </Typography>
          <Box component="ul" sx={{ margin: 0, paddingLeft: '20px' }}>
            <li>ניטור אוטומטי של עדכונים רגולטוריים</li>
            <li>ניתוח תאימות חוזים בזמן אמת</li>
            <li>התראות פרואקטיביות על שינויי חקיקה</li>
            <li>המלצות מותאמות לתיקון הפרות</li>
            <li>דשבורד מנהלים עם מגמות וסטטיסטיקות</li>
          </Box>
        </Alert>
      </Box>

      {/* Navigation Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="regulatory compliance tabs">
            <Tab 
              icon={<Dashboard />} 
              label="דשבורד ציות" 
              {...a11yProps(0)}
              sx={{ minHeight: 48 }}
            />
            <Tab 
              icon={<Analytics />} 
              label="מנתח ציות" 
              {...a11yProps(1)}
              sx={{ minHeight: 48 }}
            />
            <Tab 
              icon={<Settings />} 
              label="הגדרות מעקב" 
              {...a11yProps(2)}
              sx={{ minHeight: 48 }}
            />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        <TabPanel value={currentTab} index={0}>
          <RegulatoryDashboard />
        </TabPanel>

        {/* Analyzer Tab */}
        <TabPanel value={currentTab} index={1}>
          <ComplianceAnalyzer />
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={currentTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              הגדרות מעקב רגולטורי
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    מקורות רגולציה
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    הגדר מקורות מידע לעדכונים רגולטוריים
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />}>
                    הוסף מקור חדש
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    התראות אוטומטיות
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    הגדר התראות על שינויים רגולטוריים
                  </Typography>
                  <Button variant="outlined" startIcon={<Settings />}>
                    הגדר התראות
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    תחומי מעקב
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    בחר תחומים משפטיים למעקב
                  </Typography>
                  <Button variant="outlined" startIcon={<Security />}>
                    ערוך תחומים
                  </Button>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    אינטגרציות
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    חבר למערכות חיצוניות
                  </Typography>
                  <Button variant="outlined" startIcon={<Add />}>
                    הוסף אינטגרציה
                  </Button>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                שימו לב:
              </Typography>
              הגדרות המעקב הרגולטורי דורשות הרשאות מנהל מערכת. 
              שינויים יכנסו לתוקף תוך 24 שעות.
            </Alert>
          </Box>
        </TabPanel>
      </Card>

      {/* Floating Action Button */}
      <Tooltip title="ניתוח מהיר">
        <Fab
          color="primary"
          aria-label="quick analysis"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setCurrentTab(1)}
        >
          <Analytics />
        </Fab>
      </Tooltip>
    </Container>
  )
}

export default RegulatoryCompliancePage
