import React, { Suspense, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Helmet } from 'react-helmet-async'
import { RequireRegistration } from './RequireRegistration'
import { RoleGuard } from './RoleGuard'
import NavBar from '../widgets/Navigation/NavBar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import AIAssistant from '../widgets/AIAssistant'
import { AppFooter } from '../widgets/AppFooter'

// Lazy loaded pages
const HomePage = React.lazy(() => import('../pages/Home').then(m => ({ default: m.HomePage })))
const ServicesPage = React.lazy(() => import('../pages/Services').then(m => ({ default: m.ServicesPage })))
const SimulatorPage = React.lazy(() => import('../pages/Simulator').then(m => ({ default: m.SimulatorPage })))
const RiskAnalysisPage = React.lazy(() => import('../pages/RiskAnalysis').then(m => ({ default: m.RiskAnalysisPage })))
const RegulatoryCompliancePage = React.lazy(() => import('../pages/RegulatoryCompliance').then(m => ({ default: m.default })))
const MarketplacePage = React.lazy(() => import('../pages/Marketplace').then(m => ({ default: m.MarketplacePage })))
const SettingsPage = React.lazy(() => import('../pages/Settings').then(module => ({ default: module.SettingsPage })))
const ProfilePage = React.lazy(() => import('../pages/Profile').then(m => ({ default: m.ProfilePage })))
const DashboardPage = React.lazy(() => import('../pages/Dashboard').then(m => ({ default: m.DashboardPage })))
const LoginPage = React.lazy(() => import('../pages/Auth/Login').then(m => ({ default: m.LoginPage })))
const RegisterPage = React.lazy(() => import('../pages/Auth/Register').then(m => ({ default: m.RegisterPage })))
const NotFoundPage = React.lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFoundPage })))
const AdaptiveLearningPage = React.lazy(() => import('../pages/AdaptiveLearning').then(m => ({ default: m.AdaptiveLearningPage })))
const ContractTemplatesPage = React.lazy(() => import('../pages/ContractTemplates').then(m => ({ default: m.default })))
const ContractTemplateDetailsPage = React.lazy(() => import('../pages/ContractTemplates/TemplateDetails').then(m => ({ default: m.default })))
const SecurityPage = React.lazy(() => import('../pages/Security').then(module => ({ default: module.SecurityPage })))
const VirtualCourtPage = React.lazy(() => import('../pages/VirtualCourt').then(m => ({ default: m.VirtualCourtPage })))
const VirtualCourt2Page = React.lazy(() => import('../pages/VirtualCourt2').then(m => ({ default: m.VirtualCourt2Page })))
const AIAssistantPage = React.lazy(() => import('../pages/AIAssistant').then(m => ({ default: m.AIAssistantPage })))
const LegalKnowledgePage = React.lazy(() => import('../pages/LegalKnowledge').then(m => ({ default: m.LegalKnowledgePage })))
const ContractsPage = React.lazy(() => import('../pages/Contracts').then(m => ({ default: m.ContractsPage })))
const ContractEditorPage = React.lazy(() => import('../pages/ContractEditor').then(m => ({ default: m.ContractEditorPage })))
const NegotiationPage = React.lazy(() => import('../pages/Negotiation').then(m => ({ default: m.NegotiationPage })))
const VersionControlPage = React.lazy(() => import('../pages/VersionControl').then(m => ({ default: m.VersionControlPage })))
const WorkflowAutomationPage = React.lazy(() => import('../pages/WorkflowAutomation'))
const PricingPage = React.lazy(() => import('../pages/Pricing').then(m => ({ default: m.default })))
const BillingSuccessPage = React.lazy(() => import('../pages/BillingSuccess').then(m => ({ default: m.default })))
const AccountBillingPage = React.lazy(() => import('../pages/AccountBilling').then(m => ({ default: m.default })))
const VectorManagementPage = React.lazy(() =>
  import('../pages/admin/VectorManagement').then((m) => ({ default: m.VectorManagementPage })),
)
const LandingPage = React.lazy(() => import('../pages/Landing').then((m) => ({ default: m.LandingPage })))
const PleadingsGamePage = React.lazy(() => import('../pages/PleadingsGame').then((m) => ({ default: m.PleadingsGamePage })))
const CourtroomLobbyPage = React.lazy(() =>
  import('../features/courtroom/pages/CourtroomLobbyPage').then((m) => ({ default: m.default })),
)
const LiveCourtroomPage = React.lazy(() =>
  import('../features/courtroom/pages/LiveCourtroomPage').then((m) => ({ default: m.default })),
)

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
        <title>LexStudy – פלטפורמת לימוד משפט</title>
        <meta name="description" content="מבחנים, הסברים וסימולטור בית-משפט לסטודנטים למשפטים" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-navbutton-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar onOpenAIAssistant={() => setAiAssistantOpen(true)} />
        
        <Box component="main" sx={{ flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 1280,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, md: 3 },
              pb: {
                xs: 'calc(88px + env(safe-area-inset-bottom))',
                sm: 'calc(88px + env(safe-area-inset-bottom))',
                md: 3,
              },
            }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/billing/success" element={<BillingSuccessPage />} />

                <Route element={<RequireRegistration />}>
                  <Route path="/contracts" element={<ContractsPage />} />
                  <Route path="/contract-editor" element={<ContractEditorPage />} />
                  <Route path="/contract-editor/:id" element={<ContractEditorPage />} />
                  <Route path="/negotiation" element={<NegotiationPage />} />
                  <Route path="/version-control" element={<VersionControlPage />} />
                  <Route path="/workflow-automation" element={<WorkflowAutomationPage />} />
                  <Route path="/legal-knowledge" element={<LegalKnowledgePage />} />
                  <Route path="/adaptive-learning" element={<AdaptiveLearningPage />} />
                  <Route path="/simulator" element={<SimulatorPage />} />
                  <Route path="/virtual-court/*" element={<VirtualCourtPage />} />
                  <Route path="/virtual-court-2/*" element={<VirtualCourt2Page />} />
                  <Route path="/courtroom" element={<CourtroomLobbyPage />} />
                  <Route path="/courtroom/:sessionId" element={<LiveCourtroomPage />} />
                  <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
                  <Route path="/regulatory-compliance" element={<RegulatoryCompliancePage />} />
                  <Route path="/contract-templates" element={<ContractTemplatesPage />} />
                  <Route path="/contract-templates/:templateId" element={<ContractTemplateDetailsPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/ai-assistant" element={<AIAssistantPage />} />
                  <Route path="/pleadings-game" element={<PleadingsGamePage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/account/billing" element={<AccountBillingPage />} />
                  <Route
                    path="/admin/vectors"
                    element={
                      <RoleGuard allowed={['admin']}>
                        <VectorManagementPage />
                      </RoleGuard>
                    }
                  />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>

        <AppFooter />
        
        <AIAssistant 
          isOpen={aiAssistantOpen}
          onToggle={setAiAssistantOpen}
          compact={true}
          position="bottom-left"
        />
      </Box>
    </>
  )
}
