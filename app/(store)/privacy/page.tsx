import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { pageHeroImage } from '@/lib/page-hero-images';
import {
  SITE_NAME,
  PRIVACY_POLICY_CONTACT_EMAIL,
  CONTACT_PHONE_E164_FALLBACK,
  CONTACT_PHONE_SECONDARY_E164_FALLBACK,
  CONTACT_ADDRESS_FALLBACK,
} from '@/lib/site-defaults';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Privacy Policy"
        subtitle={`How ${SITE_NAME} collects, uses, and retains personal information when you use our website.`}
        tag={null}
        backgroundImage={pageHeroImage('privacy')}
      >
        <p className="text-sm text-blue-100/90">Last updated: March 2026</p>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-10">
            This Privacy Policy describes how we handle personal information. For the rules governing purchases and use
            of the site, see our{' '}
            <Link href="/terms" className="text-blue-700 font-medium hover:underline">
              Terms of Service
            </Link>
            .
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Personal information we collect</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              When you visit the Site, we automatically collect certain information about your device, including
              information about your web browser, IP address, time zone, and some of the cookies that are installed on
              your device. Additionally, as you browse the Site, we collect information about the individual web pages
              or products that you view, what websites or search terms referred you to the Site, and information about
              how you interact with the Site. We refer to this automatically-collected information as{' '}
              <strong>“Device Information”</strong>.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4">We collect Device Information using the following technologies</h3>
            <ul className="space-y-3 text-gray-600 mb-8 list-disc pl-6">
              <li>
                <strong>“Cookies”</strong> are data files that are placed on your device or computer and often include an
                anonymous unique identifier. For more information about cookies, and how to disable cookies, visit{' '}
                <a
                  href="https://www.allaboutcookies.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium hover:underline"
                >
                  www.allaboutcookies.org
                </a>
                .
              </li>
              <li>
                <strong>“Log files”</strong> track actions occurring on the Site, and collect data including your IP
                address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
              </li>
              <li>
                <strong>“Web beacons”</strong>, <strong>“tags”</strong>, and <strong>“pixels”</strong> are electronic
                files used to record information about how you browse the Site.
              </li>
            </ul>

            <p className="text-gray-600 leading-relaxed mb-6">
              Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain
              information from you, including your name, billing address, shipping address, payment information (including
              credit card numbers where you enter them on our checkout or our payment provider’s pages), email address,
              and phone number. We refer to this information as <strong>“Order Information”</strong>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              When we talk about <strong>“Personal Information”</strong> in this Privacy Policy, we are talking both
              about Device Information and Order Information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How do we use your personal information?</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We use the Order Information that we collect generally to fulfill any orders placed through the Site
              (including processing your payment information, arranging for shipping, and providing you with invoices
              and/or order confirmations). Additionally, we use this Order Information to:
            </p>
            <ul className="space-y-2 text-gray-600 mb-8 list-disc pl-6">
              <li>Communicate with you;</li>
              <li>Screen our orders for potential risk or fraud; and</li>
              <li>
                When in line with the preferences you have shared with us, provide you with information or advertising
                relating to our products or services.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              We use the Device Information that we collect to help us screen for potential risk and fraud (in particular,
              your IP address), and more generally to improve and optimize our Site (for example, by generating analytics
              about how our customers browse and interact with the Site, and to assess the success of our marketing and
              advertising campaigns).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Do not track</h2>
            <p className="text-gray-600 leading-relaxed">
              Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track
              signal from your browser.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data retention</h2>
            <p className="text-gray-600 leading-relaxed">
              When you place an order through the Site, we will maintain your Order Information for our records unless and
              until you ask us to delete this information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time in order to reflect, for example, changes to our
              practices or for other operational, legal, or regulatory reasons.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact us</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              For more information about our privacy practices, if you have questions, or if you would like to make a
              complaint, please contact us by e-mail at{' '}
              <a href={`mailto:${PRIVACY_POLICY_CONTACT_EMAIL}`} className="text-blue-700 font-medium hover:underline">
                {PRIVACY_POLICY_CONTACT_EMAIL}
              </a>
              .
            </p>

            <div className="bg-gray-50 border border-gray-200 p-8 rounded-xl not-prose">
              <p className="text-sm font-medium text-gray-900 mb-4">Other ways to reach us</p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <i className="ri-phone-line text-blue-700 text-lg mt-0.5"></i>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <div className="flex flex-col gap-1">
                      <a href={`tel:${CONTACT_PHONE_E164_FALLBACK}`} className="text-blue-700 hover:underline">
                        +233 20 309 7369
                      </a>
                      <a href={`tel:${CONTACT_PHONE_SECONDARY_E164_FALLBACK}`} className="text-blue-700 hover:underline">
                        +233 50 067 5444
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <i className="ri-map-pin-line text-blue-700 text-lg mt-0.5"></i>
                  <div>
                    <p className="font-medium text-gray-900">Address</p>
                    <p>
                      {CONTACT_ADDRESS_FALLBACK || `${SITE_NAME} — add your address in site settings.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
