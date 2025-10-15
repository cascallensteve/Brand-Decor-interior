import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Returns = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          {/* Back Navigation Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>
          
          <div className="prose prose-gray max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your 
                furniture, you can return it within 30 days of delivery for a full refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Eligible Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✓ Returnable Items</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>Furniture in original condition</li>
                    <li>Items with original packaging</li>
                    <li>Unassembled furniture</li>
                    <li>Items without damage or wear</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">✗ Non-Returnable Items</h3>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>Custom or personalized furniture</li>
                    <li>Assembled items (unless defective)</li>
                    <li>Items damaged by customer</li>
                    <li>Sale items marked "Final Sale"</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Process</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Contact Us</h3>
                    <p className="text-gray-600 text-sm">Call or email us to initiate the return process</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Schedule Pickup</h3>
                    <p className="text-gray-600 text-sm">We'll arrange a convenient pickup time</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Inspection</h3>
                    <p className="text-gray-600 text-sm">Item will be inspected upon pickup</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Refund Processing</h3>
                    <p className="text-gray-600 text-sm">Refund processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchange Policy</h2>
              <p className="text-gray-600 mb-4">
                We offer exchanges for items of equal or greater value. Size, color, or style exchanges 
                are subject to availability.
              </p>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">💡 Pro Tip</p>
                <p className="text-gray-600 text-sm mt-1">
                  Contact us before placing a new order if you want to exchange - we can often 
                  process the exchange directly to save you time.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Refunds are processed to the original payment method</li>
                <li>Processing time: 5-7 business days after item pickup</li>
                <li>Shipping charges are non-refundable (unless item is defective)</li>
                <li>Return pickup fees may apply for items under KES 15,000</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact for Returns</h2>
              <div className="p-6 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-3">Returns Department</h3>
                <p className="text-gray-700">Email: returns@branddecorinteriors.co.ke</p>
                <p className="text-gray-700">Phone: (+254) 0714139461</p>
                <p className="text-gray-700">Hours: Monday - Friday, 8:00 AM - 5:00 PM</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
