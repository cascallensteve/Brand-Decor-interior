import React from 'react';

const DeliveryInfo = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Delivery Information</h1>
          
          <div className="prose prose-gray max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Areas</h2>
              <p className="text-gray-600 mb-4">
                We currently deliver to the following areas:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Nairobi City and surrounding suburbs</li>
                <li>Kiambu County</li>
                <li>Machakos County</li>
                <li>Kajiado County</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Times</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Standard Delivery</h3>
                  <p className="text-gray-600">3-5 business days</p>
                  <p className="text-sm text-gray-500">Free for orders over KES 25,000</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Express Delivery</h3>
                  <p className="text-gray-600">1-2 business days</p>
                  <p className="text-sm text-gray-500">Additional charges apply</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Charges</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Express</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Within Nairobi</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">KES 1,500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">KES 3,000</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Surrounding Counties</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">KES 2,500</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">KES 5,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Call Confirmation</h3>
                  <p className="text-gray-600 text-sm">We'll call to confirm delivery details</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">GPS Tracking</h3>
                  <p className="text-gray-600 text-sm">Track your delivery in real-time</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality Check</h3>
                  <p className="text-gray-600 text-sm">Inspection before delivery</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assembly Service</h2>
              <p className="text-gray-600 mb-4">
                Professional assembly service is available for an additional fee:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Chairs and simple furniture: KES 2,000</li>
                <li>Tables and complex items: KES 4,000</li>
                <li>Full room setups: KES 8,000</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact for Delivery</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Email: sales@branddecorinteriors.co.ke</p>
                <p className="text-gray-700">Phone: (+254) 0714139461</p>
                <p className="text-gray-700">Hours: Monday - Friday, 8:00 AM - 6:00 PM</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
