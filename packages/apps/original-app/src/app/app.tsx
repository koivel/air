import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import KoivelNavBar from './components/nav-bar/nav-bar';
import { KoivelDashboardProvider } from './contexts/koivel-dashboard-context';
import ContactPage from './pages/contact-page';
import Dashboard from './pages/dashboard';
import Dashbaords from './pages/dashboards';
import DevPage from './pages/dev';
import Landing from './pages/landing';
import LoginPage from './pages/login-page';
import PasswordResetPage from './pages/password-reset-page';
import PasswordUpdatePage from './pages/password-update-page copy';
import PrivacyPolicyPage from './pages/privacy-policy';
import Profile from './pages/profile';
import RegisterPage from './pages/registration-page';
import TermsOfUsePage from './pages/terms-of-use';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <Route path="/contact-us" element={<ContactPage />} />
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
