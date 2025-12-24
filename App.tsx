
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store.ts';
import { UserRole } from './types.ts';

// Components
import Navbar from './components/Navbar.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ClassSelection from './pages/ClassSelection.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import ProgressTracker from './pages/ProgressTracker.tsx';
import Profile from './pages/Profile.tsx';

const App: React.FC = () => {
  const store = useStore();
  const { currentUser } = store;

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col selection:bg-sky-200 selection:text-sky-900">
        {currentUser && <Navbar store={store} />}
        
        <main className="flex-grow relative">
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
          
          {/* Persistant AI Assistant for Students */}
          {currentUser && currentUser.role === UserRole.STUDENT && (
            <AIAssistant store={store} />
          )}
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
