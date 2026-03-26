import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import ContactPage from './pages/ContactPage';
import StatusPage from './pages/StatusPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PatientSignupPage from './pages/PatientSignupPage';
import ProviderSignupPage from './pages/ProviderSignupPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientAppointmentsPage from './pages/PatientAppointmentsPage';
import MessagesPage from './pages/MessagesPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import ConsultationRoomPage from './pages/ConsultationRoomPage';
import HealthRecordPage from './pages/HealthRecordPage';
import PharmacyPage from './pages/PharmacyPage';
import BillingPage from './pages/BillingPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        <Route path="/signup/patient" element={<PatientSignupPage />} />
        <Route path="/signup/provider" element={<ProviderSignupPage />} />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/symptom-checker"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <SymptomCheckerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultation/:sessionId"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <ConsultationRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/health-record"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <HealthRecordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/pharmacy"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PharmacyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/billing"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BillingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <ProviderDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
