import React from 'react';

const Company = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Company</h1>
          
          <div className="prose prose-gray max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Brand Decor Furniture</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2015, Brand Decor Furniture has been transforming homes across Kenya with 
                beautiful, functional furniture that reflects each customer's unique style. We believe 
                that every home deserves furniture that combines modern design with timeless craftsmanship.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <div className="p-6 bg-orange-50 rounded-lg">
                <p className="text-gray-700 text-lg italic">
                  "To create beautiful spaces that inspire and comfort, using sustainable materials 
                  and expert craftsmanship that stands the test of time."
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Quality First</h3>
                  <p className="text-gray-600 text-sm">Every piece is crafted with attention to detail and built to last</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Sustainability</h3>
                  <p className="text-gray-600 text-sm">Responsibly sourced materials and eco-friendly production</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Customer Focus</h3>
                  <p className="text-gray-600 text-sm">Your satisfaction is our priority from design to delivery</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">Constantly evolving designs that meet modern living needs</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Journey</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2015</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Company Founded</h3>
                    <p className="text-gray-600 text-sm">Started with a vision to bring quality furniture to Kenyan homes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2018</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Online Platform Launch</h3>
                    <p className="text-gray-600 text-sm">Expanded to e-commerce to reach customers nationwide</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2020</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Sustainability Initiative</h3>
                    <p className="text-gray-600 text-sm">Committed to eco-friendly materials and processes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2023</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Award Recognition</h3>
                    <p className="text-gray-600 text-sm">Received international design awards for innovation</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Brand Decor?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">10+ Years Experience</h3>
                  <p className="text-gray-600 text-sm">Trusted by thousands of customers</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
                  <p className="text-gray-600 text-sm">1-year warranty on all products</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Customer Care</h3>
                  <p className="text-gray-600 text-sm">Dedicated support team</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Visit Our Showroom</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Brand Decor Interiors<br />
                    Nairobi, Kenya<br />
                    East Africa
                  </p>
                  <p className="text-gray-600 text-sm">Hours: Mon-Sat 9AM-6PM</p>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <p className="text-gray-600 text-sm">Email: sales@branddecorinteriors.co.ke</p>
                  <p className="text-gray-600 text-sm">Phone: (+254) 0714139461</p>
                  <p className="text-gray-600 text-sm">Response time: Within 24 hours</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;
