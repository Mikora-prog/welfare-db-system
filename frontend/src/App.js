import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import MembersPage from './pages/Members/MembersPage';
import MemberDetailPage from './pages/Members/MemberDetailPage';
import DependantsPage from './pages/Dependants/DependantsPage';
import PaymentsPage from './pages/Payments/PaymentsPage';
import ReportsPage from './pages/Reports/ReportsPage';

// Components
import Layout from './components/Common/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/members/:id" element={<MemberDetailPage />} />
                    <Route path="/dependants" element={<DependantsPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
