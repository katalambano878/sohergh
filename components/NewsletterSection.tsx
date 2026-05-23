"use client";

import { useState } from 'react';

// Newsletter Component
export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 md:py-10 relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-6 mb-12 md:mb-16">
      <div className="rounded-3xl md:rounded-[40px] overflow-hidden bg-[#060b14] relative shadow-2xl border border-white/5">
        
        {/* Subtle glow effect behind the form to match the image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[80%] h-[150%] md:h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#133a70]/50 via-[#0a1835]/20 to-transparent pointer-events-none blur-[80px]"></div>

        <div className="px-5 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10">
          
          {/* Left Box: Text */}
          <div className="flex-1 w-full text-left z-10 max-w-md">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 mb-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white/90">
                The Insider Club
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 leading-[1.1] tracking-tight">
              Unlock <span className="italic font-light text-[#2dd4bf]">10% Off</span><br />
              Your First Order
            </h2>

            <p className="text-blue-100/70 text-sm md:text-[15px] leading-relaxed max-w-md font-light mt-4">
              Be the first to know about new arrivals, restocks, and exclusive deals. From dresses to electronics, we keep you updated on the latest products.
            </p>
          </div>

          {/* Right Box: Form */}
          <div className="w-full lg:w-[360px] z-10 flex-shrink-0">
            <form onSubmit={handleSubmit} className="relative w-full">
              <div className="flex items-center justify-between bg-[#111827]/80 backdrop-blur-md border border-white/5 rounded-[18px] p-1.5 md:p-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] hover:border-white/10 transition-all duration-300">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent border-none text-white placeholder-blue-200/50 px-3.5 md:px-4 py-2 focus:ring-0 text-sm font-light"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#22d3ee] hover:bg-[#1bb2e0] text-[#0f172a] rounded-[12px] font-semibold text-sm transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                >
                  <span>{isSubmitting ? 'Joining...' : 'Join'}</span>
                  {!isSubmitting && <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>}
                </button>
              </div>
              {submitStatus === 'success' && (
                <p className="absolute -bottom-8 left-0 right-0 text-center lg:text-left pl-6 text-sm text-[#22d3ee]">
                  Welcome to the club. Check your inbox shortly.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
