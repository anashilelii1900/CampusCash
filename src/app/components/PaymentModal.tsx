import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Calendar, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (amount: number, description: string) => Promise<void>;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState('200');
  const [description, setDescription] = useState('Job posting credits');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple formatting for visual effect
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    if (formatted.length <= 19) setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    if (val.length <= 5) setExpiry(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !cardNumber || !expiry || !cvc || !name) return;
    
    setIsProcessing(true);
    // Simulate real network/stripe processing delay
    setTimeout(async () => {
      await onPaymentSuccess(parseInt(amount), description);
      setIsProcessing(false);
      
      // Reset form
      setCardNumber(''); setExpiry(''); setCvc(''); setName(''); setAmount('200');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#111111] p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C9940A] via-transparent to-transparent"></div>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-extrabold tracking-tight relative z-10">Add Funds</h2>
              <p className="text-white/70 font-inter text-sm mt-1 relative z-10">Secure payment powered by Simulated Stripe</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#111111] font-bold text-sm mb-2">Amount (TND)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#111111] font-bold text-sm mb-2">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#111111] font-bold text-sm mb-2">Card Information</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-inter font-medium tracking-widest"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-inter font-medium tracking-widest"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="CVC"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-inter font-medium tracking-widest"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#111111] font-bold text-sm mb-2">Name on Card</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9940A] font-medium"
                  required
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#111111] to-[#222222] text-white px-6 py-4 rounded-xl shadow-lg transition-all font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>Pay {amount ? `${amount} TND` : ''}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
