import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import type { PageType } from '../App';
import logoSvg from '../../assets/logo.svg';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const nav = (page: PageType) => onNavigate?.(page);
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4 cursor-pointer gap-2" onClick={() => nav('home')}>
              <img src={logoSvg} alt="CampusCash" className="h-10 w-10 object-contain" />
              <div>
                <div className="text-white font-extrabold text-lg">Campus<span className="text-[#C9941A]">Cash</span></div>
                <div className="text-[#C9941A] text-[9px] tracking-widest uppercase">work.connect.thrive</div>
              </div>
            </div>
            <p className="text-[#777777] text-sm leading-relaxed">
              Connecting Tunisian students with flexible part-time jobs that fit their academic schedules.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9940A]">For Students</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => nav('how-students')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('auth')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Browse Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('how-students')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Success Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('how-students')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Student Resources
                </button>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9940A]">For Employers</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => nav('auth')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Post a Job
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('how-employers')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('how-employers')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Why Hire Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('how-employers')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Employer Resources
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C9940A]">Company</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => nav('about')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('contact')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('contact')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => nav('contact')}
                  className="text-[#777777] hover:text-[#C9940A] transition-colors text-sm"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-[#1A1A1A] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#777777] text-sm">
              © 2026 CampusCash. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-[#777777] hover:text-[#C9940A] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#777777] hover:text-[#C9940A] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#777777] hover:text-[#C9940A] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#777777] hover:text-[#C9940A] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-[#777777] hover:text-[#C9940A] transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          {/* Admin Portal — subtle link */}
          <div className="text-center mt-5">
            <button
              onClick={() => nav('admin-login' as any)}
              className="text-[#2A2A2A] hover:text-[#C9941A] text-xs transition-colors"
            >
              Admin Portal ↗
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
