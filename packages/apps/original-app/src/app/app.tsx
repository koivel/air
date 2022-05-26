// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { ApmRoute } from '@elastic/apm-rum-react'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import KoivelNavBar from './components/nav-bar/nav-bar';
import Profile from './pages/profile';
import { KoivelDashboardProvider } from './contexts/koivel-dashboard-context';
import Landing from './pages/landing';
import DevPage from './pages/dev';
import Dashbaords from './pages/dashboards';
import LoginPage from './pages/login-page';
import PrivacyPolicyPage from './pages/privacy-policy';
import RegisterPage from './pages/registration-page';
import TermsOfUsePage from './pages/terms-of-use';
import { ToastContainer } from 'react-toastify';
import PasswordResetPage from './pages/password-reset-page';
import PasswordUpdatePage from './pages/password-update-page copy';

export function App() {
  return (
    <div className="h-screen bg-slate-700 overflow-y-auto">
      <KoivelNavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dev" element={<DevPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route path="/update-password" element={<PasswordUpdatePage />} />
        <Route path="/dashboards" element={<Dashbaords />} />
        <Route
          path="/dashboard/:dashboardId"
          element={
            <KoivelDashboardProvider>
              <Dashboard />
            </KoivelDashboardProvider>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
