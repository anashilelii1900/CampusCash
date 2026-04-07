import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Building2, Phone, GraduationCap } from 'lucide-react';
import { api } from '../api/client';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AuthPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
}

export function AuthPage({ onLogin, onNavigate }: AuthPageProps) {
  const [role, setRole] = useState<'student' | 'employer'>('student');
  const [isSignUp, setIsSignUp] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await api.post('/auth/register', {
          name,
          email,
          password,
          role,
          phone,
          university: role === 'student' ? university : undefined,
          companyName: role === 'employer' ? companyName : undefined,
        });

        // Automatically log in after registration
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.name}!`);
        onLogin(data.user.role);
      } else {
        const data = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.name}!`);
        onLogin(data.user.role);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FAF0C4]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-100/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back Button */}
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-6 left-6 flex items-center text-[#6B5B35] hover:text-[#C9940A] transition-colors z-20 group font-inter"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full bg-white rounded-3xl shadow-[0_30px_60px_rgba(99,102,241,0.12)] border border-[#E8E0C8] overflow-hidden mt-12 md:mt-0 relative z-10"
      >
        <div className="grid md:grid-cols-2">
          {/* Left Side - Student */}
          <div
            onClick={() => setRole('student')}
            className={`p-8 md:p-12 cursor-pointer transition-all relative overflow-hidden group ${role === 'student'
                ? 'bg-[#C9940A] text-white shadow-2xl shadow-[#C9941A]/200'
                : 'bg-gray-50 text-[#6B5B35] hover:bg-[#FDF9EC] border-r border-[#E8E0C8]'
              }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'student' ? 'bg-white/20' : 'bg-white'
                }`}>
                <GraduationCap className={role === 'student' ? 'text-white' : 'text-[#C9940A]'} size={24} />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === 'student' ? 'border-white bg-white' : 'border-[#E5E5E5]'
                }`}>
                {role === 'student' && <div className="w-3 h-3 rounded-full bg-[#C9940A]"></div>}
              </div>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${role === 'student' ? 'text-white' : 'text-[#111111]'}`}>
              I'm a Student
            </h3>
            <p className={role === 'student' ? 'text-white/90' : 'text-[#777777]'}>
              Find flexible part-time jobs that fit your academic schedule and earn while you study.
            </p>
          </div>

          {/* Right Side - Employer */}
          <div
            onClick={() => setRole('employer')}
            className={`p-8 md:p-12 cursor-pointer transition-all relative overflow-hidden group ${role === 'employer'
                ? 'bg-[#C9940A] text-white shadow-2xl shadow-[#C9941A]/200'
                : 'bg-gray-50 text-[#6B5B35] hover:bg-slate-50 border-l border-[#E8E0C8]'
              }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role === 'employer' ? 'bg-white/20' : 'bg-white'
                }`}>
                <Building2 className={role === 'employer' ? 'text-white' : 'text-[#C9940A]'} size={24} />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === 'employer' ? 'border-white bg-white' : 'border-[#E5E5E5]'
                }`}>
                {role === 'employer' && <div className="w-3 h-3 rounded-full bg-[#C9940A]"></div>}
              </div>
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${role === 'employer' ? 'text-white' : 'text-[#111111]'}`}>
              I'm an Employer
            </h3>
            <p className={role === 'employer' ? 'text-white/90' : 'text-[#777777]'}>
              Connect with talented students ready to contribute to your business with fresh perspectives.
            </p>
          </div>
        </div>

          {/* Form Section */}
        <div className="p-8 md:p-12 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-[#FFFFFF] pointer-events-none"></div>
          <div className="max-w-md mx-auto relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-[#111111] mb-2 tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-500 font-inter">
                {isSignUp
                  ? `Sign up as a ${role}`
                  : 'Sign in to your account'
                }
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-semibold border border-red-100 shadow-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-[#111111] mb-2 text-sm font-medium">
                    <User size={16} className="inline mr-2 text-gray-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[#111111] mb-2 text-sm font-medium">
                  <Mail size={16} className="inline mr-2 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-[#111111] mb-2 text-sm font-medium">
                    <Phone size={16} className="inline mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter"
                    placeholder="e.g. +216 22 123 456"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#111111] mb-2 text-sm font-medium">
                  <Lock size={16} className="inline mr-2 text-gray-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isSignUp && role === 'student' && (
                <div>
                  <label className="block text-[#111111] mb-2 text-sm font-medium">
                    <GraduationCap size={16} className="inline mr-2 text-gray-400" />
                    University
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter"
                    required
                  >
                    <option value="">Select your university</option>
                    <option value="INSAT">INSAT</option>
                    <option value="ESPRIT">ESPRIT</option>
                    <option value="ISG">ISG Tunis</option>
                    <option value="FST">FST</option>
                    <option value="ENIT">ENIT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {isSignUp && role === 'employer' && (
                <div>
                  <label className="block text-[#111111] mb-2 text-sm font-medium">
                    <Building2 size={16} className="inline mr-2 text-gray-400" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C9940A]/20 focus:border-[#C9940A] transition-all font-inter"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
                  } ${role === 'student'
                    ? 'bg-gradient-to-r from-[#C9940A] to-[#A67800] text-white'
                    : 'bg-gradient-to-r from-[#C9940A] to-[#A67800] text-white'
                  }`}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </motion.button>
            </form>

            <div className="text-center mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-500 hover:text-[#C9940A] transition-colors font-inter"
              >
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <span className="font-bold text-[#111111] border-b-2 border-transparent hover:border-[#C9940A] pb-1 transition-all">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin-login')}
                className="text-gray-400 hover:text-[#C9940A] transition-colors text-xs font-semibold mt-2"
              >
                Admin Access
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
