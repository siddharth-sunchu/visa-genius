import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { Provider } from 'react-redux';
import { AuthContext } from './contexts/AuthContext';
import { useAuthProvider } from './hooks/useAuth';
import { store } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import CriteriaSelectionPage from './pages/CriteriaSelectionPage';
import RecommendationLettersPage from './pages/RecommendationLettersPage';
import PetitionLetterPage from './pages/PetitionLetterPage';
import DocumentsPage from './pages/DocumentsPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import ContactPage from './pages/ContactPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = React.useContext(AuthContext);
  
  if (auth?.loading) {
    return <div>Loading...</div>;
  }
  
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const auth = useAuthProvider();

  // Configure Ant Design message
  message.config({
    top: 60,
    duration: 3,
    maxCount: 3,
  });

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
        }}
      >
        <AuthContext.Provider value={auth}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <MainLayout>
                  <LandingPage />
                </MainLayout>
              } />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DashboardPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/personal-info" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PersonalInfoPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/criteria-selection" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CriteriaSelectionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/recommendation-letters" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <RecommendationLettersPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/petition-letter" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PetitionLetterPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DocumentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ChatPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
