import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MapPin, DollarSign, Briefcase, Calendar, CheckCircle, ArrowLeft, Bookmark } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { api } from '../api/client';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

interface JobDetailsPageProps {
  jobId: number;
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export function JobDetailsPage({ jobId, onNavigate, userRole, onLogout }: JobDetailsPageProps) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    checkIfApplied();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/jobs/${jobId}`);
      setJob(data);
    } catch (error) {
      console.error('Failed to load job', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (userRole !== 'student') return;
    try {
      const data = await api.get('/applications');
      const applied = data.some((app: any) => app.jobId === jobId);
      setHasApplied(applied);
    } catch (e) {
      // ignore
    }
  };

  const handleApply = async () => {
    if (!userRole) {
      onNavigate('auth');
      return;
    }
    try {
      setApplying(true);
      await api.post(`/applications/${jobId}`, {});
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-start mb-6">
                  <Skeleton className="w-16 h-16 rounded-xl mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-10 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-8">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <Skeleton className="h-14 w-full mb-4" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <button onClick={() => onNavigate('home')} className="mt-4 text-[#C9940A]">Return Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse responsibilities and requirements if they are comma/newline separated
  const responsibilitiesList = job.responsibilities ? job.responsibilities.split(/\n|,/).filter((r: string) => r.trim() !== '') : [];
  const requirementsList = job.requirements ? job.requirements.split(/\n|,/).filter((r: string) => r.trim() !== '') : [];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-[#777777] hover:text-[#C9940A] transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-[#F5F3EF] rounded-xl flex items-center justify-center text-3xl mr-4 uppercase">
                    {job.employer?.companyName?.[0] || 'C'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-[#111111] mb-2">{job.title}</h1>
                    <p className="text-xl text-[#777777]">{job.employer?.companyName || job.company}</p>
                  </div>
                </div>
                <button className="text-[#777777] hover:text-[#C9940A] transition-colors">
                  <Bookmark size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center text-[#777777]">
                  <MapPin size={18} className="mr-2 text-[#C9940A]" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center text-[#777777]">
                  <Briefcase size={18} className="mr-2 text-[#C9940A]" />
                  <span className="text-sm">{job.type}</span>
                </div>
                <div className="flex items-center text-[#777777]">
                  <DollarSign size={18} className="mr-2 text-[#C9940A]" />
                  <span className="text-sm font-semibold text-[#C9940A]">{job.salary}</span>
                </div>
                <div className="flex items-center text-[#777777]">
                  <Calendar size={18} className="mr-2 text-[#C9940A]" />
                  <span className="text-sm">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#111111] mb-4">Job Description</h2>
              <p className="text-[#777777] leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {responsibilitiesList.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#111111] mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {responsibilitiesList.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-[#777777]">
                      <CheckCircle size={20} className="text-[#C9940A] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {requirementsList.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#111111] mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {requirementsList.map((item: string, index: number) => (
                    <li key={index} className="flex items-start text-[#777777]">
                      <CheckCircle size={20} className="text-[#C9940A] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <button
                onClick={handleApply}
                disabled={hasApplied || applying || userRole === 'employer'}
                className={`w-full text-white py-4 rounded-xl transition-all font-semibold mb-4 shadow-lg ${hasApplied
                    ? 'bg-green-600 cursor-not-allowed opacity-90'
                    : applying
                      ? 'bg-[#C9940A] opacity-70 cursor-not-allowed'
                      : userRole === 'employer'
                        ? 'bg-gray-400 cursor-not-allowed hidden'
                        : 'bg-[#C9940A] hover:bg-[#A67800] transform hover:scale-105'
                  }`}
              >
                {hasApplied ? 'Applied ✓' : applying ? 'Applying...' : !userRole ? 'Sign In to Apply' : 'Apply Now'}
              </button>
              <button className="w-full bg-[#E5E5E5] text-[#111111] py-4 rounded-xl hover:bg-[#D5D5D5] transition-all font-semibold flex items-center justify-center">
                <Bookmark size={20} className="mr-2" />
                Save Job
              </button>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#111111] mb-4 text-lg">About {job.employer?.companyName || job.company}</h3>
              <p className="text-[#777777] text-sm leading-relaxed mb-4">
                {job.employer?.name ? `Posted by ${job.employer.name}` : ''}
              </p>
              <button className="w-full text-[#C9940A] hover:text-[#A67800] font-semibold text-sm">
                View Company Profile →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
