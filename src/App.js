import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import HistoryScreen from './screens/HistoryScreen';
import RewardsScreen from './screens/RewardsScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCampaigns from './pages/AdminCampaigns';
import ClientCampaigns from './pages/ClientCampaigns';
import CampaignAnalytics from './pages/CampaignAnalytics';
import AdminCampaignAnalytics from './pages/AdminCampaignAnalytics';
import ClientCampaignAnalytics from './pages/ClientCampaignAnalytics';
import BudgetManagement from './pages/BudgetManagement';
import ClientBudgetManagement from './pages/ClientBudgetManagement';
import CreditManagement from './pages/CreditManagement';
import AdminAnswers from './pages/AdminAnswers';
import AdminWithdrawals from './pages/AdminWithdrawals';
import AIInsights from './pages/AIInsights';
import ClientAIInsights from './pages/ClientAIInsights';
import ReportsPage from './pages/ReportsPage';
import AdminReports from './pages/AdminReports';
import ClientReports from './pages/ClientReports';
import ClientSubscription from './pages/ClientSubscription';
import ClientPlanUpgrade from './pages/ClientPlanUpgrade';
import ClientBillingHistory from './pages/ClientBillingHistory';
import ClientProfile from './pages/ClientProfile';
import ClientSettings from './pages/ClientSettings';
import ClientSupport from './pages/ClientSupport';
import ClientServicesPage from './pages/ClientServicesPage';
import NotificationSettings from './components/NotificationSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import DashboardRedirect from './components/DashboardRedirect';
import './style.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/entrar" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/cadastro" element={<SignupScreen />} />
          
          {/* Redirecionamento inteligente */}
          <Route path="/home" element={<DashboardRedirect />} />
          
          {/* TELA PRINCIPAL ÚNICA - Campanhas é o dashboard principal */}
          <Route path="/dashboard" element={<UserRoute><CampaignsScreen /></UserRoute>} />
          <Route path="/campaigns" element={<UserRoute><CampaignsScreen /></UserRoute>} />
          <Route path="/questionnaire/:campaignId" element={<UserRoute><QuestionnaireScreen /></UserRoute>} />
          <Route path="/confirmation" element={<UserRoute><ConfirmationScreen /></UserRoute>} />
          <Route path="/history" element={<UserRoute><HistoryScreen /></UserRoute>} />
          <Route path="/rewards" element={<UserRoute><RewardsScreen /></UserRoute>} />
          <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupScreen /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
          
          {/* Rotas administrativas */}
          <Route path="/admin" element={<AdminRoute allowClients={true}><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute adminOnly={true}><AdminUsers /></AdminRoute>} />

          {/* Dashboard específico para clientes */}
          <Route path="/client/dashboard" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientDashboard /></AdminRoute>
          } />
          
          {/* Campanhas - separadas por tipo de usuário */}
          <Route path="/admin/campaigns" element={<AdminRoute adminOnly={true}><AdminCampaigns /></AdminRoute>} />
          <Route path="/client/campaigns" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientCampaigns /></AdminRoute>
          } />
          
          {/* Analytics - separados por tipo de usuário */}
          <Route path="/admin/campaigns/:campaignId/analytics" element={
            <AdminRoute adminOnly={true}><AdminCampaignAnalytics /></AdminRoute>
          } />
          <Route path="/client/campaigns/:campaignId/analytics" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientCampaignAnalytics /></AdminRoute>
          } />
          
          {/* Budget Management - separados por tipo de usuário */}
          <Route path="/admin/budget" element={<AdminRoute adminOnly={true}><BudgetManagement /></AdminRoute>} />
          <Route path="/client/budget" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientBudgetManagement /></AdminRoute>
          } />
          
          {/* Credit Management - Gestão de créditos do cliente */}
          <Route path="/client/credits" element={
            <AdminRoute allowClients={true} adminOnly={false}><CreditManagement /></AdminRoute>
          } />
          
          {/* Client Subscription & Plans */}
          <Route path="/client/subscription" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientSubscription /></AdminRoute>
          } />
          <Route path="/client/plans" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientPlanUpgrade /></AdminRoute>
          } />
          <Route path="/client/billing" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientBillingHistory /></AdminRoute>
          } />
          
          {/* Client Profile & Settings */}
          <Route path="/client/profile" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientProfile /></AdminRoute>
          } />
          <Route path="/client/settings" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientSettings /></AdminRoute>
          } />
          
          {/* Client Support */}
          <Route path="/client/support" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientSupport /></AdminRoute>
          } />
          
          {/* Client Services - Nova funcionalidade */}
          <Route path="/client/services" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientServicesPage /></AdminRoute>
          } />
          
          <Route path="/admin/answers" element={<AdminRoute allowClients={true}><AdminAnswers /></AdminRoute>} />
          <Route path="/admin/withdrawals" element={<AdminRoute adminOnly={true}><AdminWithdrawals /></AdminRoute>} />
          <Route path="/admin/ai-insights" element={<AdminRoute adminOnly={true}><AIInsights /></AdminRoute>} />
          <Route path="/client/ai-insights" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientAIInsights /></AdminRoute>
          } />
          
          {/* Reports - separados por tipo de usuário */}
          <Route path="/admin/reports" element={<AdminRoute adminOnly={true}><AdminReports /></AdminRoute>} />
          <Route path="/client/reports" element={
            <AdminRoute allowClients={true} adminOnly={false}><ClientReports /></AdminRoute>} />
          <Route path="/reports" element={<AdminRoute allowClients={true}><ReportsPage /></AdminRoute>} />
          
          <Route path="*" element={<DashboardRedirect />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
