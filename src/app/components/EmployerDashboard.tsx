import { useState, useEffect } from 'react';
import type { NavigateOptions, PageType } from '../App';
import { api } from '../api/client';
import { motion } from 'framer-motion';
import { PaymentModal } from './PaymentModal';
import { toast } from 'sonner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { LayoutDashboard, PlusCircle, Users, Briefcase, DollarSign, Building2, MessageSquare, ClipboardList } from 'lucide-react';
import { Skeleton, SkeletonList } from './ui/skeleton';
import { EmptyState } from './ui/EmptyState';

interface EmployerDashboardProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  onLogout: () => void;
}

export function EmployerDashboard({ onNavigate, onLogout }: EmployerDashboardProps) {
  const [activeSidebar, setActiveSidebar] = useState('dashboard');

  const [user, setUser] = useState<any>(null);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('Part-time');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReq, setJobReq] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, appsRes, jobsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/applications'),
        api.get('/jobs')
      ]);

      setUser(userRes);
      setRecentApplications(appsRes);
      // Filter jobs belonging to this employer
      const myJobs = jobsRes.filter((j: any) => j.employerId === userRes.id);
      setActiveJobs(myJobs);
    } catch (error) {
      console.error('Error fetching employer data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await api.get('/payments');
      setPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch payments', e);
      setPayments([]);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/jobs', {
        title: jobTitle,
        type: jobType,
        location: jobLocation,
        salary: jobSalary,
        description: jobDesc,
        requirements: jobReq,
        company: user?.companyName || 'Unknown Company',
        responsibilities: jobDesc // simplified
      });
      toast.success('Job posted successfully!');
      setJobTitle(''); setJobLocation(''); setJobSalary(''); setJobDesc(''); setJobReq('');
      setActiveSidebar('active-jobs');
      fetchData(); // refresh data
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      const appsRes = await api.get('/applications');
      setRecentApplications(appsRes);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const stats = [
    { label: 'Total Jobs', value: activeJobs.length.toString(), icon: Briefcase, color: 'bg-indigo-600' },
    { label: 'Total Applicants', value: recentApplications.length.toString(), icon: Users, color: 'bg-[#111111]' },
    { label: 'New Messages', value: '3', icon: MessageSquare, color: 'bg-violet-600' },
    { label: 'Total Spent', value: `${(payments.reduce((acc, p) => acc + (p.amount || 0), 0)).toLocaleString()} TND`, icon: DollarSign, color: 'bg-indigo-600' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post Job', icon: PlusCircle },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'active-jobs', label: 'Active Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'company', label: 'Company Profile', icon: Building2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] transition-colors duration-300">
        <Navbar onNavigate={onNavigate} userRole="employer" onLogout={onLogout} activePage="dashboard" />
        <div className="flex">
          <aside className="hidden lg:block w-64 bg-[#111111] min-h-screen sticky top-16" />
          <main className="flex-1 p-4 lg:p-10 bg-[#FFFFFF] space-y-10">
            <div>
              <Skeleton className="h-10 w-80 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                  <Skeleton className="h-14 w-14 rounded-2xl mb-4" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-md p-8 border border-transparent dark:border-white/5">
              <div className="flex justify-between mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
              <SkeletonList count={5} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const userInitials = user?.companyName
    ? user.companyName.substring(0, 2).toUpperCase()
    : user?.name?.substring(0, 2).toUpperCase() || 'EM';

  return (
    <div className="min-h-screen bg-[#FFFFFF] transition-colors duration-300">
      <Navbar onNavigate={onNavigate} userRole="employer" onLogout={onLogout} activePage="dashboard" />


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
                  <div className="text-white font-semibold">{user?.companyName || user?.name}</div>
                  <div className="text-[#777777] dark:text-gray-400 text-sm">Employer</div>
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
                      if (item.id === 'payments') fetchPayments();
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
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Welcome back, {user?.companyName || user?.name}!</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Here's an overview of your hiring activity</p>
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
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 p-8 mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight">Recent Applications</h2>
                  <button
                    onClick={() => onNavigate('applications')}
                    className="text-[#C9940A] hover:text-[#A67800] text-sm font-bold uppercase tracking-wide"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentApplications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:shadow-lg transition-all border border-transparent dark:border-white/5 hover:border-[#C9940A]/20">
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center rounded-xl font-bold text-lg">
                          {app.student?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-[#111111] dark:text-white">{app.student?.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400 font-inter text-sm">{app.student?.university}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right hidden md:block">
                          <p className="font-bold text-[#111111] dark:text-white text-sm">{app.job?.title}</p>
                          <p className="text-gray-500 dark:text-gray-400 font-inter text-xs">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                        {app.status === 'pending' && (
                          <span className="bg-[#C9940A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            Pending
                          </span>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'accepted')}
                            className="bg-[#C9940A] text-white px-4 py-2 rounded-lg hover:bg-[#A67800] transition-all text-sm font-semibold shadow-sm"
                            disabled={app.status !== 'pending'}
                          >
                            {app.status === 'accepted' ? 'Accepted' : 'Accept'}
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="bg-gray-100 text-[#111111] px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-sm font-semibold"
                            disabled={app.status !== 'pending'}
                          >
                            {app.status === 'rejected' ? 'Rejected' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentApplications.length === 0 && (
                    <p className="text-gray-400 font-inter text-center py-6">No applications received yet.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeSidebar === 'post-job' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Post a New Job</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Create a job listing to attract talented students</p>
              </div>

              <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 p-8 md:p-10 max-w-3xl">
                <form className="space-y-6" onSubmit={handlePostJob}>
                  <div>
                    <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                      placeholder="e.g. Social Media Manager"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      required
                    />
                  </div>

                   <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Job Type</label>
                      <select
                        value={jobType}
                        onChange={e => setJobType(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                      >
                        <option className="dark:bg-[#111111]">Part-time</option>
                        <option className="dark:bg-[#111111]">Freelance</option>
                        <option className="dark:bg-[#111111]">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Location</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                        placeholder="e.g. Tunis or Remote"
                        value={jobLocation}
                        onChange={e => setJobLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                   <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Salary Type</label>
                      <select className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white">
                        <option className="dark:bg-[#111111]">Hourly</option>
                        <option className="dark:bg-[#111111]">Monthly</option>
                        <option className="dark:bg-[#111111]">Project-based</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Salary Amount</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                        placeholder="e.g. 800 TND"
                        value={jobSalary}
                        onChange={e => setJobSalary(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                   <div>
                    <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Job Description</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                      placeholder="Describe the job responsibilities and requirements..."
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Required Skills</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                      placeholder="e.g. Social Media, Content Creation, Canva"
                      value={jobReq}
                      onChange={e => setJobReq(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="bg-[#C9940A] text-white px-8 py-3 rounded-xl hover:bg-[#A67800] transition-all font-semibold"
                    >
                      Post Job
                    </button>
                    <button
                      type="button"
                      className="bg-[#E5E5E5] text-[#111111] px-8 py-3 rounded-xl hover:bg-[#D5D5D5] transition-all font-semibold"
                    >
                      Save as Draft
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeSidebar === 'active-jobs' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Active Jobs</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Manage your current job listings</p>
              </div>

              <div className="space-y-6">
                {activeJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-[#111111] mb-2">{job.title}</h3>
                        <p className="text-gray-500 font-inter text-sm font-medium">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-gray-100 text-[#111111] px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm">
                          Edit
                        </button>
                        <button className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all font-semibold text-sm">
                          Close
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="col-span-2 md:col-span-2">
                        <button
                          onClick={() => onNavigate('job-details', { jobId: job.id })}
                          className="w-full bg-gradient-to-r from-[#111111] to-[#222222] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold shadow-md"
                        >
                          View Job Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeJobs.length === 0 && (
                  <EmptyState 
                    icon={ClipboardList}
                    title="No active jobs"
                    description="You haven't posted any job listings yet. Click 'Post New Job' to start finding talent!"
                    action={{
                      label: "Post New Job",
                      onClick: () => setActiveSidebar('post-job')
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeSidebar === 'payments' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Payments</h1>
                <p className="text-gray-500 dark:text-gray-400 font-inter">Track your spending and payment history</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Payment History</h2>
                    <button
                      onClick={() => fetchPayments()}
                      className="text-[#C9940A] hover:text-[#A67800] text-sm font-bold uppercase tracking-wide"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="space-y-4">
                    {payments.length === 0 ? (
                      <EmptyState 
                        icon={DollarSign}
                        title="No payment history"
                        description="Your payment transactions will appear here once you make your first deposit."
                      />
                    ) : (
                      payments.slice(0, 20).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-xl hover:shadow-md transition-all border border-transparent dark:border-white/5 hover:border-[#C9940A]/20">
                          <div>
                            <div className="font-bold text-[#111111] dark:text-white text-lg mb-1">
                              {p.description || 'Payment'}
                            </div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 font-inter">
                              {new Date(p.createdAt).toLocaleDateString()} • <span className="uppercase text-xs tracking-wide bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded ml-1">{p.status}</span>
                            </div>
                          </div>
                          <div className="font-extrabold text-[#111111] dark:text-white text-xl">
                            {p.amount} {p.currency || 'TND'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 h-fit">
                  <h2 className="text-2xl font-bold text-[#111111] mb-2 tracking-tight">Add Funds</h2>
                  <p className="text-gray-500 font-inter text-sm mb-8 leading-relaxed">Securely simulate a payment to add credits to your account.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-gradient-to-r from-[#C9940A] to-[#A67800] text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all font-bold shadow-md flex items-center justify-center space-x-2"
                  >
                    <DollarSign size={20} />
                    <span>Make a Payment</span>
                  </motion.button>
                </div>
              </div>

              <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={async (amount, description) => {
                  try {
                    await api.post('/payments', { 
                      amount, 
                      currency: 'TND', 
                      description: description || 'Account top-up', 
                      status: 'paid' 
                    });
                    await fetchPayments();
                    toast.success('Payment processed successfully');
                  } catch (e: any) {
                    console.error('Failed to create payment:', e);
                    toast.error(e?.message || 'Failed to process payment');
                  }
                }}
              />
            </motion.div>
          )}

          {activeSidebar === 'company' && (
            <CompanyProfileSection
              user={user}
              onSaved={() => fetchData()}
            />
          )}
        </main>
      </div>

      <MobileNav activeSidebar={activeSidebar} onNavigate={(id) => {
        setActiveSidebar(id);
        if (id === 'messages') onNavigate('messaging');
        if (id === 'applications') onNavigate('applications');
        if (id === 'payments') fetchPayments();
      }} userRole="employer" />

      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}

function CompanyProfileSection({ user, onSaved }: { user: any; onSaved: () => void }) {
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [description, setDescription] = useState(user?.companyDescription || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompanyName(user?.companyName || '');
    setWebsite(user?.website || '');
    setDescription(user?.companyDescription || '');
  }, [user?.companyName, user?.website, user?.companyDescription]);

  const save = async () => {
    try {
      setSaving(true);
      await api.put('/users/me', {
        companyName,
        website,
        companyDescription: description,
      });
      toast.success('Company profile saved!');
      onSaved();
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save company profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#111111] dark:text-white mb-2 tracking-tight">Company Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 font-inter">Keep your company info up to date to attract better candidates</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 p-8 lg:col-span-2">
          <div className="space-y-5">
            <div>
              <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Company Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                placeholder="e.g. TechStart Tunisia"
              />
            </div>

            <div>
              <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Website</label>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                placeholder="e.g. https://example.com"
              />
            </div>

            <div>
              <label className="block text-[#111111] dark:text-white mb-2 font-semibold">Description</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-[#E5E5E5] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                placeholder="Tell students what you do, your mission, and what it's like to work with you."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className={`bg-[#C9940A] text-white px-6 py-3 rounded-xl hover:bg-[#A67800] transition-all font-semibold ${saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setCompanyName(user?.companyName || '');
                  setWebsite(user?.website || '');
                  setDescription(user?.companyDescription || '');
                }}
                className="bg-gray-100 dark:bg-white/10 text-[#111111] dark:text-white px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 p-8 h-fit">
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6 tracking-tight">Preview</h2>
          <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl shadow-inner border border-transparent dark:border-white/5 hover:border-[#C9940A]/20 transition-all">
            <div className="text-xl font-extrabold text-[#111111] dark:text-white">{companyName || 'Company name'}</div>
            <div className="text-sm text-[#C9940A] font-bold mt-1 uppercase tracking-wider">{website || 'Website not set'}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-inter mt-6 leading-relaxed whitespace-pre-wrap">
              {description || 'Add a description to help students understand your company.'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
