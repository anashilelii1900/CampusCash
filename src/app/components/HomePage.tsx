import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Users, Briefcase, Building2, Search, UserPlus, DollarSign, FileText, CheckCircle, Star, ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';

interface HomePageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout: () => void;
}

export function HomePage({ onNavigate, userRole, onLogout }: HomePageProps) {
  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students' },
    { icon: Briefcase, value: '1,200+', label: 'Jobs Posted' },
    { icon: Building2, value: '500+', label: 'Employers' },
  ];

  const studentSteps = [
    { icon: UserPlus, title: 'Create Profile', description: 'Sign up and build your student profile' },
    { icon: Search, title: 'Apply to Jobs', description: 'Browse and apply to flexible opportunities' },
    { icon: DollarSign, title: 'Start Earning', description: 'Get hired and earn while you study' },
  ];

  const employerSteps = [
    { icon: FileText, title: 'Post a Job', description: 'Create a job listing in minutes' },
    { icon: Users, title: 'Review Applications', description: 'Access qualified student candidates' },
    { icon: CheckCircle, title: 'Hire & Manage', description: 'Select and manage your student workforce' },
  ];

  const featuredJobs = [
    {
      id: 1,
      title: 'Social Media Manager',
      company: 'TechStart Tunisia',
      salary: '800 TND/month',
      location: 'Tunis',
      type: 'Part-time',
      logo: '🚀'
    },
    {
      id: 2,
      title: 'Content Writer',
      company: 'Digital Agency',
      salary: '15 TND/hour',
      location: 'Remote',
      type: 'Freelance',
      logo: '✍️'
    },
    {
      id: 3,
      title: 'Customer Support',
      company: 'E-commerce Plus',
      salary: '700 TND/month',
      location: 'Sousse',
      type: 'Part-time',
      logo: '🛍️'
    },
    {
      id: 4,
      title: 'Graphic Designer',
      company: 'Creative Studio',
      salary: '20 TND/hour',
      location: 'Sfax',
      type: 'Freelance',
      logo: '🎨'
    },
    {
      id: 5,
      title: 'Data Entry Clerk',
      company: 'Admin Services',
      salary: '600 TND/month',
      location: 'Tunis',
      type: 'Part-time',
      logo: '📊'
    },
    {
      id: 6,
      title: 'Tutor - Mathematics',
      company: 'Learning Center',
      salary: '25 TND/hour',
      location: 'Monastir',
      type: 'Freelance',
      logo: '📚'
    },
  ];

  const testimonials = [
    {
      name: 'Amira Ben Salah',
      role: 'Engineering Student',
      university: 'INSAT',
      image: 'https://images.unsplash.com/photo-1701096351544-7de3c7fa0272?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTUzNjYxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      text: 'CampusCash helped me find a part-time role that fits perfectly with my class schedule. I\'m earning while gaining real work experience!'
    },
    {
      name: 'Mohamed Gharbi',
      role: 'Business Student',
      university: 'ISG Tunis',
      image: 'https://images.unsplash.com/photo-1770894807442-108cc33c0a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTQ5NDg5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      text: 'As an employer, I love how easy it is to connect with talented students. The quality of candidates is exceptional!'
    },
    {
      name: 'Salma Mansouri',
      role: 'Medical Student',
      university: 'Faculty of Medicine',
      image: 'https://images.unsplash.com/photo-1594686900103-3c9698dbb31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHVuaXZlcnNpdHklMjBzdHVkZW50JTIwc21pbGluZ3xlbnwxfHx8fDE3NzE1ODY3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      text: 'The platform is so easy to use. I found a flexible tutoring job that helps me pay for my studies without affecting my grades.'
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-inter">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} activePage="home" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FDF9EC] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-50 rounded-full blur-[120px] pointer-events-none"></div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center bg-[#FDF9EC] border border-[#E8E0C8] rounded-full px-5 py-2.5 mb-8">
                <TrendingUp size={18} className="text-[#C9940A] mr-2" />
                <span className="text-[#C9940A] text-sm font-semibold tracking-wide uppercase">Tunisia's #1 Student Job Platform</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-[#111111] mb-6 leading-[1.1]">
                The Next Generation <br />
                <span className="text-[#C9940A]">of Talent</span> is Here.
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed font-inter font-light max-w-lg">
                Connect with part-time opportunities that align with your academic schedule.
                Work, earn, and thrive while you study.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <motion.button
                  onClick={() => onNavigate('auth')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#C9940A] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center group hover:bg-[#A67800] transition-colors"
                >
                  Find a Job
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => onNavigate('auth')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#C9940A] border-2 border-[#C9940A] px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-[#FDF9EC] transition-all"
                >
                  Post a Job
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:block relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C9940A]/40 to-transparent rounded-[40px] blur-3xl transform -rotate-6"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1548057407-b022b3f5b6ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5pc2lhbiUyMHN0dWRlbnQlMjBsYXB0b3AlMjBzdHVkeXxlbnwxfHx8fDE3NzE1ODY3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Student working on laptop"
                  className="relative rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-full h-[600px] object-cover"
                />

                {/* Floating UI Elements */}
                <motion.div
                  animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-10 top-20 glass rounded-2xl p-4 shadow-2xl z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Salary Paid</p>
                      <p className="text-xl font-bold text-gray-900">+800 TND</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -left-12 bottom-32 glass rounded-2xl p-4 shadow-2xl z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Job Offer</p>
                      <p className="text-lg font-bold text-gray-900">Frontend Dev</p>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 -mt-20 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(198,167,94,0.1)] transition-all transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#F5F3EF] to-[#EAE4D3] rounded-2xl flex items-center justify-center">
                      <Icon className="text-[#C9940A]" size={28} />
                    </div>
                  </div>
                  <div className="text-4xl font-extrabold text-[#111111] mb-2">{stat.value}</div>
                  <div className="text-gray-500 font-inter font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
        {/* Subtle decorative mesh */}
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-gradient-to-br from-gray-100 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] mb-4">How It Works</h2>
            <p className="text-xl text-gray-500 font-inter max-w-2xl mx-auto">Connecting talent with opportunity in three seamless steps.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Students */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-[#111111] mb-10 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-flex">
                <div className="w-10 h-10 bg-gradient-to-r from-[#C9940A] to-[#A67800] rounded-xl mr-4 flex items-center justify-center">
                  <UserPlus className="text-white" size={20} />
                </div>
                For Students
              </h3>
              <div className="space-y-6">
                {studentSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      whileHover={{ x: 10 }}
                      key={index}
                      className="flex items-start bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C9940A]/0 via-[#C9940A]/5 to-[#C9940A]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative">
                        <div className="w-14 h-14 bg-[#F5F3EF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9940A] transition-colors">
                          <Icon className="text-[#C9940A] group-hover:text-white transition-colors" size={26} />
                        </div>
                      </div>
                      <div className="ml-5 z-10">
                        <h4 className="font-bold text-[#111111] text-lg mb-1">{step.title}</h4>
                        <p className="text-gray-500 font-inter text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* For Employers */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold text-[#111111] mb-10 flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-flex">
                <div className="w-10 h-10 bg-gradient-to-r from-[#111111] to-[#222222] rounded-xl mr-4 flex items-center justify-center">
                  <Building2 className="text-white" size={20} />
                </div>
                For Employers
              </h3>
              <div className="space-y-6">
                {employerSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      whileHover={{ x: 10 }}
                      key={index}
                      className="flex items-start bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/0 via-[#111111]/5 to-[#111111]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="relative">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#111111] transition-colors">
                          <Icon className="text-[#111111] group-hover:text-white transition-colors" size={26} />
                        </div>
                      </div>
                      <div className="ml-5 z-10">
                        <h4 className="font-bold text-[#111111] text-lg mb-1">{step.title}</h4>
                        <p className="text-gray-500 font-inter text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-2">Featured Jobs</h2>
              <p className="text-[#777777]">Discover opportunities perfect for students</p>
            </div>
            <button
              onClick={() => onNavigate('auth')}
              className="hidden md:flex items-center text-[#C9940A] hover:text-[#A67800] font-semibold"
            >
              View All Jobs
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#F5F3EF] rounded-lg flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>
                  <span className="bg-[#C9940A]/10 text-[#C9940A] px-3 py-1 rounded-full text-xs font-semibold">
                    {job.type}
                  </span>
                </div>

                <h3 className="font-bold text-[#111111] mb-2 group-hover:text-[#C9940A] transition-colors">
                  {job.title}
                </h3>
                <p className="text-[#777777] text-sm mb-4">{job.company}</p>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-[#777777]">
                    <MapPin size={16} className="mr-1" />
                    {job.location}
                  </div>
                  <div className="font-semibold text-[#C9940A]">{job.salary}</div>
                </div>

                <button
                  onClick={() => onNavigate('job-details', { jobId: job.id })}
                  className="w-full bg-[#C9940A] text-white py-3 rounded-lg hover:bg-[#A67800] transition-all font-semibold"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => onNavigate('auth')}
              className="inline-flex items-center text-[#C9940A] hover:text-[#A67800] font-semibold"
            >
              View All Jobs
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">Success Stories</h2>
            <p className="text-xl text-[#6B5B35]">Hear from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-[#E8E0C8]50">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-[#C9940A] fill-[#C9940A]" />
                  ))}
                </div>
                <p className="text-[#6B5B35] mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-[#111111]">{testimonial.name}</div>
                    <div className="text-sm text-[#6B5B35]">{testimonial.role}</div>
                    <div className="text-xs text-[#C9940A]">{testimonial.university}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0E0E0E] to-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students earning while they learn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('auth')}
              className="bg-[#C9940A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started Today
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white hover:text-[#111111] transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
