import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TermsConditions = () => {
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Last updated: January 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Brand Decor Furniture's website and services, you accept and agree 
                to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Products and Orders</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All product descriptions and prices are subject to change without notice</li>
                <li>We reserve the right to limit quantities and refuse orders</li>
                <li>Orders are subject to acceptance and product availability</li>
                <li>Prices include applicable taxes unless otherwise stated</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Payment is required at the time of order placement</li>
                <li>We accept major credit cards, mobile money, and bank transfers</li>
                <li>All payments are processed securely through encrypted channels</li>
                <li>Prices are displayed in Kenyan Shillings (KES)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery and Shipping</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Delivery times are estimates and may vary based on location</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>Delivery charges apply and are calculated at checkout</li>
                <li>We deliver within Nairobi and surrounding areas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns and Refunds</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Items may be returned within 30 days of delivery</li>
                <li>Items must be in original condition and packaging</li>
                <li>Custom or personalized items are non-returnable</li>
                <li>Return shipping costs are the responsibility of the customer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warranty</h2>
              <p className="text-gray-600 mb-4">
                All furniture items come with a 1-year warranty against manufacturing defects. 
                This warranty does not cover normal wear and tear or damage due to misuse.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Email: sales@branddecorinteriors.co.ke</p>
                <p className="text-gray-700">Phone: (+254) 0714139461</p>
                <p className="text-gray-700">Address: Nairobi, Kenya</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
