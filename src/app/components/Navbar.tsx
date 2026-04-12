import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import logoSvg from '../../assets/logo.svg';

interface NavbarProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
  activePage?: string;
}

export function Navbar({ onNavigate, userRole, onLogout, activePage = 'home' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-4 left-0 right-0 w-full flex justify-center z-50 px-4 sm:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`w-full max-w-6xl pointer-events-auto transition-all duration-500 rounded-2xl ${
          scrolled
            ? 'bg-white border border-[#E8E0C8] py-3 shadow-lg shadow-black/8'
            : 'bg-white/90 backdrop-blur-md border border-[#F0E8D0] py-4'
        }`}
      >
        <div className="px-6 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <img
              src={logoSvg}
              alt="CampusCash Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="ml-2 hidden sm:block">
              <div className="text-[#111111] font-extrabold text-xl tracking-tight">
                Campus<span className="text-[#C9941A]">Cash</span>
              </div>
              <div className="text-[#C9941A] text-[9px] tracking-[0.2em] uppercase font-semibold">work.connect.thrive</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!userRole && (
              <>
                <NavButton label="Home" isActive={activePage === 'home'} onClick={() => handleNavClick('home')} />
                <NavButton label="For Students" isActive={activePage === 'how-students'} onClick={() => handleNavClick('how-students')} />
                <NavButton label="For Employers" isActive={activePage === 'how-employers'} onClick={() => handleNavClick('how-employers')} />
              </>
            )}
            {userRole && (
              <>
                <NavButton label="Dashboard" isActive={activePage === 'student-dashboard' || activePage === 'employer-dashboard'} onClick={() => handleNavClick(userRole === 'student' ? 'student-dashboard' : 'employer-dashboard')} />
                <NavButton label="Applications" isActive={activePage === 'applications'} onClick={() => handleNavClick('applications')} />
                <NavButton label="Messages" isActive={activePage === 'messaging'} onClick={() => handleNavClick('messaging')} />
                <NavButton label="Settings" isActive={activePage === 'settings'} onClick={() => handleNavClick('settings')} />
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {!userRole ? (
              <>
                <button
                  onClick={() => handleNavClick('auth')}
                  className="text-[#6B5B35] hover:text-[#C9941A] transition-colors px-4 py-2 font-medium rounded-xl hover:bg-[#FDF9EC]"
                >
                  Sign In
                </button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleNavClick('auth')}
                  className="bg-[#111111] text-white px-6 py-2.5 rounded-xl transition-all shadow-md hover:bg-[#C9941A] font-semibold"
                >
                  Get Started
                </motion.button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="text-[#6B5B35] hover:text-red-600 transition-colors px-5 py-2 border border-[#E8E0C8] rounded-xl hover:border-red-200 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#111111] hover:text-[#C9941A] p-2 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-[#F0E8D0] mt-2"
            >
              <div className="px-6 pt-4 pb-6 space-y-2 bg-white rounded-b-2xl">
                {!userRole ? (
                  <>
                    <MobileNavButton label="Home" isActive={activePage === 'home'} onClick={() => handleNavClick('home')} />
                    <MobileNavButton label="For Students" isActive={activePage === 'how-students'} onClick={() => handleNavClick('how-students')} />
                    <MobileNavButton label="For Employers" isActive={activePage === 'how-employers'} onClick={() => handleNavClick('how-employers')} />
                    <MobileNavButton label="Sign In" isActive={activePage === 'auth'} onClick={() => handleNavClick('auth')} />
                    <button
                      onClick={() => handleNavClick('auth')}
                      className="block w-full text-center bg-[#111111] text-white px-6 py-3.5 rounded-xl hover:bg-[#C9941A] transition-all font-semibold mt-4"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavButton label="Dashboard" isActive={activePage === 'student-dashboard' || activePage === 'employer-dashboard'} onClick={() => handleNavClick(userRole === 'student' ? 'student-dashboard' : 'employer-dashboard')} />
                    <MobileNavButton label="Applications" isActive={activePage === 'applications'} onClick={() => handleNavClick('applications')} />
                    <MobileNavButton label="Messages" isActive={activePage === 'messaging'} onClick={() => handleNavClick('messaging')} />
                    <MobileNavButton label="Settings" isActive={activePage === 'settings'} onClick={() => handleNavClick('settings')} />
                    <button
                      onClick={onLogout}
                      className="block w-full text-center text-red-600 py-3 border border-red-200 bg-red-50 rounded-xl mt-4 hover:opacity-90 transition-all font-medium"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

function NavButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 font-semibold transition-all duration-200 rounded-xl text-sm ${
        isActive
          ? 'text-[#C9941A] bg-[#FDF9EC]'
          : 'text-[#6B5B35] hover:text-[#C9941A] hover:bg-[#FDF9EC]'
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#C9941A] rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

function MobileNavButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
        isActive
          ? 'bg-[#FDF9EC] text-[#C9941A]'
          : 'text-[#6B5B35] hover:bg-[#FDF9EC] hover:text-[#C9941A]'
      }`}
    >
      {label}
    </button>
  );
}
