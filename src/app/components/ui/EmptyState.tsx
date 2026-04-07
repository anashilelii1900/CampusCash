import { LucideIcon, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon = Search, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-gray-200"
    >
      <div className="w-20 h-20 bg-[#FFFFFF] rounded-2xl flex items-center justify-center mb-6 text-gray-400">
        <Icon size={40} />
      </div>
      <h3 className="text-2xl font-bold text-[#111111] mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-8">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#C9940A] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#A67800] transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
