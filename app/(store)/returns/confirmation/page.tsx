'use client';

import Link from 'next/link';

export default function ReturnConfirmationPage() {
  const returnId = `RET-2024-${Math.floor(Math.random() * 10000)}`;

  return (
    <>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mx-auto mb-6">
              <i className="ri-check-line text-4xl text-blue-700"></i>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Return Request Submitted!</h1>
            <p className="text-gray-600 mb-2">Your return has been successfully processed</p>
            <p className="text-sm text-gray-500 mb-8">
              Return ID: <span className="font-semibold">{returnId}</span>
            </p>

            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-left">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center">
                <i className="ri-mail-line text-2xl text-blue-700 mr-2"></i>
                Check Your Email
              </h2>
              <p className="text-sm text-gray-700 mb-3">
                We've sent you an email with:
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <i className="ri-checkbox-circle-fill text-blue-600 mt-0.5"></i>
                  <span>Authorized return number and next steps (if approved)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-checkbox-circle-fill text-blue-600 mt-0.5"></i>
                  <span>Packing and return-shipping guidance (you typically pay return shipping)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-checkbox-circle-fill text-blue-600 mt-0.5"></i>
                  <span>Where to send the package</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-checkbox-circle-fill text-blue-600 mt-0.5"></i>
                  <span>Reminder to use traceable shipping</span>
                </li>
              </ul>
            </div>

            <div className="mb-8 text-left">
              <h2 className="font-bold text-gray-900 mb-4">What happens next?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                    <span className="font-bold text-blue-700">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Follow email instructions</p>
                    <p className="text-sm text-gray-600">Use the return authorization and address we send you</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                    <span className="font-bold text-blue-700">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pack Your Items</p>
                    <p className="text-sm text-gray-600">Securely pack items in original packaging with all tags</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                    <span className="font-bold text-blue-700">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ship It Back</p>
                    <p className="text-sm text-gray-600">Drop off at any authorized shipping location</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                    <span className="font-bold text-blue-700">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Refund or credit</p>
                    <p className="text-sm text-gray-600">After inspection (often 3–10 business days from receipt), credit returns to your original payment method per policy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/account"
                className="block w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Track Return Status
              </Link>
              <Link
                href="/shop"
                className="block w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Continue Shopping
              </Link>
              <Link
                href="/support/ticket"
                className="block text-blue-700 hover:text-blue-900 font-semibold whitespace-nowrap"
              >
                Need Help? Contact Support
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <i className="ri-alert-line text-2xl text-amber-700 mt-0.5"></i>
              <div>
                <p className="font-semibold text-amber-900 mb-2">Important Reminders</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Ship within the timeframe we give you (policy: start return within 7 days of delivery)</li>
                  <li>• Items must meet the Refund &amp; return policy (unopened, tags, packaging)</li>
                  <li>• Restocking fees may apply; keep your tracking number</li>
                  <li>• See <Link href="/returns/policy" className="font-semibold text-amber-900 underline">full policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
