import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminUsers from './pages/AdminUsers';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminAnswers from './pages/AdminAnswers';
import AIInsights from './pages/AIInsights';
import ReportsPage from './screens/ReportsPage';
import NotificationSettings from './components/NotificationSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './style.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/entrar" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/cadastro" element={<SignupScreen />} />
        <Route path="/campaigns" element={<ProtectedRoute><CampaignsScreen /></ProtectedRoute>} />
        <Route path="/questionnaire/:campaignId" element={<ProtectedRoute><QuestionnaireScreen /></ProtectedRoute>} />
        <Route path="/confirmation" element={<ProtectedRoute><ConfirmationScreen /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryScreen /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><RewardsScreen /></ProtectedRoute>} />
        <Route path="/profile/setup" element={<ProtectedRoute><ProfileSetupScreen /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
        <Route path="/admin/answers" element={<AdminRoute><AdminAnswers /></AdminRoute>} />
        <Route path="/admin/ai-insights" element={<AdminRoute><AIInsights /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><ReportsPage /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
