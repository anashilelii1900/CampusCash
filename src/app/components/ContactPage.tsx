import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';
import type { NavigateOptions, PageType, UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ContactPageProps {
  onNavigate: (page: PageType, options?: NavigateOptions) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

export function ContactPage({ onNavigate, userRole, onLogout }: ContactPageProps) {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Our team typically responds within 24 hours',
      value: 'support@campuscash.tn',
      link: 'mailto:support@campuscash.tn'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Monday to Friday, 9AM - 6PM',
      value: '+216 71 123 456',
      link: 'tel:+21671123456'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'CampusCash Headquarters',
      value: 'Les Berges du Lac, Tunis 1053',
      link: '#'
    }
  ];

  const faq = [
    {
      question: 'How do I create an account?',
      answer: 'Click on "Get Started" and choose whether you\'re a student or employer. Fill in your details and verify your email to activate your account.'
    },
    {
      question: 'Is CampusCash free for students?',
      answer: 'Yes! Students can create profiles, browse jobs, and apply completely free. We only charge employers for posting jobs and accessing premium features.'
    },
    {
      question: 'How do I verify my student status?',
      answer: 'During signup, you\'ll need to provide your university email address or upload your student ID. We verify all students to ensure authenticity.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'For employers, we accept credit cards, bank transfers, and mobile payments through our secure payment partners.'
    },
    {
      question: 'How quickly can I start hiring?',
      answer: 'Once you complete your employer profile and verify your business, you can post jobs immediately. Most employers receive applications within 24-48 hours.'
    },
    {
      question: 'Can I edit or delete my job posting?',
      answer: 'Yes, you can edit, pause, or delete your job postings at any time from your employer dashboard.'
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
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Get in <span className="text-[#C9940A]">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="bg-[#FFFFFF] p-8 rounded-3xl hover:shadow-xl transition-all text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9940A]/10 rounded-2xl mb-6 group-hover:bg-[#C9940A] transition-colors">
                  <method.icon className="text-[#C9940A] group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <p className="text-[#C9940A] font-semibold">{method.value}</p>
              </a>
            ))}
          </div>

          {/* Contact Form and Image */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-[#FFFFFF] p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-[#111111] mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]">
                    <option>General Inquiry</option>
                    <option>Student Support</option>
                    <option>Employer Support</option>
                    <option>Technical Issue</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#C9940A] text-white px-6 py-4 rounded-xl hover:bg-[#A67800] transition-all font-semibold"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Image and Info */}
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1553775282-20af80779df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwY3VzdG9tZXIlMjBzdXBwb3J0fGVufDF8fHx8MTc3MTY3Nzc2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Customer support"
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="bg-white p-8 rounded-3xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#C9940A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-[#C9940A]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">Business Hours</h3>
                    <div className="space-y-1 text-gray-700">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#C9940A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-[#C9940A]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] mb-2">Live Chat</h3>
                    <p className="text-gray-700 mb-3">
                      Need immediate assistance? Our live chat is available during business hours.
                    </p>
                    <button className="text-[#C9940A] font-semibold hover:underline">
                      Start Live Chat →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#111111] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faq.map((item, index) => (
              <details
                key={index}
                className="bg-white p-6 rounded-2xl group hover:shadow-lg transition-all"
              >
                <summary className="font-bold text-[#111111] cursor-pointer list-none flex items-center justify-between">
                  <span>{item.question}</span>
                  <span className="text-[#C9940A] text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-gray-700 mt-4 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-700 mb-4">Can't find what you're looking for?</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#C9940A] font-semibold hover:underline"
            >
              Contact our support team →
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
