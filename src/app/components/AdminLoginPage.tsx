import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../api/client';
import { toast } from 'sonner';
import type { PageType, UserRole } from '../App';

interface AdminLoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (page: PageType) => void;
}

export function AdminLoginPage({ onLogin, onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      onLogin('admin');
    } catch {
      if (email === 'admin@campuscash.tn' && password === 'admin123') {
        localStorage.setItem('token', 'mock_admin_token_123');
        localStorage.setItem('user', JSON.stringify({ id: 999, name: 'System Admin', role: 'admin', email }));
        toast.success(`Welcome back, Admin! (Offline Mode)`);
        onLogin('admin');
      } else {
        setError('Server unreachable. Use admin@campuscash.tn / admin123 for offline mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C9941A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#C9941A]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors z-20"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back to Site</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* Logo + title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9941A] to-[#A67800] shadow-lg shadow-[#C9941A]/30 mb-5">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">Admin Portal</h1>
            <p className="text-white/40 text-sm">CampusCash Control Panel</p>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="admin@campuscash.tn"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#C9941A] focus:ring-2 focus:ring-[#C9941A]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-[#C9941A] focus:ring-2 focus:ring-[#C9941A]/20 transition-all tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-[#C9941A] to-[#A67800] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-[#C9941A]/30 hover:shadow-[#C9941A]/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={18} />
                  Sign in as Admin
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/8 text-center">
            <p className="text-white/30 text-xs">
              Not an admin?{' '}
              <button
                onClick={() => onNavigate('auth')}
                className="text-[#C9941A] hover:text-[#DEAD3A] transition-colors font-semibold"
              >
                Student / Employer login
              </button>
            </p>
          </div>
        </div>

        {/* Bottom badge */}
        <div className="text-center mt-6">
          <span className="text-white/20 text-xs">CampusCash © 2026 · Admin Access Only</span>
        </div>
      </motion.div>
    </div>
  );
}
