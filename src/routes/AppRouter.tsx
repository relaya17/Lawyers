import React, { Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { PrivateRoute } from './PrivateRoute'
import NavBar from '../widgets/Navigation/NavBar'
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner'
import AIAssistant from '../widgets/AIAssistant'

// Lazy loaded pages - אופטימיזציה של imports
const HomePage = React.lazy(() => import('../pages/Home').then(m => ({ default: m.HomePage })))
const ContractsPage = React.lazy(() => import('../pages/Contracts').then(m => ({ default: m.ContractsPage })))
const ContractViewPage = React.lazy(() => import('../pages/Contracts/View').then(module => ({ default: module.ContractViewPage })))
const ContractEditPage = React.lazy(() => import('../pages/Contracts/Edit').then(module => ({ default: module.ContractEditPage })))
const ContractNewPage = React.lazy(() => import('../pages/Contracts/New').then(module => ({ default: module.ContractNewPage })))
const VersionControlPage = React.lazy(() => import('../pages/VersionControl').then(m => ({ default: m.VersionControlPage })))
const SimulatorPage = React.lazy(() => import('../pages/Simulator').then(m => ({ default: m.SimulatorPage })))
const RiskAnalysisPage = React.lazy(() => import('../pages/RiskAnalysis').then(m => ({ default: m.RiskAnalysisPage })))
const RegulatoryCompliancePage = React.lazy(() => import('../pages/RegulatoryCompliance').then(m => ({ default: m.default })))
const WorkflowAutomationPage = React.lazy(() => import('../pages/WorkflowAutomation').then(m => ({ default: m.default })))
const NegotiationPage = React.lazy(() => import('../pages/Negotiation').then(m => ({ default: m.NegotiationPage })))
const MarketplacePage = React.lazy(() => import('../pages/Marketplace').then(m => ({ default: m.MarketplacePage })))
const SettingsPage = React.lazy(() => import('../pages/Settings').then(module => ({ default: module.SettingsPage })))
const ProfilePage = React.lazy(() => import('../pages/Profile').then(m => ({ default: m.ProfilePage })))
const DashboardPage = React.lazy(() => import('../pages/Dashboard').then(m => ({ default: m.DashboardPage })))
const LoginPage = React.lazy(() => import('../pages/Auth/Login').then(m => ({ default: m.LoginPage })))
const RegisterPage = React.lazy(() => import('../pages/Auth/Register').then(m => ({ default: m.RegisterPage })))
const NotFoundPage = React.lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFoundPage })))
const AdaptiveLearningPage = React.lazy(() => import('../pages/AdaptiveLearning').then(m => ({ default: m.AdaptiveLearningPage })))
const ContractTemplatesPage = React.lazy(() => import('../pages/ContractTemplates').then(m => ({ default: m.default })))
const FlowMapPage = React.lazy(() => import('../pages/FlowMap').then(module => ({ default: module.FlowMapPage })))
const SecurityPage = React.lazy(() => import('../pages/Security').then(module => ({ default: module.SecurityPage })))
const VirtualCourtPage = React.lazy(() => import('../pages/VirtualCourt').then(m => ({ default: m.VirtualCourtPage })))
const WidgetsPage = React.lazy(() => import('../pages/Widgets').then(m => ({ default: m.WidgetsPage })))
const CRMPage = React.lazy(() => import('../pages/CRM').then(m => ({ default: m.CRMPage })))
const BusinessIntelligencePage = React.lazy(() => import('../pages/BusinessIntelligence').then(m => ({ default: m.default })))
const ContractEditorPage = React.lazy(() => import('../pages/ContractEditor').then(m => ({ default: m.ContractEditorPage })))
const AIAssistantPage = React.lazy(() => import('../pages/AIAssistant').then(m => ({ default: m.AIAssistantPage })))
const ExternalIntegrationsPage = React.lazy(() => import('../pages/ExternalIntegrations').then(m => ({ default: m.ExternalIntegrationsPage })))
const IOSNativeFeaturesPage = React.lazy(() => import('../pages/IOSNativeFeatures').then(m => ({ default: m.IOSNativeFeaturesPage })))
const AppleWatchPage = React.lazy(() => import('../pages/AppleWatch').then(m => ({ default: m.AppleWatchPage })))
const SiriIntegrationPage = React.lazy(() => import('../pages/SiriIntegration').then(m => ({ default: m.SiriIntegrationPage })))
const LegalKnowledgePage = React.lazy(() => import('../pages/LegalKnowledge').then(m => ({ default: m.LegalKnowledgePage })))

// רכיב טעינה משופר עבור Suspense
const PageLoader: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <LoadingSpinner />
  </Box>
)

export const AppRouter: React.FC = () => {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>ContractLab Pro</title>
        <meta name="description" content="פלטפורמה מתקדמת לניהול חוזים ולמידה משפטית" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1565c0" />
      </Helmet>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar onOpenAIAssistant={() => setAiAssistantOpen(true)} />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/contracts/new" element={<ContractNewPage />} />
              <Route path="/contracts/:id/edit" element={<ContractEditPage />} />
              <Route path="/contracts/:id" element={<ContractViewPage />} />
              <Route path="/version-control" element={<VersionControlPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
              <Route path="/regulatory-compliance" element={<RegulatoryCompliancePage />} />
              <Route path="/workflow-automation" element={<WorkflowAutomationPage />} />
              <Route path="/negotiation" element={<NegotiationPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/contract-templates" element={<ContractTemplatesPage />} />
              <Route path="/adaptive-learning" element={<AdaptiveLearningPage />} />
              <Route path="/flow-map" element={<FlowMapPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/virtual-court" element={<VirtualCourtPage />} />
              <Route path="/widgets" element={<WidgetsPage />} />
              <Route path="/crm" element={<CRMPage />} />
              <Route path="/business-intelligence" element={<BusinessIntelligencePage />} />
              <Route path="/contract-editor" element={<ContractEditorPage />} />
              <Route path="/contract-editor/:contractId" element={<ContractEditorPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/external-integrations" element={<ExternalIntegrationsPage />} />
              <Route path="/ios-native-features" element={<IOSNativeFeaturesPage />} />
              <Route path="/apple-watch" element={<AppleWatchPage />} />
              <Route path="/siri-integration" element={<SiriIntegrationPage />} />
              <Route path="/legal-knowledge" element={<LegalKnowledgePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<PrivateRoute />}>
                {/* protected routes placeholder */}
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Box>
        
        {/* AI Assistant */}
        <AIAssistant 
          isOpen={aiAssistantOpen}
          onToggle={setAiAssistantOpen}
          compact={true}
        />
      </Box>
    </>
  )
}
