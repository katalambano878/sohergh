'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCMS } from '@/context/CMSContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { SITE_NAME, SITE_TAGLINE, SITE_LOGO_PATH } from '@/lib/site-defaults';

const BRAND_WHOLESALE = 'sohergh.com';
const BRAND_BEAUTY = 'SoHer Beauty';

// Custom hook for scroll animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function AboutPage() {
  usePageTitle('About Us');
  const { getSetting } = useCMS();
  const containerRef = useScrollReveal();

  const siteName = getSetting('site_name') || SITE_NAME;
  const siteTagline = getSetting('site_tagline') || SITE_TAGLINE;

  const values = [
    {
      icon: 'ri-calendar-check-line',
      title: 'Trusted since 2016',
      description: 'Years of retailing premium wigs and hair accessories, building reliable, satisfying relationships with our customers.'
    },
    {
      icon: 'ri-store-3-line',
      title: 'Wholesale & Volume',
      description: `${BRAND_WHOLESALE} is built for retailers and volume buyers—delivering great deals and low prices for your business.`
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Nationwide Reach',
      description: 'A wide range of hair and beauty products delivered nationwide, with a business structure designed to empower you.'
    },
    {
      icon: 'ri-magic-line',
      title: BRAND_BEAUTY,
      description: 'Since 2021, our beauty, makeup, and skincare line has transformed us into an all-in-one destination for the modern woman.'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200">
      {/* Hero Section - Editorial Style */}
      <div className="relative h-[56vh] min-h-[460px] w-full flex items-center justify-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply" />
          <img 
            src="/about-hero-model.png" 
            alt="About Us Hero" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-[subtle-zoom_20s_ease-in-out_infinite_alternate]"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <h1 className="hero-title-font text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
            Our Story
          </h1>
          <p className="hero-subtitle-font text-base md:text-lg text-neutral-300 font-medium max-w-xl mx-auto leading-relaxed">
            Wigs, hair accessories, wholesale for retailers—and {BRAND_BEAUTY} for beauty, makeup, and skincare. Est. 2016.
          </p>
        </div>
      </div>

      {/* The Narrative Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-100 ease-out">
            <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-400 mb-5">The Beginning</h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif leading-tight mb-5 text-neutral-900">
              Redefining beauty retail since 2016.
            </h3>
            <div className="space-y-4 text-base text-neutral-600 font-light leading-relaxed">
              <p>
                We started with a simple vision: to provide exceptional wigs and hair accessories. Over the years, we have built a reliable and deeply satisfying relationship with our customers.
              </p>
              <p>
                As demand grew, so did our ambition. Listening to our customers, we launched <strong className="font-medium text-neutral-900">{BRAND_WHOLESALE}</strong>—a dedicated platform for retailers and volume buyers to access premium products at unbeatable prices.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-7 relative reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-300 ease-out">
            <div className="aspect-[4/3] relative rounded-sm overflow-hidden bg-neutral-100 group">
              <img
                src="/about-founder.png"
                alt="Founder portrait"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-black/10" />
            </div>
            {/* Decorative minimalist accent */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b border-l border-neutral-300" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t border-r border-neutral-300" />
          </div>
        </div>
      </div>

      {/* Evolution Section */}
      <div className="py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out rounded-2xl border border-neutral-200 bg-white p-7 md:p-9 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
              <div className="text-neutral-400 mb-5">
                <i className="ri-store-2-line text-3xl"></i>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif mb-4 text-neutral-900">Hair & Wholesale</h3>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                We serve everyday shoppers and, through <span className="text-neutral-900 font-medium">{BRAND_WHOLESALE}</span>, retailers and volume buyers who need dependable stock, sharp pricing, and a team that truly understands the hair business.
              </p>
            </div>
            
            <div className="reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200 ease-out rounded-2xl border border-neutral-200 bg-white p-7 md:p-9 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
              <div className="text-neutral-400 mb-5">
                <i className="ri-sparkling-line text-3xl"></i>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif mb-4 text-neutral-900">All-in-One Beauty</h3>
              <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed">
                In December 2021, we launched <span className="text-neutral-900 font-medium">{BRAND_BEAUTY}</span>. We are building a singular destination for hair, makeup, skincare, and more, so the modern woman can shop all her beauty needs in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <h2 className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-400 mb-3">Our Pillars</h2>
            <h3 className="text-2xl md:text-3xl font-serif text-neutral-900">What drives us forward</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="flex flex-col group reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="mb-5 overflow-hidden">
                  <i className={`${value.icon} text-2xl text-neutral-300 group-hover:text-neutral-900 transition-colors duration-500`}></i>
                </div>
                <h4 className="text-[11px] uppercase tracking-[0.16em] font-bold text-neutral-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-neutral-500 leading-relaxed text-[15px] font-light">
                  {value.description}
                </p>
                <div className="mt-5 h-px w-0 bg-neutral-900 group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured CTA */}
      <div className="py-20 lg:py-28 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out">
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[34px] border border-white/10 bg-[#0c1429] px-6 py-14 md:px-12 md:py-16 text-center shadow-[0_24px_80px_-30px_rgba(10,20,40,0.6)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(56,133,255,0.28),transparent_55%),radial-gradient(circle_at_0%_100%,rgba(88,52,255,0.2),transparent_48%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0c1429] via-[#121f3f] to-[#0c1429] opacity-90" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                The Next Step
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
                Experience the difference.
              </h2>
              <p className="mt-5 text-base md:text-lg text-blue-100/75 font-light leading-relaxed max-w-2xl mx-auto">
                Shop premium wigs, accessories, and curated beauty products. Designed for you, and your business.
              </p>

              <Link
                href="/shop"
                className="group mt-10 inline-flex items-center justify-center gap-3 rounded-full border border-neutral-300/80 bg-white px-8 md:px-10 py-3.5 md:py-4 text-[13px] font-semibold tracking-[0.02em] text-[#111827] transition-all hover:bg-neutral-100 hover:shadow-[0_12px_30px_-18px_rgba(255,255,255,0.95)]"
              >
                <span>Start Shopping</span>
                <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes subtle-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
