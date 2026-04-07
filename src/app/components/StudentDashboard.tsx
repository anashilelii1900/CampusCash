import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { LayoutDashboard, Briefcase, FileText, MessageSquare, DollarSign, Settings, Search, MapPin, Clock, TrendingUp, Calendar, CheckCircle, XCircle, AlertCircle, Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { NavigateOptions, PageType } from '../App';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/client';
import { Skeleton, SkeletonList } from './ui/skeleton';
import { EmptyState } from './ui/EmptyState';

interface StudentDashboardProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  onLogout: () => void;
}

export function StudentDashboard({ onNavigate, onLogout }: StudentDashboardProps) {
  const [activeSidebar, setActiveSidebar] = useState('dashboard');

  const [user, setUser] = useState<any>(null);
  const [browseJobs, setBrowseJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, jobsRes, appsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/jobs'),
          api.get('/applications')
        ]);

        setUser(userRes);
        setBrowseJobs(jobsRes);
        setRecentApplications(appsRes);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate derived stats
  const activeJobsCount = recentApplications.filter(a => a.status === 'accepted').length;
  const applicationsSent = recentApplications.length;

  let totalEarnings = 0;
  const earningsMap: Record<string, number> = {};
  const upcomingWork: any[] = [];

  recentApplications.forEach(app => {
    if (app.status === 'accepted') {
      const amountMatch = app.job?.salary?.match(/\d+/);
      const amount = amountMatch ? parseInt(amountMatch[0], 10) : 0;
      totalEarnings += amount;

      const date = new Date(app.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      earningsMap[month] = (earningsMap[month] || 0) + amount;

      upcomingWork.push({
        id: app.id,
        title: app.job?.title,
        company: app.job?.employer?.companyName || app.job?.company,
        date: date.toLocaleDateString(),
        time: 'TBD',
      });
    }
  });

  const earningsData = Object.keys(earningsMap).length > 0 
    ? Object.keys(earningsMap).map(month => ({ month, amount: earningsMap[month] }))
    : [{ month: 'This Month', amount: 0 }];

  const stats = [
    { label: 'Active Jobs', value: activeJobsCount.toString(), icon: Briefcase, color: 'bg-indigo-600' },
    { label: 'Applications Sent', value: applicationsSent.toString(), icon: FileText, color: 'bg-[#111111]' },
    { label: 'Earnings This Month', value: `${totalEarnings.toLocaleString()} TND`, icon: DollarSign, color: 'bg-violet-600' },
    { label: 'Profile Completion', value: user?.university ? '100%' : '85%', icon: TrendingUp, color: 'bg-indigo-600' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="flex items-center text-green-600 text-sm"><CheckCircle size={16} className="mr-1" /> Accepted</span>;
      case 'rejected':
        return <span className="flex items-center text-red-600 text-sm"><XCircle size={16} className="mr-1" /> Rejected</span>;
      case 'pending':
        return <span className="flex items-center text-[#C9940A] text-sm"><AlertCircle size={16} className="mr-1" /> Pending</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] transition-colors duration-300">
        <Navbar onNavigate={onNavigate} userRole="student" onLogout={onLogout} activePage="dashboard" />
        <div className="flex">
          <aside className="hidden lg:block w-64 bg-[#111111] min-h-screen sticky top-16" />
          <main className="flex-1 p-4 lg:p-10 bg-[#FFFFFF] space-y-10">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                  <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-xl shadow-md p-8 border border-transparent dark:border-white/5">
              <Skeleton className="h-8 w-48 mb-6" />
              <SkeletonList count={5} />
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-md p-8 border border-transparent dark:border-white/5">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-48 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const userInitials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';

  return (
    <div className="min-h-screen bg-[#FFFFFF] transition-colors duration-300">
      <Navbar onNavigate={onNavigate} userRole="student" onLogout={onLogout} activePage="dashboard" />


      <div className="flex pt-24 relative z-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-[#111111] min-h-screen sticky top-16">
          <div className="p-6">
            <div className="mb-8 pb-6 border-b border-[#1A1A1A]">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#C9940A] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {userInitials}
                </div>
                <div className="ml-3">
                  <div className="text-white font-semibold">{user?.name || 'Student'}</div>
                  <div className="text-[#777777] dark:text-gray-400 text-sm">{user?.university || 'Student'}</div>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSidebar === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSidebar(item.id);
                      if (item.id === 'messages') onNavigate('messaging');
                      if (item.id === 'applications') onNavigate('applications');
                      if (item.id === 'settings') onNavigate('settings');
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${isActive
                        ? 'bg-[#C9940A] text-white'
                        : 'text-[#777777] hover:bg-[#1A1A1A] hover:text-white'
                      }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-10 bg-[#FFFFFF]">
          {activeSidebar === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Here's what's happening with your account today.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                      key={index} 
                      className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                          <Icon className="text-white" size={26} />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-[#111111] dark:text-white mb-1">{stat.value}</div>
                      <div className="text-gray-500 dark:text-gray-400 font-inter text-sm uppercase tracking-wide font-medium">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Recent Applications */}
              <div className="bg-white dark:bg-[#111111] rounded-xl shadow-md p-6 mb-8 border border-transparent dark:border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#111111] dark:text-white">Recent Applications</h2>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="text-[#C9940A] hover:text-[#A67800] text-sm font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E5E5E5]">
                        <th className="text-left py-3 px-4 text-[#777777] text-sm font-semibold">Job Title</th>
                        <th className="text-left py-3 px-4 text-[#777777] text-sm font-semibold">Company</th>
                        <th className="text-left py-3 px-4 text-[#777777] text-sm font-semibold">Salary</th>
                        <th className="text-left py-3 px-4 text-[#777777] text-sm font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-[#777777] text-sm font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.slice(0, 5).map((app) => (
                        <tr key={app.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-semibold text-[#111111] dark:text-white">{app.job?.title}</td>
                          <td className="py-4 px-4 text-[#777777] dark:text-gray-400">{app.job?.employer?.companyName}</td>
                          <td className="py-4 px-4 text-[#777777] dark:text-gray-400">{app.job?.salary}</td>
                          <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-4 px-4 text-[#777777] dark:text-gray-400 text-sm">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {recentApplications.length === 0 && (
                    <EmptyState 
                      icon={Inbox}
                      title="No applications yet"
                      description="You haven't applied to any jobs yet. Browse available opportunities and kickstart your career!"
                      action={{
                        label: "Browse Jobs",
                        onClick: () => setActiveSidebar('browse')
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Upcoming Work Schedule */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 p-8"
              >
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6 tracking-tight">Upcoming Work Schedule</h2>
                <div className="space-y-4">
                  {upcomingWork.length > 0 ? (
                    upcomingWork.map((work) => (
                      <div key={work.id} className="flex items-start p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/5">
                        <div className="w-12 h-12 bg-[#C9940A] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="text-white" size={24} />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-[#111111] dark:text-white">{work.title}</h3>
                          <p className="text-[#777777] dark:text-gray-400 text-sm">{work.company}</p>
                          <div className="flex items-center mt-2 text-sm text-[#777777] dark:text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {work.date}
                            <Clock size={14} className="ml-4 mr-1" />
                            {work.time}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#777777] dark:text-gray-500 text-sm text-center py-4">No upcoming work scheduled.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeSidebar === 'browse' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Browse Jobs</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Find your next opportunity</p>
              </div>

              {/* Search Bar */}
              <div className="bg-white dark:bg-[#111111] rounded-xl shadow-md p-4 mb-8 border border-transparent dark:border-white/5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                    />
                  </div>
                  <button className="bg-[#C9940A] text-white px-6 py-3 rounded-lg hover:bg-[#A67800] transition-all font-bold">
                    Search
                  </button>
                </div>
              </div>

              {/* Job Listings */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {browseJobs.map((job) => (
                  <div key={job.id} className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-transparent dark:border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-[#111111] dark:text-white">{job.title}</h3>
                      <span className="bg-[#C9940A]/10 text-[#C9940A] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{job.employer?.companyName || job.company}</p>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MapPin size={16} className="mr-1" />
                        {job.location}
                      </div>
                      <div className="font-bold text-[#C9940A]">{job.salary}</div>
                    </div>
                    <button
                      onClick={() => onNavigate('job-details', { jobId: job.id })}
                      className="w-full bg-[#C9940A] text-white py-3 rounded-lg hover:bg-[#A67800] transition-all font-bold shadow-lg shadow-[#C9940A]/20"
                    >
                      View Details
                    </button>
                  </div>
                ))}
                {browseJobs.length === 0 && (
                  <div className="col-span-full">
                    <EmptyState 
                      title="No jobs found"
                      description="We couldn't find any jobs matching your search criteria. Try a different keyword or location."
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSidebar === 'earnings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Earnings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Track your income and payment history</p>
              </div>

              {/* Earnings Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-[#111111] mb-6">Monthly Earnings</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis dataKey="month" stroke="#777777" />
                    <YAxis stroke="#777777" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111111', border: 'none', borderRadius: '8px', color: '#fff' }}
                      cursor={{ fill: '#F5F3EF' }}
                    />
                    <Bar dataKey="amount" fill="#C9940A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5">
                  <div className="text-gray-500 dark:text-gray-400 font-inter text-sm uppercase tracking-wide font-medium mb-2">Total Earned</div>
                  <div className="text-4xl font-extrabold text-[#111111] dark:text-white">{totalEarnings.toLocaleString()} TND</div>
                  <div className="text-green-600 font-medium text-sm mt-3">Based on accepted applications</div>
                </div>
                <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5">
                  <div className="text-gray-500 dark:text-gray-400 font-inter text-sm uppercase tracking-wide font-medium mb-2">Number of Jobs Won</div>
                  <div className="text-4xl font-extrabold text-[#111111] dark:text-white">{activeJobsCount}</div>
                  <div className="text-[#C9940A] font-medium text-sm mt-3">Currently Active</div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      <MobileNav activeSidebar={activeSidebar} onNavigate={(id) => {
        setActiveSidebar(id);
        if (id === 'messages') onNavigate('messaging');
        if (id === 'applications') onNavigate('applications');
        if (id === 'settings') onNavigate('settings');
      }} userRole="student" />

      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}
