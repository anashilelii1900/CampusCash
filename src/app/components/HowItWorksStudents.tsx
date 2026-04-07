import { CheckCircle2, Search, FileText, Briefcase, TrendingUp, DollarSign, Clock, Shield } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HowItWorksStudentsProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function HowItWorksStudents({ onNavigate, userRole, onLogout }: HowItWorksStudentsProps) {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up in minutes and build your student profile. Highlight your skills, availability, and academic background to stand out to employers.',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      number: '02',
      title: 'Browse Opportunities',
      description: 'Explore hundreds of flexible part-time jobs that fit your class schedule. Filter by category, pay rate, location, and time commitment.',
      icon: Search,
      color: 'bg-purple-500'
    },
    {
      number: '03',
      title: 'Apply with One Click',
      description: 'Submit applications instantly with your saved profile. Track all your applications in one dashboard and get real-time notifications.',
      icon: Briefcase,
      color: 'bg-[#C9940A]'
    },
    {
      number: '04',
      title: 'Start Working & Earning',
      description: 'Get hired, complete work on your schedule, and build your professional experience while earning money for your studies.',
      icon: TrendingUp,
      color: 'bg-green-500'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work around your classes and exams'
    },
    {
      icon: DollarSign,
      title: 'Fair Compensation',
      description: 'Competitive pay for student workers'
    },
    {
      icon: Shield,
      title: 'Verified Employers',
      description: 'Safe and trusted job opportunities'
    },
    {
      icon: TrendingUp,
      title: 'Build Experience',
      description: 'Gain skills for your future career'
    }
  ];

  const testimonials = [
    {
      name: 'Amira Ben Ali',
      university: 'ESPRIT, Engineering Student',
      quote: 'CampusCash helped me find a tutoring job that fits perfectly with my schedule. I\'ve earned enough to cover my expenses while gaining teaching experience!',
      rating: 5
    },
    {
      name: 'Mohamed Trabelsi',
      university: 'IHET, Business Student',
      quote: 'The platform is so easy to use. I found three different gigs in my first month - from social media management to event staffing. Highly recommend!',
      rating: 5
    },
    {
      name: 'Salma Mansouri',
      university: 'FST, Computer Science',
      quote: 'As a tech student, I found amazing web development opportunities. The employers are professional and the payment is always on time.',
      rating: 5
    }
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#C9940A]/20 px-4 py-2 rounded-full mb-6">
                <span className="text-[#C9940A] font-semibold">For Students</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Path to <span className="text-[#C9940A]">Financial Freedom</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover flexible part-time opportunities designed exclusively for Tunisian university students. Work, earn, and thrive on your own terms.
              </p>
              <button
                onClick={() => onNavigate('auth')}
                className="bg-[#C9940A] text-white px-8 py-4 rounded-xl hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
              >
                Start Your Journey
              </button>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1540326586618-6c456c8cf30d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZGVudCUyMHN0dWR5aW5nJTIwbGFwdG9wJTIwaGFwcHl8ZW58MXx8fHwxNzcxNjc3NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Happy student working"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#C9940A] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">2,500+</div>
                <div className="text-sm">Active Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-[#FFFFFF] p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <step.icon className="text-white" size={32} />
                </div>
                <div className="absolute top-8 right-8 text-6xl font-bold text-gray-200 group-hover:text-[#C9940A]/20 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Why Choose CampusCash?</h2>
            <p className="text-xl text-gray-600">Benefits designed for student success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#C9940A]/10 rounded-2xl mb-6 group-hover:bg-[#C9940A] transition-colors">
                  <benefit.icon className="text-[#C9940A] group-hover:text-white transition-colors" size={36} />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from students who are thriving with CampusCash</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF] p-8 rounded-3xl hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#C9940A] fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#C9940A] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-[#111111]">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.university}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#111111] to-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Tunisian students already working and thriving with CampusCash
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('auth')}
              className="bg-[#C9940A] text-white px-8 py-4 rounded-xl hover:bg-[#A67800] transition-all transform hover:scale-105 shadow-lg text-lg font-semibold"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="border border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-[#111111] transition-all text-lg font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
