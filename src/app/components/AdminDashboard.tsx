import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, MessageSquare, Trash2, LogOut, BarChart3, ChevronRight, TrendingUp, Shield } from 'lucide-react';
import { API_URL } from '../api/client';
import { toast } from 'sonner';
import type { PageType } from '../App';
import logoSvg from '../../assets/logo.svg';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (page: PageType) => void;
}

type Tab = 'overview' | 'users' | 'jobs' | 'applications';

function adminFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...(options.headers || {})
    }
  }).then(r => r.json());
}

export function AdminDashboard({ onLogout, onNavigate }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    if (tab === 'users' && users.length === 0) loadUsers();
    if (tab === 'jobs' && jobs.length === 0) loadJobs();
    if (tab === 'applications' && applications.length === 0) loadApplications();
  }, [tab]);

  async function loadStats() {
    setLoading(true);
    try {
      const data = await adminFetch('/stats');
      if (data.error) throw new Error(data.error);
      setStats(data);
    } catch (e) {
      console.warn("Backend unavailable, using mock stats");
      setStats({
        totalUsers: 156,
        totalStudents: 120,
        totalEmployers: 36,
        totalJobs: 42,
        totalApplications: 315,
        totalMessages: 890,
        recentUsers: [
          { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'student', createdAt: new Date().toISOString() },
          { id: 2, name: 'Google Inc.', email: 'hr@google.com', role: 'employer', createdAt: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() { 
    try { 
      const data = await adminFetch('/users'); 
      if (data.error) throw new Error();
      setUsers(data);
    } catch { 
      setUsers([
        { id: 1, name: 'Alice Smith', email: 'alice@student.edu', role: 'student', university: 'MIT', createdAt: new Date().toISOString() },
        { id: 2, name: 'Google', email: 'hello@google.com', role: 'employer', companyName: 'Google', createdAt: new Date().toISOString() }
      ]); 
    } 
  }

  async function loadJobs() { 
    try { 
      const data = await adminFetch('/jobs'); 
      if (data.error) throw new Error();
      setJobs(data);
    } catch { 
      setJobs([
        { id: 1, title: 'Software Engineer', company: 'Google', location: 'Remote', type: 'Full-time', _count: { applications: 12 }, createdAt: new Date().toISOString() },
        { id: 2, title: 'UX Designer', company: 'Apple', location: 'Cupertino', type: 'Internship', _count: { applications: 5 }, createdAt: new Date().toISOString() }
      ]); 
    } 
  }

  async function loadApplications() { 
    try { 
      const data = await adminFetch('/applications'); 
      if (data.error) throw new Error();
      setApplications(data);
    } catch { 
      setApplications([
        { id: 1, student: { name: 'Alice Smith', email: 'alice@student.edu' }, job: { title: 'Software Engineer', company: 'Google' }, status: 'pending', createdAt: new Date().toISOString() }
      ]); 
    } 
  }

  async function deleteUser(id: number, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await adminFetch(`/users/${id}`, { method: 'DELETE' });
    if (res.message) { toast.success('User deleted'); setUsers(prev => prev.filter(u => u.id !== id)); }
    else toast.error(res.error || 'Failed to delete');
  }

  async function deleteJob(id: number, title: string) {
    if (!confirm(`Delete job "${title}"?`)) return;
    const res = await adminFetch(`/jobs/${id}`, { method: 'DELETE' });
    if (res.message) { toast.success('Job deleted'); setJobs(prev => prev.filter(j => j.id !== id)); }
    else toast.error(res.error || 'Failed to delete');
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-[#C9941A]', sub: `${stats.totalStudents} students · ${stats.totalEmployers} employers` },
    { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase, color: 'bg-[#111111]', sub: 'Active listings' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'bg-[#C9941A]', sub: 'All time' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'bg-[#111111]', sub: 'Sent via platform' },
  ] : [];

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] min-h-screen flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logoSvg} alt="CampusCash" className="h-10 w-10 object-contain" />
            <div>
              <div className="text-white font-extrabold text-lg">Campus<span className="text-[#C9941A]">Cash</span></div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield size={10} className="text-[#C9941A]" />
                <span className="text-[#C9941A] text-[9px] tracking-widest uppercase font-semibold">Admin Panel</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                tab === item.id
                  ? 'bg-[#C9941A] text-white shadow-lg shadow-[#C9941A]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {tab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-sm"
          >
            ← Back to Site
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-red-500/20 transition-all text-sm font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#111111]">
            {navItems.find(n => n.id === tab)?.label}
          </h1>
          <p className="text-[#6B5B35] text-sm mt-1">CampusCash Admin Control Panel</p>
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-[#C9941A] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                  {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E0C8] shadow-sm hover:shadow-md transition-all">
                      <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                        <card.icon size={22} className="text-white" />
                      </div>
                      <div className="text-3xl font-extrabold text-[#111111] mb-1">{card.value}</div>
                      <div className="text-sm font-semibold text-[#111111]">{card.label}</div>
                      <div className="text-xs text-[#6B5B35] mt-1">{card.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Recent users */}
                <div className="bg-white rounded-2xl border border-[#E8E0C8] shadow-sm">
                  <div className="px-6 py-4 border-b border-[#E8E0C8] flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#C9941A]" />
                    <h2 className="font-bold text-[#111111]">Recently Joined Users</h2>
                  </div>
                  <div className="divide-y divide-[#F0E8D0]">
                    {stats?.recentUsers?.map((u: any) => (
                      <div key={u.id} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#FDF9EC] border border-[#E8E0C8] flex items-center justify-center text-[#C9941A] font-bold text-sm">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#111111]">{u.name}</div>
                            <div className="text-xs text-[#6B5B35]">{u.email}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          u.role === 'student' ? 'bg-[#FDF9EC] text-[#C9941A]' :
                          u.role === 'employer' ? 'bg-[#111111] text-white' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#E8E0C8] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E0C8]">
              <span className="text-sm text-[#6B5B35]">{users.length} total users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA] text-left">
                  <tr>
                    {['Name', 'Email', 'Role', 'University / Company', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-[#6B5B35] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8D0]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[#FDF9EC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#FDF9EC] border border-[#E8E0C8] flex items-center justify-center text-[#C9941A] font-bold text-xs">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-[#111111]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B5B35]">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.role === 'student' ? 'bg-[#FDF9EC] text-[#C9941A]' :
                          u.role === 'employer' ? 'bg-[#111111] text-white' :
                          'bg-red-100 text-red-700'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6B5B35]">{u.university || u.companyName || '–'}</td>
                      <td className="px-6 py-4 text-xs text-[#6B5B35]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => deleteUser(u.id, u.name)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Jobs ── */}
        {tab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-[#E8E0C8] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E0C8]">
              <span className="text-sm text-[#6B5B35]">{jobs.length} total jobs</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA] text-left">
                  <tr>
                    {['Title', 'Company', 'Location', 'Type', 'Applications', 'Posted', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-[#6B5B35] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8D0]">
                  {jobs.map(j => (
                    <tr key={j.id} className="hover:bg-[#FDF9EC] transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-[#111111]">{j.title}</td>
                      <td className="px-6 py-4 text-sm text-[#6B5B35]">{j.company}</td>
                      <td className="px-6 py-4 text-sm text-[#6B5B35]">{j.location}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-[#FDF9EC] text-[#C9941A] px-2.5 py-1 rounded-full font-semibold">{j.type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-bold text-[#C9941A]">{j._count?.applications ?? 0}</td>
                      <td className="px-6 py-4 text-xs text-[#6B5B35]">{new Date(j.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteJob(j.id, j.title)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Applications ── */}
        {tab === 'applications' && (
          <div className="bg-white rounded-2xl border border-[#E8E0C8] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E0C8]">
              <span className="text-sm text-[#6B5B35]">{applications.length} total applications</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA] text-left">
                  <tr>
                    {['Student', 'Job', 'Company', 'Status', 'Applied'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-[#6B5B35] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8D0]">
                  {applications.map(a => (
                    <tr key={a.id} className="hover:bg-[#FDF9EC] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-[#111111]">{a.student?.name}</div>
                        <div className="text-xs text-[#6B5B35]">{a.student?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#111111] font-medium">{a.job?.title}</td>
                      <td className="px-6 py-4 text-sm text-[#6B5B35]">{a.job?.company}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          a.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          a.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          a.status === 'interview' ? 'bg-blue-100 text-blue-700' :
                          'bg-[#FDF9EC] text-[#C9941A]'
                        }`}>{a.status}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6B5B35]">{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
