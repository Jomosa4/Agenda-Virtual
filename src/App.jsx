import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Chat from './pages/Chat';
import AdminRegister from './pages/AdminRegister';
import EditReport from './pages/EditReport';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useContext } from 'react';

// Wrapper component to handle redirects based on auth status and role
const AuthRoute = ({ children }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-crema">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sol"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  // If user is logged in, check role for specific routes if needed.
  // For root path, we might redirect based on role.

  return children;
};

const RootRedirect = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) return null; // handled by AuthRoute logic or app loading

  if (!user) return <Navigate to="/login" />;

  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  } else {
    return <Dashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AuthRoute>
                <RootRedirect />
              </AuthRoute>
            }
          />
          <Route
            path="/chat/:parentId?"
            element={
              <AuthRoute>
                <Chat />
              </AuthRoute>
            }
          />
          <Route
            path="/admin-register"
            element={<AdminRegister />}
          />
          <Route
            path="/report/:studentId"
            element={
              <AuthRoute>
                <EditReport />
              </AuthRoute>
            }
          />
          {/* Specific routes if needed, e.g. /teacher-dashboard or /parent-dashboard, but / redirects correctly now */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
