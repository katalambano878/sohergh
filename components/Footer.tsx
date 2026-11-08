"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCMS } from '@/context/CMSContext';
import { SITE_NAME, SITE_TAGLINE, SITE_LOGO_PATH, CONTACT_EMAIL_FALLBACK } from '@/lib/site-defaults';

function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-blue-800/50 lg:border-none last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left lg:py-0 lg:cursor-default lg:mb-6"
      >
        <h4 className="font-bold text-lg text-white">{title}</h4>
        <i className={`ri-arrow-down-s-line text-blue-400 text-xl transition-transform duration-300 lg:hidden ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0 lg:max-h-full lg:overflow-visible'}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { getSetting } = useCMS();

  const siteName = getSetting('site_name') || SITE_NAME;
  const siteTagline = getSetting('site_tagline') || SITE_TAGLINE;
  const contactEmail = getSetting('contact_email') || CONTACT_EMAIL_FALLBACK;
  const contactPhone = getSetting('contact_phone') || '';
  const socialFacebook = getSetting('social_facebook') || '';
  const socialInstagram = getSetting('social_instagram') || '';
  const socialTwitter = getSetting('social_twitter') || '';
  const socialTiktok = getSetting('social_tiktok') || '';
  const socialSnapchat = getSetting('social_snapchat') || '';
  const socialYoutube = getSetting('social_youtube') || '';

  return (
    <footer className="mt-10 bg-blue-950 border-t border-blue-900/70">
      <div className="h-1 w-full bg-gradient-to-r from-blue-900 via-blue-700/70 to-blue-900"></div>
      <div className="text-white pt-10 pb-9">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-9">

            {/* Brand Column */}
            <div className="lg:col-span-1 space-y-4">
              <Link href="/" className="inline-block group">
                <img src={SITE_LOGO_PATH} alt={siteName} className="h-12 sm:h-14 w-auto max-w-[135px] object-contain object-left drop-shadow-lg group-hover:scale-105 transition-transform duration-300" />
              </Link>
              <p className="text-blue-200/60 leading-relaxed text-sm">
                {siteTagline}
              </p>

              <div className="flex gap-2.5 pt-1">
                {[
                  { link: socialInstagram, icon: 'ri-instagram-line' },
                  { link: socialTiktok, icon: 'ri-tiktok-fill' },
                  { link: socialSnapchat, icon: 'ri-snapchat-fill' },
                  { link: socialYoutube, icon: 'ri-youtube-fill' },
                  { link: socialTwitter, icon: 'ri-twitter-x-fill' },
                  { link: socialFacebook, icon: 'ri-facebook-fill' }
                ].map((social, i) => social.link && (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-blue-900/40 border border-blue-800 rounded-full flex items-center justify-center text-blue-300 hover:bg-blue-500 hover:text-blue-950 hover:border-blue-500 transition-all hover:-translate-y-1"
                  >
                    <i className={social.icon}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-6 lg:gap-8 pl-0 lg:pl-10">

              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Shop</h4>
                <ul className="space-y-3 text-blue-100/60 text-sm">
                  <li><Link href="/shop" className="hover:text-blue-300 transition-colors">All Products</Link></li>
                  <li><Link href="/categories" className="hover:text-blue-300 transition-colors">Collections</Link></li>
                  <li><Link href="/shop?sort=newest" className="hover:text-blue-300 transition-colors">New Arrivals</Link></li>
                  <li><Link href="/shop?sort=bestsellers" className="hover:text-blue-300 transition-colors">Best Sellers</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Support</h4>
                <ul className="space-y-3 text-blue-100/60 text-sm">
                  <li><Link href="/contact" className="hover:text-blue-300 transition-colors">Contact Us</Link></li>
                  <li><Link href="/order-tracking" className="hover:text-blue-300 transition-colors">Track Order</Link></li>
                  <li><Link href="/shipping" className="hover:text-blue-300 transition-colors">Shipping & Delivery</Link></li>
                  <li><Link href="/returns" className="hover:text-blue-300 transition-colors">Returns portal</Link></li>
                  <li><Link href="/returns/policy" className="hover:text-blue-300 transition-colors">Refund policy</Link></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-serif text-lg font-bold text-white">Company</h4>
                <ul className="space-y-3 text-blue-100/60 text-sm">
                  <li><Link href="/about" className="hover:text-blue-300 transition-colors">Our Story</Link></li>
                  <li><Link href="/privacy" className="hover:text-blue-300 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-300 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/admin" className="hover:text-blue-300 transition-colors">Admin Access</Link></li>
                </ul>
              </div>

            </div>
          </div>

          <div className="border-t border-blue-900/50 mt-9 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-blue-500/40">
            <p>
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved. Powered by{' '}
              <a href="https://doctorbarns.com" target="_blank" rel="noopener" className="text-blue-500/40 hover:underline">
                Doctor Barns Tech
              </a>
            </p>
            <div className="flex gap-4 opacity-40">
              <i className="ri-visa-line text-xl"></i>
              <i className="ri-mastercard-line text-xl"></i>
              <i className="ri-paypal-line text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
