import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { User, Mail, Lock, Bell, Shield, GraduationCap, Briefcase, MapPin, Phone, Globe, Upload, Check, Save } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { api, API_URL } from '../api/client';
import { toast } from 'sonner';

interface ProfileSettingsPageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function ProfileSettingsPage({ onNavigate, userRole, onLogout }: ProfileSettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'security' | 'portfolio'>('profile');
  const [loading, setLoading] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const [notifications, setNotifications] = useState({
    jobMatches: true,
    applicationUpdates: true,
    messages: true,
    productUpdates: false,
  });
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    university: '',
    major: '',
    companyName: '',
    website: '',
    bio: '',
    avatarUrl: '',
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await api.get('/users/me');
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.skills ? user.skills.split(',')[0] : '', // mocked field for phone
          location: 'Tunis, Tunisia', // standard
          university: user.university || '',
          major: user.major || '',
          companyName: user.companyName || '',
          website: user.website || '',
          bio: user.companyDescription || '',
          avatarUrl: user.avatarUrl || '',
          resumeUrl: user.resumeUrl || ''
        });
        setPortfolioUrl(user.portfolioUrl || '');
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('campuscash_notifications');
      if (raw) {
        const parsed = JSON.parse(raw);
        setNotifications((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: formData.name,
        // email not updating for simplicity
      };

      if (userRole === 'student') {
        payload.university = formData.university;
        payload.major = formData.major;
      } else {
        payload.companyName = formData.companyName;
        payload.website = formData.website;
        payload.companyDescription = formData.bio;
      }

      await api.put('/users/me', payload);

      toast.success('Profile updated successfully');
    } catch (e) {
      toast.error('Failed to save profile');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume' | 'portfolio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataToUpload = new FormData();
    formDataToUpload.append(type, file);

    try {
      const response = await fetch(`${API_URL}/uploads/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToUpload
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      if (type === 'avatar') {
        setFormData(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
      } else if (type === 'resume') {
        setFormData(prev => ({ ...prev, resumeUrl: data.resumeUrl }));
      } else if (type === 'portfolio') {
        setPortfolioUrl(data.portfolioUrl);
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
    } catch (error) {
      console.error(error);
      toast.error(`Failed to upload ${type}`);
    }
  };

  const handleNotificationsToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('campuscash_notifications', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 2500);
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setSecurityError(null);
    setSecuritySuccess(false);

    if (!securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword) {
      setSecurityError('Please fill in all fields.');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('New passwords do not match.');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters.');
      return;
    }

    try {
      setSecuritySaving(true);
      await api.put('/auth/change-password', {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSecuritySuccess(true);
      setTimeout(() => setSecuritySuccess(false), 3000);
    } catch (e: any) {
      setSecurityError(e?.message || 'Failed to change password.');
    } finally {
      setSecuritySaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'portfolio', label: 'Portfolio', icon: Upload },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#C9940A] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  return (
    <div className="min-h-screen bg-[#FFFFFF] transition-colors duration-300">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="settings" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111111] mb-2">Settings</h1>
          <p className="text-[#6B5B35]">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-4 space-y-2 sticky top-24 border border-[#E8E0C8]50 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                      ? 'bg-[#C9940A] text-white shadow-lg shadow-[#C9941A]/200'
                      : 'text-[#6B5B35] hover:bg-[#FDF9EC] hover:text-[#C9940A]'
                    }`}
                >
                  <tab.icon size={20} />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 border border-transparent dark:border-white/5">
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-6">Profile Information</h2>

                {/* Profile Photo */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-3">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#111111] dark:bg-white/10 rounded-full flex items-center justify-center text-white dark:text-white/70 text-3xl font-bold border border-transparent dark:border-white/10 overflow-hidden">
                      {formData.avatarUrl ? (
                        <img 
                          src={formData.avatarUrl.startsWith('http') ? formData.avatarUrl : `${API_URL.replace('/api', '')}${formData.avatarUrl}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (formData.name || formData.companyName || 'U').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatarInput"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'avatar')}
                      />
                      <label 
                        htmlFor="avatarInput"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] dark:bg-white/5 text-[#111111] dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all mb-2 cursor-pointer font-semibold border border-transparent dark:border-white/10 shadow-sm"
                      >
                        <Upload size={16} />
                        Upload New Photo
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9941A]500/20 text-[#111111] dark:text-white bg-gray-50 dark:bg-white/5"
                      />
                    </div>
                  </div>
                </div>

                {userRole === 'student' && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                        University
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                        Field of Study
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-3">
                        Curriculum Vitae (CV)
                      </label>
                      <div className="p-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5">
                        <div className="flex flex-col items-center text-center">
                          <Upload className="text-[#C9940A] mb-2" size={32} />
                          <h4 className="font-bold text-[#111111] dark:text-white">
                            {formData.resumeUrl ? 'CV Already Uploaded' : 'Upload your resume'}
                          </h4>
                          <p className="text-sm text-gray-500 mb-4">PDF format, max 5MB</p>
                          <input
                            type="file"
                            id="resumeInput"
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e, 'resume')}
                          />
                          <label 
                            htmlFor="resumeInput"
                            className="px-6 py-2 bg-[#C9940A] text-white rounded-xl hover:bg-[#A67800] transition-all cursor-pointer font-semibold shadow-md"
                          >
                            {formData.resumeUrl ? 'Change Resume' : 'Choose File'}
                          </label>
                          {formData.resumeUrl && (
                            <a 
                              href={formData.resumeUrl.startsWith('http') ? formData.resumeUrl : `${API_URL.replace('/api', '')}${formData.resumeUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 text-sm text-[#C9940A] hover:underline flex items-center gap-1"
                            >
                              <Briefcase size={14} /> View current CV
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'employer' && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                        Company Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                    Bio / Description
                  </label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white placeholder-gray-400"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#C9940A] text-white px-8 py-3 rounded-xl hover:bg-[#A67800] transition-all font-bold shadow-lg shadow-[#C9941A]/600/20"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-3xl p-8 space-y-8 border border-[#E8E0C8]50">
                <div>
                  <h2 className="text-2xl font-bold text-[#111111] mb-1">Portfolio</h2>
                  <p className="text-[#6B5B35] text-sm">
                    Upload your portfolio file — images, PDFs, ZIP archives, or documents. Max 10MB.
                  </p>
                </div>

                {/* Current portfolio */}
                {portfolioUrl && (
                  <div className="flex items-center gap-4 p-4 bg-[#FDF9EC] rounded-2xl border border-[#E8E0C8]">
                    <div className="w-12 h-12 bg-[#C9940A] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Upload size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111111] truncate">Portfolio uploaded</p>
                      <a
                        href={portfolioUrl.startsWith('http') ? portfolioUrl : `http://localhost:5000${portfolioUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#C9940A] hover:underline truncate block"
                      >
                        View / Download
                      </a>
                    </div>
                    <Check size={20} className="text-green-500 flex-shrink-0" />
                  </div>
                )}

                {/* Upload zone */}
                <label className="block cursor-pointer group">
                  <div className="border-2 border-dashed border-[#E8E0C8] group-hover:border-[#C9940A] rounded-2xl p-10 text-center transition-all bg-[#FFFFFF] group-hover:bg-[#FDF9EC]">
                    <div className="w-16 h-16 bg-[#FAF0C4] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C9940A] transition-colors">
                      <Upload size={28} className="text-[#C9940A] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[#111111] font-semibold mb-1">Click to upload your portfolio</p>
                    <p className="text-[#6B5B35] text-sm">Supports: PDF, Images (PNG, JPG, GIF), ZIP, DOC, DOCX, MP4</p>
                    <p className="text-[#6B5B35] text-xs mt-1">Max file size: 10MB</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.zip,.doc,.docx,.mp4,.webm"
                      onChange={(e) => handleFileUpload(e, 'portfolio')}
                    />
                  </div>
                </label>

                <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E8E0C8]50">
                  <h4 className="font-semibold text-[#111111] mb-3 flex items-center gap-2">
                    <Check size={16} className="text-[#C9940A]" />
                    Tips for a great portfolio
                  </h4>
                  <ul className="text-sm text-[#6B5B35] space-y-2">
                    <li>• Include your best 3–5 projects</li>
                    <li>• Add a brief description of each project and your role</li>
                    <li>• Show real results: metrics, screenshots, or demos</li>
                    <li>• Keep the file size under 10MB for faster loading</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="bg-white rounded-3xl p-8 space-y-8 border border-[#E8E0C8]50">
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white">Account</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  View your login email and basic account details. For security reasons, email changes are not editable from this screen.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={userRole === 'student' ? 'Student' : 'Employer'}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.location}
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm text-gray-600 dark:text-gray-400">
                  To update your email or permanently delete your account, please contact support via the{" "}
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-[#C9940A] font-semibold hover:underline"
                  >
                    contact page
                  </button>.
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 space-y-8 border border-transparent dark:border-white/5">
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white">Notifications</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Choose which email notifications you want to receive. These préférences sont sauvegardées localement sur cet appareil.
                </p>

                <div className="space-y-4">
                  <NotificationToggle
                    label="Job matches"
                    description="Receive alerts when new jobs match your profile."
                    checked={notifications.jobMatches}
                    onChange={() => handleNotificationsToggle('jobMatches')}
                  />
                  <NotificationToggle
                    label="Application updates"
                    description="Get notified when your applications are viewed or updated."
                    checked={notifications.applicationUpdates}
                    onChange={() => handleNotificationsToggle('applicationUpdates')}
                  />
                  <NotificationToggle
                    label="Messages"
                    description="Email notifications when you receive new messages."
                    checked={notifications.messages}
                    onChange={() => handleNotificationsToggle('messages')}
                  />
                  <NotificationToggle
                    label="Product updates"
                    description="Occasional news about new features and tips."
                    checked={notifications.productUpdates}
                    onChange={() => handleNotificationsToggle('productUpdates')}
                  />
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 bg-[#C9940A] text-white px-6 py-3 rounded-xl hover:bg-[#A67800] transition-all shadow-lg shadow-[#C9940A]/20"
                >
                  <Save size={20} />
                  Save Notification Settings
                </button>

                {notificationsSaved && (
                  <div className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <Check size={16} />
                    Preferences saved on this device.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 space-y-8 border border-transparent dark:border-white/5">
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white">Security</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Update your password regularly to keep your account secure.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Current password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        name="currentPassword"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        name="newPassword"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] dark:text-white mb-2">
                      Confirm new password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] text-[#111111] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {securityError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                    {securityError}
                  </div>
                )}
                {securitySuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <Check size={18} />
                    Password changed successfully.
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={securitySaving}
                  className={`flex items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-6 py-3 rounded-xl hover:bg-[#1A1A1A] dark:hover:bg-gray-200 transition-all shadow-lg ${securitySaving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  <Lock size={18} />
                  {securitySaving ? 'Updating password...' : 'Update Password'}
                </button>

                <div className="bg-[#FFFFFF] dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm text-gray-600 dark:text-gray-400">
                  For additional security (2FA, login alerts), please contact support on the{" "}
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-[#C9940A] font-semibold hover:underline"
                  >
                    contact page
                  </button>.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile content ends */}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function NotificationToggle({ label, description, checked, onChange }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-white/5 rounded-2xl hover:bg-[#FFFFFF] dark:hover:bg-white/5 transition-all">
      <div>
        <div className="font-semibold text-[#111111] dark:text-white">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#C9940A]' : 'bg-gray-300'
          }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}
