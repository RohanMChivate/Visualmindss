
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { UserRole } from './types';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ClassSelection from './pages/ClassSelection';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const store = useStore();
  const { currentUser } = store;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        {currentUser && <Navbar store={store} />}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            {!currentUser ? (
              <>
                <Route path="/login" element={<Login login={store.login} />} />
                <Route path="/register" element={<Register register={store.register} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                {/* Role Protected Routes */}
                {currentUser.role === UserRole.ADMIN ? (
                  <>
                    <Route path="/admin" element={<AdminDashboard store={store} />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </>
                ) : (
                  <>
                    <Route 
                      path="/select-class" 
                      element={<ClassSelection currentClass={currentUser.selectedClass} setClass={store.setClass} />} 
                    />
                    
                    {/* Only allow access to dashboards if class is selected */}
                    {currentUser.selectedClass ? (
                      <>
                        <Route path="/dashboard" element={<StudentDashboard store={store} />} />
                        <Route path="/progress" element={<ProgressTracker store={store} />} />
                        <Route path="/profile" element={<Profile store={store} />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </>
                    ) : (
                      <Route path="*" element={<Navigate to="/select-class" replace />} />
                    )}
                  </>
                )}
              </>
            )}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
