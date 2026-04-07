import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Clock, CheckCircle, XCircle, Eye, MessageSquare, Calendar, MapPin, DollarSign, Briefcase, Inbox } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { api } from '../api/client';
import { toast } from 'sonner';
import { Skeleton, SkeletonList } from './ui/skeleton';
import { EmptyState } from './ui/EmptyState';

interface ApplicationsPageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function ApplicationsPage({ onNavigate, userRole, onLogout }: ApplicationsPageProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [userRole]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await api.get('/applications');
      setApplications(data);
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/applications/${id}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications(); // Refresh list after change
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-500',
      accepted: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-500',
      rejected: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-500',
      interview: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-500'
    };

    const icons = {
      pending: <Clock size={16} />,
      accepted: <CheckCircle size={16} />,
      rejected: <XCircle size={16} />,
      interview: <MessageSquare size={16} />
    };

    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      interview: 'Interview'
    };

    const finalStatus = (status || 'pending').toLowerCase();

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${styles[finalStatus as keyof typeof styles] || styles.pending}`}>
        {icons[finalStatus as keyof typeof icons] || icons.pending}
        {labels[finalStatus as keyof typeof labels] || labels.pending}
      </span>
    );
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => app.status === 'interview').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="applications" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-transparent dark:border-white/5"><SkeletonList count={1} /></div>)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0A] transition-colors duration-300">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="applications" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111111] dark:text-white mb-2">
            {userRole === 'student' ? 'My Applications' : 'Job Applications'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {userRole === 'student'
              ? 'Track all your job applications in one place'
              : 'Manage applications from interested students'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setFilterStatus('all')}
            className={`p-4 rounded-2xl transition-all ${filterStatus === 'all'
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-lg'
                : 'bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:shadow-md border border-transparent dark:border-white/5'
              }`}
          >
            <div className="text-2xl font-bold mb-1">{statusCounts.all}</div>
            <div className={`text-sm ${filterStatus === 'all' ? 'text-gray-300 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
              Total
            </div>
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`p-4 rounded-2xl transition-all ${filterStatus === 'pending'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:shadow-md border border-transparent dark:border-white/5'
              }`}
          >
            <div className="text-2xl font-bold mb-1">{statusCounts.pending}</div>
            <div className={`text-sm ${filterStatus === 'pending' ? 'text-yellow-100' : 'text-gray-600 dark:text-gray-400'}`}>
              Pending
            </div>
          </button>
          <button
            onClick={() => setFilterStatus('interview')}
            className={`p-4 rounded-2xl transition-all ${filterStatus === 'interview'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:shadow-md border border-transparent dark:border-white/5'
              }`}
          >
            <div className="text-2xl font-bold mb-1">{statusCounts.interview}</div>
            <div className={`text-sm ${filterStatus === 'interview' ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
              Interview
            </div>
          </button>
          <button
            onClick={() => setFilterStatus('accepted')}
            className={`p-4 rounded-2xl transition-all ${filterStatus === 'accepted'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:shadow-md border border-transparent dark:border-white/5'
              }`}
          >
            <div className="text-2xl font-bold mb-1">{statusCounts.accepted}</div>
            <div className={`text-sm ${filterStatus === 'accepted' ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
              Accepted
            </div>
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`p-4 rounded-2xl transition-all ${filterStatus === 'rejected'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white dark:bg-[#111111] text-[#111111] dark:text-white hover:shadow-md border border-transparent dark:border-white/5'
              }`}
          >
            <div className="text-2xl font-bold mb-1">{statusCounts.rejected}</div>
            <div className={`text-sm ${filterStatus === 'rejected' ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'}`}>
              Rejected
            </div>
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <EmptyState 
              icon={Inbox}
              title="No applications found"
              description={
                filterStatus === 'all'
                  ? userRole === 'student'
                    ? 'Start applying to jobs to see them here'
                    : 'No applications received yet'
                  : `No ${filterStatus} applications`
              }
              action={userRole === 'student' ? {
                label: "Browse Jobs",
                onClick: () => onNavigate('student-dashboard')
              } : undefined}
            />
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-[#111111] p-6 rounded-3xl hover:shadow-xl dark:hover:shadow-none transition-all duration-300 border border-transparent dark:border-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-1">
                          {application.job?.title || 'Unknown Job'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {userRole === 'student' ? application.job?.employer?.companyName : application.student?.name}
                        </p>
                        {userRole === 'employer' && (
                          <p className="text-sm text-gray-500 dark:text-gray-500">{application.student?.university}</p>
                        )}
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                     <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#C9940A]" />
                        {application.job?.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#C9940A]" />
                        {application.job?.salary}
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-[#C9940A]" />
                        {application.job?.type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#C9940A]" />
                        <span className="opacity-80">Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {userRole === 'employer' && application.student?.skills && (
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-4 border border-transparent dark:border-white/5">
                        <p className="text-sm font-semibold text-[#111111] dark:text-white mb-2">Student Skills:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-400">{application.student?.skills}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {userRole === 'student' && (
                        <>
                          <button
                            onClick={() => onNavigate('job-details', { jobId: application.job?.id })}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-[#111111] dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all font-semibold"
                          >
                            <Eye size={16} />
                            View Job
                          </button>
                          {application.status === 'accepted' || application.status === 'interview' ? (
                            <button
                              onClick={() => onNavigate('messaging')}
                              className="flex items-center gap-2 px-4 py-2 bg-[#C9940A] text-white rounded-xl hover:bg-[#A67800] transition-all"
                            >
                              <MessageSquare size={16} />
                              Message Employer
                            </button>
                          ) : null}
                        </>
                      )}

                      {userRole === 'employer' && (
                        <>
                          {application.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(application.id, 'accepted')} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all">
                                <CheckCircle size={16} />
                                Accept
                              </button>
                              <button onClick={() => handleUpdateStatus(application.id, 'interview')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                                <MessageSquare size={16} />
                                Interview
                              </button>
                              <button onClick={() => handleUpdateStatus(application.id, 'rejected')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all">
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}
                          {application.status !== 'pending' && (
                            <button
                              onClick={() => onNavigate('messaging')}
                              className="flex items-center gap-2 px-4 py-2 bg-[#C9940A] text-white rounded-xl hover:bg-[#A67800] transition-all"
                            >
                              <MessageSquare size={16} />
                              Message Student
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate('student-profile', { userId: application.student?.id })}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-[#111111] dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-all font-semibold"
                          >
                            <Eye size={16} />
                            View Profile
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
