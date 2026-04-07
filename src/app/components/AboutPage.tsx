import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Target, Users, Award, Heart, TrendingUp, Shield } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function AboutPage({ onNavigate, userRole, onLogout }: AboutPageProps) {
  const values = [
    {
      icon: Target,
      title: 'Student-First',
      description: 'Every decision we make puts student success and well-being at the center.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive ecosystem that connects students and employers.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Ensuring high-quality job opportunities and reliable student workers.'
    },
    {
      icon: Heart,
      title: 'Trust',
      description: 'Creating a safe, transparent platform built on mutual respect.'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Empowering students to develop skills and advance their careers.'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Protecting user data and ensuring safe transactions.'
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Active Students' },
    { number: '500+', label: 'Partner Companies' },
    { number: '10,000+', label: 'Jobs Posted' },
    { number: '95%', label: 'Success Rate' }
  ];

  const team = [
    { name: 'Ahmed Ben Salem', role: 'CEO & Founder', university: 'ESPRIT Alumni' },
    { name: 'Salma Hamdi', role: 'CTO', university: 'FST Tunis' },
    { name: 'Youssef Mansouri', role: 'Head of Operations', university: 'IHEC Carthage' },
    { name: 'Nour Khalil', role: 'Community Manager', university: 'ESSEC Tunis' }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Navbar onNavigate={onNavigate} userRole={userRole} onLogout={onLogout} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#111111] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #C9940A 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About <span className="text-[#C9940A]">CampusCash</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're on a mission to empower Tunisian students by connecting them with meaningful part-time work opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#111111] mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6">
                CampusCash was founded with a simple yet powerful vision: to help Tunisian university students achieve financial independence while gaining valuable work experience that aligns with their academic journey.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We understand the challenges students face—balancing studies, managing expenses, and preparing for their future careers. That's why we created a platform that makes it easy for students to find flexible, well-paid jobs that fit their schedules.
              </p>
              <p className="text-lg text-gray-700">
                For employers, we provide access to Tunisia's most talented and motivated workforce—university students who bring fresh ideas, digital skills, and enthusiasm to every project.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1725618878496-233974f2fd59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZSUyMFR1bmlzaWF8ZW58MXx8fHwxNzcxNjc3NzYxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team collaboration"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Making a difference in the Tunisian student community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl text-center hover:shadow-xl transition-all">
                <div className="text-4xl font-bold text-[#C9940A] mb-2">{stat.number}</div>
                <div className="text-gray-700 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF] p-8 rounded-3xl hover:shadow-xl transition-all group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9940A]/10 rounded-2xl mb-6 group-hover:bg-[#C9940A] transition-colors">
                  <value.icon className="text-[#C9940A] group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Former students building the future for students</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl text-center hover:shadow-xl transition-all"
              >
                <div className="w-24 h-24 bg-[#C9940A] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-1">{member.name}</h3>
                <p className="text-[#C9940A] font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.university}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#111111] to-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're a student looking for opportunities or an employer seeking talent, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('auth')}
              className="bg-[#C9940A] text-white px-8 py-4 rounded-xl hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              Get Started Today
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-[#111111] transition-all text-lg font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
