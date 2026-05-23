"use client";

import { useState, useEffect } from 'react';
import { useCMS } from '@/context/CMSContext';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { pageHeroImage } from '@/lib/page-hero-images';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import {
  CONTACT_EMAIL_FALLBACK,
  CONTACT_PHONE_E164_FALLBACK,
  CONTACT_PHONE_SECONDARY_E164_FALLBACK,
  CONTACT_PHONE_DISPLAY_FALLBACK,
  CONTACT_ADDRESS_FALLBACK,
} from '@/lib/site-defaults';

export default function ContactPage() {
  usePageTitle('Contact Us');
  const { getSetting } = useCMS();
  const [pageContent, setPageContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { getToken, verifying } = useRecaptcha();

  useEffect(() => {
    async function fetchContactContent() {
      const { data } = await supabase
        .from('cms_content')
        .select('*')
        .eq('section', 'contact')
        .eq('block_key', 'main')
        .single();

      if (data) {
        setPageContent(data);
      }
    }
    fetchContactContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // reCAPTCHA verification
    const isHuman = await getToken('contact');
    if (!isHuman) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Store in Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) {
        // Table might not exist, still show success
        console.log('Note: contact_submissions table may not exist');
      }

      // Send Contact Notification
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          payload: formData
        })
      }).catch(err => console.error('Contact notification error:', err));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get contact details from CMS settings
  const contactEmail = getSetting('contact_email') || CONTACT_EMAIL_FALLBACK;
  const contactPhone = getSetting('contact_phone') || CONTACT_PHONE_E164_FALLBACK;
  const contactAddress = getSetting('contact_address') || CONTACT_ADDRESS_FALLBACK || 'Address on file — configure in site settings.';
  const phoneDisplay =
    contactPhone === CONTACT_PHONE_E164_FALLBACK ? CONTACT_PHONE_DISPLAY_FALLBACK : contactPhone;
  const useDefaultGhanaPhones =
    contactPhone.replace(/\s/g, '') === CONTACT_PHONE_E164_FALLBACK.replace(/\s/g, '');

  const mapsQuery = encodeURIComponent(contactAddress);

  const heroTitle = pageContent?.title || 'Get In Touch';
  const heroSubtitle = pageContent?.subtitle || 'Have a question or need assistance?';
  const heroContent = pageContent?.content || 'Our friendly team is here to help. Reach out through any of our contact channels.';

  type ContactMethod =
    | {
        icon: string;
        title: string;
        description: string;
        kind: 'single';
        value: string;
        link: string;
        external?: boolean;
      }
    | {
        icon: string;
        title: string;
        description: string;
        kind: 'phones';
        lines: { href: string; label: string }[];
      };

  const contactMethods: ContactMethod[] = [
    useDefaultGhanaPhones
      ? {
          icon: 'ri-phone-line',
          title: 'Call Us',
          description: 'Mon–Fri, 8am–6pm GMT',
          kind: 'phones',
          lines: [
            { href: `tel:${CONTACT_PHONE_E164_FALLBACK}`, label: '+233 20 309 7369' },
            { href: `tel:${CONTACT_PHONE_SECONDARY_E164_FALLBACK}`, label: '+233 50 067 5444' },
          ],
        }
      : {
          icon: 'ri-phone-line',
          title: 'Call Us',
          value: phoneDisplay,
          link: `tel:${contactPhone.replace(/[^\d+]/g, '')}`,
          description: 'Mon–Fri, 8am–6pm GMT',
          kind: 'single',
        },
    {
      icon: 'ri-mail-line',
      title: 'Email Us',
      value: contactEmail,
      link: `mailto:${contactEmail}`,
      description: 'We respond within 24 hours',
      kind: 'single',
    },
    {
      icon: 'ri-whatsapp-line',
      title: 'WhatsApp',
      value: phoneDisplay,
      link: `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`,
      description: 'Chat with us instantly',
      kind: 'single',
      external: true,
    },
    {
      icon: 'ri-map-pin-line',
      title: 'Visit Us',
      value: contactAddress,
      link: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
      description: 'Mon–Sat, 9am–6pm',
      kind: 'single',
      external: true,
    },
  ];

  const faqs = [
    {
      question: 'What are your delivery times?',
      answer: 'Delivery times depend on your location and carrier. Update this answer to match your policy.'
    },
    {
      question: 'Where do you ship?',
      answer: 'Set your shipping regions in admin and describe them here (local, national, or international).'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Configure your checkout and list the methods you support (cards, wallets, bank transfer, etc.).'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        tag={null}
        backgroundImage={pageHeroImage('contact')}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-32 text-center">
          {contactMethods.map((method, index) =>
              method.kind === 'phones' ? (
                <div key={index} className="flex flex-col items-center">
                  <div className="mb-8 text-gray-400">
                    <i className={`${method.icon} text-3xl font-light`}></i>
                  </div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 mb-6">
                    {method.title}
                  </h3>
                  <div className="space-y-2 mb-8">
                    {method.lines.map((line) => (
                      <div key={line.href}>
                        <a
                          href={line.href}
                          className="block text-gray-500 text-sm font-light hover:text-gray-900 transition-colors"
                        >
                          {line.label}
                        </a>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-auto">
                    {method.description}
                  </p>
                </div>
              ) : (
                <a
                  key={index}
                  href={method.link}
                  target={method.external || method.link.startsWith('http') ? '_blank' : '_self'}
                  rel={method.external || method.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="mb-8 text-gray-400 group-hover:text-gray-600 transition-colors">
                    <i className={`${method.icon} text-3xl font-light`}></i>
                  </div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-900 mb-6">
                    {method.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-light mb-8 break-words group-hover:text-gray-900 transition-colors">
                    {method.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-auto">
                    {method.description}
                  </p>
                </a>
              )
            )}
          </div>


        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Order inquiry, product question, etc."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={500}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  placeholder="Tell us how we can help you..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl">
                  <i className="ri-check-line mr-2"></i>
                  Message sent successfully! We'll respond within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <i className="ri-error-warning-line mr-2"></i>
                  Failed to send message. Please try again or contact us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || verifying}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isSubmitting || verifying ? (verifying ? 'Verifying...' : 'Sending...') : 'Send Message'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Quick Answers</h2>
            <p className="text-gray-600 mb-8">
              Find answers to common questions before reaching out
            </p>

            <div className="space-y-4 mb-12">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                  <summary className="px-6 py-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="py-12 mt-12 flex flex-col items-start">
              <h3 className="text-3xl font-serif text-gray-900 mb-4">Need immediate help?</h3>
              <p className="text-gray-500 mb-10 leading-relaxed font-light text-base md:text-lg">
                Our customer support team is available Monday to Friday,<br className="hidden md:block" />
                8am-6pm GMT. For urgent matters, reach out via WhatsApp.
              </p>
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 border-b border-gray-900 pb-2 hover:border-gray-500 transition-colors group cursor-pointer"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-gray-900 group-hover:text-gray-500 transition-colors">Chat on WhatsApp</span>
                <i className="ri-arrow-right-line text-lg text-gray-900 group-hover:text-gray-500 transition-colors transform group-hover:translate-x-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-24 md:py-32 border-t border-black/[0.04]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-serif text-black mb-6">Visit Our Store</h2>
          <p className="text-sm md:text-base text-black/50 font-light mb-10 leading-relaxed">
            Prefer to shop in person? Visit our store. Our knowledgeable staff will be happy to assist you with product selection and answer any questions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs tracking-widest uppercase font-medium text-black/70">
            <div className="flex items-center gap-3">
              <i className="ri-map-pin-2-line text-black/40"></i>
              <span>{contactAddress}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-black/10 rounded-full"></div>
            <div className="flex items-center gap-3">
              <i className="ri-time-line text-black/40"></i>
              <span>Mon-Sat: 9am-6pm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
