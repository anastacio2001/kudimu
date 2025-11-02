import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import NewLandingPage from './pages/NewLandingPage';
import LandingPage from './pages/LandingPage'; // Backup da antiga
import NewLoginScreen from './screens/NewLoginScreen';
import LoginScreen from './screens/LoginScreen'; // Backup da antiga
import NewSignupScreen from './screens/NewSignupScreen';
import SignupScreen from './screens/SignupScreen'; // Backup da antiga
import NewCampaignsScreen from './screens/NewCampaignsScreen';
import CampaignsScreen from './screens/CampaignsScreen'; // Backup da antiga
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import HistoryScreen from './screens/HistoryScreen'; // Backup da antiga
import NewHistoryScreen from './screens/NewHistoryScreen';
import RewardsScreen from './screens/RewardsScreen'; // Backup da antiga
import NewRewardsScreen from './screens/NewRewardsScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminAnswers from './pages/AdminAnswers';
import AIInsights from './pages/AIInsights';
import ReportsPage from './pages/ReportsPage'; // Backup da antiga
import NewReportsPage from './pages/NewReportsPage';
import NewNotificationSettings from './components/NewNotificationSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './style.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NewLandingPage />} />
          <Route path="/old-landing" element={<LandingPage />} />
          <Route path="/login" element={<NewLoginScreen />} />
          <Route path="/entrar" element={<NewLoginScreen />} />
          <Route path="/old-login" element={<LoginScreen />} />
          <Route path="/signup" element={<NewSignupScreen />} />
          <Route path="/cadastro" element={<NewSignupScreen />} />
          <Route path="/old-signup" element={<SignupScreen />} />
          <Route path="/old-signup" element={<SignupScreen />} />
        <Route path="/campaigns" element={<ProtectedRoute><NewCampaignsScreen /></ProtectedRoute>} />
        <Route path="/old-campaigns" element={<ProtectedRoute><CampaignsScreen /></ProtectedRoute>} />
          <Route path="/questionnaire/:campaignId" element={<ProtectedRoute><QuestionnaireScreen /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><ConfirmationScreen /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><NewHistoryScreen /></ProtectedRoute>} />
          <Route path="/old-history" element={<ProtectedRoute><HistoryScreen /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><NewRewardsScreen /></ProtectedRoute>} />
          <Route path="/old-rewards" element={<ProtectedRoute><RewardsScreen /></ProtectedRoute>} />
          <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupScreen /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><NewReportsPage /></ProtectedRoute>} />
          <Route path="/old-reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NewNotificationSettings /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
          <Route path="/admin/answers" element={<AdminRoute><AdminAnswers /></AdminRoute>} />
          <Route path="/admin/ai-insights" element={<AdminRoute><AIInsights /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><NewReportsPage /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
