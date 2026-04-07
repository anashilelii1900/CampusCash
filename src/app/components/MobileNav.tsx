import { LayoutDashboard, Briefcase, FileText, MessageSquare, DollarSign, PlusCircle, Users } from 'lucide-react';

interface MobileNavProps {
  activeSidebar: string;
  onNavigate: (id: string) => void;
  userRole: 'student' | 'employer';
}

export function MobileNav({ activeSidebar, onNavigate, userRole }: MobileNavProps) {
  const studentItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'browse', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
  ];

  const employerItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post', icon: PlusCircle },
    { id: 'applications', label: 'Applicants', icon: Users },
    { id: 'active-jobs', label: 'Jobs', icon: Briefcase },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const items = userRole === 'student' ? studentItems : employerItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#1A1A1A] z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebar === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#C9940A]' : 'text-[#777777]'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
