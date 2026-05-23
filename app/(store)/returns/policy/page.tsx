import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { pageHeroImage } from '@/lib/page-hero-images';
import { SITE_NAME } from '@/lib/site-defaults';

export const metadata: Metadata = {
  title: `Refund & return policy | ${SITE_NAME}`,
  description:
    'Returns within 7 days of delivery, restocking fees, shipping, damaged-item claims, and items not eligible for return.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Refund & return policy"
        subtitle={`How returns, refunds, restocking, and shipping charges work for purchases from ${SITE_NAME}.`}
        tag={null}
        backgroundImage={pageHeroImage('returns-policy')}
      >
        <p className="text-sm text-blue-100/90">
          <Link href="/returns" className="text-white font-medium underline underline-offset-2 hover:text-blue-50">
            Start a return
          </Link>
          {' · '}
          <Link href="/help" className="text-white font-medium underline underline-offset-2 hover:text-blue-50">
            Help center
          </Link>
        </p>
      </PageHero>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <p className="text-gray-600 leading-relaxed mb-6">
              If you are not completely satisfied with your purchase, {SITE_NAME} is pleased to offer a high standard of
              customer service. We will gladly accept returns for products purchased from {SITE_NAME} within{' '}
              <strong>7 days</strong> from the delivery date.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">General policy</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li>
                Item(s) must be returned in original condition and in original packaging, including all original tags,
                paperwork, manuals, or accessories. Returned item(s) must be unopened, unused, not tried on, unaltered,
                and undamaged.
              </li>
              <li>
                To return an item for any reason, please complete our return form through the{' '}
                <Link href="/returns" className="text-blue-700 font-medium hover:underline">
                  Returns Portal
                </Link>
                . We will review it and provide an authorized return number within 1–2 business days. It may take 3 to
                10 business days from the date the package is received for inspection.
              </li>
              <li>Customers are responsible for the additional costs associated with return shipping.</li>
              <li>
                If returned items are not in the same condition as when they were sent, we may refuse the return or send
                the package back to you at your expense.
              </li>
              <li>
                Returned merchandise may be subject to a <strong>minimum 30% restocking fee</strong>, depending on the
                condition of the item(s).
              </li>
              <li>
                If the original order qualified for free or promotional shipping, original shipping costs may be
                deducted from your refund.
              </li>
              <li>
                Original shipping fees are refunded only if the item was shipped incorrectly or arrived damaged.
                Otherwise, the cost of return shipping may be deducted from your refund. We suggest shipping all returns
                using a traceable delivery method; we cannot refund or replace without proof of delivery.
              </li>
              <li>
                Claims for damaged, defective, wrong, or missing items must be submitted within{' '}
                <strong>14 days</strong> from the delivery date and must include a photo showing the issue. Resolution
                may take 1–8 business days after the claim is submitted.
              </li>
              <li>
                Return credit is issued after inspection of returned item(s) is completed and is applied to the same
                card or payment method used for the original purchase.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Refused package / undeliverable (return to sender)</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li>If you wish to have your order reshipped, an additional payment will be required for shipping.</li>
              <li>
                If you are unwilling or unable to pay for reshipment, the package will be treated as a regular return. A{' '}
                <strong>10% restocking fee</strong> may apply, and original shipping costs are not refundable.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ineligible items for return</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-600 leading-relaxed">
              <li>Clearance items, special sale items, promotional items, and special-order items.</li>
              <li>
                <strong>All fashion jewelry and cosmetics are final sale.</strong>
              </li>
              <li>
                Any product that is opened, used, tried on, altered, or damaged by the customer; items missing pieces or
                packaging materials.
              </li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 border-t border-gray-200 pt-8">
            Questions? Contact us via the{' '}
            <Link href="/contact" className="text-blue-700 hover:underline">
              contact page
            </Link>{' '}
            or open a ticket from{' '}
            <Link href="/support/ticket" className="text-blue-700 hover:underline">
              support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
