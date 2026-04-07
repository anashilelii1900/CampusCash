import { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { StudentDashboard } from './components/StudentDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { JobDetailsPage } from './components/JobDetailsPage';
import { MessagingPage } from './components/MessagingPage';
import { HowItWorksStudents } from './components/HowItWorksStudents';
import { HowItWorksEmployers } from './components/HowItWorksEmployers';
import { ApplicationsPage } from './components/ApplicationsPage';
import { ProfileSettingsPage } from './components/ProfileSettingsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { StudentProfilePage } from './components/StudentProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { api } from './api/client';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './context/ThemeContext';

export type PageType =
  | 'home'
  | 'auth'
  | 'student-dashboard'
  | 'employer-dashboard'
  | 'job-details'
  | 'student-profile'
  | 'messaging'
  | 'how-students'
  | 'how-employers'
  | 'applications'
  | 'settings'
  | 'about'
  | 'contact'
  | 'admin-dashboard'
  | 'admin-login';
export type UserRole = 'student' | 'employer' | 'admin' | null;

export type NavigateOptions = { jobId?: number; userId?: number };

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        if (token === 'mock_admin_token_123') {
          setUserRole('admin');
          const p = new URLSearchParams(window.location.search).get('page') as PageType;
          if (p) setCurrentPage(p);
          else setCurrentPage('admin-dashboard');
        } else {
          try {
            const user = await api.get('/users/me');
            const role = user.role as UserRole;
            setUserRole(role);
            
            const p = new URLSearchParams(window.location.search).get('page') as PageType;
            if (p) setCurrentPage(p);
            else if (role === 'admin') setCurrentPage('admin-dashboard');
          } catch (error: any) {
            if (error.message && (error.message.includes('User not found') || error.message.includes('Invalid') || error.message.includes('Unauthorized'))) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      }
      setIsAuthLoading(false);
    };
    initAuth();

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.options?.jobId) setSelectedJobId(event.state.options.jobId);
        if (event.state.options?.userId) setSelectedUserId(event.state.options.userId);
      } else {
        const p = new URLSearchParams(window.location.search).get('page') as PageType;
        setCurrentPage(p || 'home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: PageType, options?: NavigateOptions) => {
    if (options?.jobId) setSelectedJobId(options.jobId);
    if (options?.userId) setSelectedUserId(options.userId);
    setCurrentPage(page);
    window.history.pushState({ page, options }, '', `?page=${page}`);
    window.scrollTo(0, 0);
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') navigate('student-dashboard');
    else if (role === 'employer') navigate('home');
    else if (role === 'admin') navigate('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(null);
    navigate('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'student-dashboard':
        if (userRole !== 'student') return <AuthPage onLogin={handleLogin} onNavigate={navigate} />;
        return <StudentDashboard onNavigate={navigate} onLogout={handleLogout} />;
      case 'employer-dashboard':
        if (userRole !== 'employer') return <AuthPage onLogin={handleLogin} onNavigate={navigate} />;
        return <EmployerDashboard onNavigate={navigate} onLogout={handleLogout} />;
      case 'job-details':
        return <JobDetailsPage jobId={selectedJobId || 1} onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'student-profile':
        return <StudentProfilePage userId={selectedUserId || 1} onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'messaging':
        return <MessagingPage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'how-students':
        return <HowItWorksStudents onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'how-employers':
        return <HowItWorksEmployers onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'applications':
        return <ApplicationsPage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'settings':
        return <ProfileSettingsPage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'about':
        return <AboutPage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'contact':
        return <ContactPage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
      case 'admin-login':
        return <AdminLoginPage onLogin={handleLogin} onNavigate={navigate} />;
      case 'admin-dashboard':
        if (userRole !== 'admin') return <AdminLoginPage onLogin={handleLogin} onNavigate={navigate} />;
        return <AdminDashboard onLogout={handleLogout} onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} userRole={userRole} onLogout={handleLogout} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9940A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        <Toaster position="top-right" expand={false} richColors />
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}

export default App;
