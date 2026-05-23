'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { sanitizeHtml } from '@/lib/sanitize';

const articles: any = {
  '1': {
    id: 1,
    title: 'How do I track my order?',
    category: 'Orders & Delivery',
    views: 1247,
    helpful: 234,
    updated: 'January 15, 2024',
    content: `
      <h2>Tracking Your Order</h2>
      <p>We make it easy to track your order every step of the way. Here's how:</p>
      
      <h3>Method 1: Track via Email</h3>
      <ol>
        <li>Check your email for the order confirmation</li>
        <li>Click on the "Track Order" button in the email</li>
        <li>You'll be redirected to the tracking page with real-time updates</li>
      </ol>
      
      <h3>Method 2: Track on Website</h3>
      <ol>
        <li>Go to the <a href="/order-tracking">Order Tracking</a> page</li>
        <li>Enter your order number and email address</li>
        <li>Click "Track Order" to see your delivery status</li>
      </ol>
      
      <h3>Method 3: Track in Your Account</h3>
      <ol>
        <li>Log in to your account</li>
        <li>Go to "Order History"</li>
        <li>Click on any order to see detailed tracking information</li>
      </ol>
      
      <h2>Understanding Tracking Statuses</h2>
      <ul>
        <li><strong>Order Confirmed:</strong> We've received your order</li>
        <li><strong>Processing:</strong> We're preparing your items</li>
        <li><strong>Packaged:</strong> Your order has been packaged</li>
        <li><strong>Out for Delivery:</strong> Your order will arrive today</li>
        <li><strong>Delivered:</strong> Your order has been delivered</li>
      </ul>
      
      <h2>Need More Help?</h2>
      <p>If you can't find your tracking information or have questions about your delivery, please <a href="/support/ticket">contact our support team</a>.</p>
    `
  },
  '6': {
    id: 6,
    title: 'How do I return an item?',
    category: 'Returns & Refunds',
    views: 2341,
    helpful: 456,
    updated: 'January 20, 2024',
    content: `
      <h2>Our return process</h2>
      <p>If you are not satisfied, you may request a return within <strong>7 days</strong> of delivery for eligible items. Read the full <a href="/returns/policy">Refund &amp; return policy</a> first.</p>
      
      <h3>Step 1: Start your return</h3>
      <ol>
        <li>Open the <a href="/returns">Returns Portal</a></li>
        <li>Enter your order number and email</li>
        <li>Select the items and reasons</li>
        <li>Submit the form for review</li>
      </ol>
      
      <h3>Step 2: Authorized return number</h3>
      <p>We review requests and aim to provide an authorized return number within 1–2 business days. Watch your email for instructions.</p>
      
      <h3>Step 3: Ship your return</h3>
      <p>Customers are responsible for return shipping unless we shipped the wrong item or it arrived damaged (see policy). Use a <strong>traceable</strong> method—we need proof of delivery.</p>
      
      <h3>Step 4: Inspection and refund</h3>
      <p>After we receive your package, inspection can take 3–10 business days. Restocking fees (often 30% or more) may apply. Refunds are credited to the original payment method after approval.</p>
      
      <h2>Important details</h2>
      <ul>
        <li>Claims for damaged, wrong, or missing items: within <strong>14 days</strong> of delivery with photos</li>
        <li>Final sale: clearance, special/promotional/special-order items; all fashion jewelry and cosmetics</li>
        <li>Items must be unopened, unused, and in original packaging with tags</li>
      </ul>
      
      <h2>Exchange instead?</h2>
      <p>If offered in the portal, you can choose an exchange; the same eligibility and fee rules may apply.</p>
    `
  },
  '7': {
    id: 7,
    title: 'What is your return policy?',
    category: 'Returns & Refunds',
    views: 1876,
    helpful: 312,
    updated: 'March 30, 2026',
    content: `
      <h2>Summary</h2>
      <p>Returns are generally accepted within <strong>7 days</strong> from the delivery date for eligible products. The complete rules are on our <a href="/returns/policy">Refund &amp; return policy</a> page.</p>
      
      <h2>General rules</h2>
      <ul>
        <li>Items must be in original condition and packaging, with tags and accessories; unopened, unused, not tried on, unaltered, undamaged</li>
        <li>Submit the return form via the <a href="/returns">Returns Portal</a>; authorized return number typically within 1–2 business days</li>
        <li>Inspection after receipt may take 3–10 business days</li>
        <li>Customers pay return shipping; minimum <strong>30% restocking fee</strong> may apply depending on condition</li>
        <li>Free/promotional shipping amounts may be deducted from refunds</li>
        <li>Original shipping refunded only for our shipping error or damage; otherwise return shipping may be deducted</li>
        <li>Damaged/defective/wrong/missing claims: within <strong>14 days</strong> with photo evidence</li>
        <li>Credit goes to the original payment method after inspection</li>
      </ul>
      
      <h2>Refused / undeliverable packages</h2>
      <p>Reshipment requires paying shipping again. Otherwise treated as a return with a possible <strong>10% restocking fee</strong>; original shipping not refunded.</p>
      
      <h2>Not returnable</h2>
      <ul>
        <li>Clearance, special sale, promotional, and special-order items</li>
        <li>All fashion jewelry and cosmetics (final sale)</li>
        <li>Opened, used, altered, or customer-damaged items; missing parts or packaging</li>
      </ul>
    `
  }
};

const relatedArticles = [
  { id: 7, title: 'What is your return policy?', category: 'Returns' },
  { id: 8, title: 'When will I get my refund?', category: 'Returns' },
  { id: 9, title: 'Can I exchange instead of return?', category: 'Returns' },
  { id: 10, title: 'How do I print a return label?', category: 'Returns' }
];

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  const article = articles[articleId] || articles['1'];
  
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleHelpful = (helpful: boolean) => {
    setWasHelpful(helpful);
    setShowFeedback(true);
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/help"
            className="inline-flex items-center text-blue-700 hover:text-blue-900 font-semibold mb-6 whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Help Center
          </Link>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold whitespace-nowrap">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  Updated {article.updated}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <i className="ri-eye-line"></i>
                  <span>{article.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-thumb-up-line"></i>
                  <span>{article.helpful} found this helpful</span>
                </div>
              </div>
            </div>

            <article
              className="prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
              style={{
                lineHeight: '1.8'
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Was this article helpful?</h3>
            {!showFeedback ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleHelpful(true)}
                  className="flex-1 py-3 px-6 border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                >
                  <i className="ri-thumb-up-line mr-2"></i>
                  Yes, it was helpful
                </button>
                <button
                  onClick={() => handleHelpful(false)}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors whitespace-nowrap"
                >
                  <i className="ri-thumb-down-line mr-2"></i>
                  No, I need more help
                </button>
              </div>
            ) : (
              <div className="text-center">
                {wasHelpful ? (
                  <>
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                      <i className="ri-check-line text-3xl text-blue-700"></i>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Thank you for your feedback!
                    </p>
                    <p className="text-gray-600">
                      We're glad we could help. Have a great day!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-4">
                      <i className="ri-customer-service-line text-3xl text-blue-700"></i>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Sorry we couldn't help
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our support team is here for you!
                    </p>
                    <Link
                      href="/support/ticket"
                      className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                    >
                      Contact Support
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="space-y-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/help/article/${related.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <i className="ri-file-text-line text-xl text-blue-700"></i>
                    <div>
                      <p className="font-semibold text-gray-900">{related.title}</p>
                      <p className="text-sm text-gray-600">{related.category}</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-2xl text-gray-400"></i>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
