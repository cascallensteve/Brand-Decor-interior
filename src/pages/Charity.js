import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import MainHeader from '../components/MainHeader';
import Footer from '../components/Footer';

const CharityHeader = () => {
  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-teal-600 py-12 sm:py-16">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <nav className="flex justify-center items-center space-x-2 mb-4 sm:mb-6">
          <a href="/" className="text-white hover:text-teal-200 transition-colors">Home</a>
          <span className="text-white">/</span>
          <span className="text-white font-medium">Charity</span>
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">Charity Initiative</h1>
        <p className="text-lg sm:text-xl text-white opacity-90 max-w-2xl mx-auto">
          Together we can make a difference in our community
        </p>
      </div>
    </div>
  );
};

const DonationCard = ({ title, description, targetAmount, currentAmount, image }) => {
  const percentage = (currentAmount / targetAmount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">KES {currentAmount.toLocaleString()}</span>
            <span className="text-gray-900 font-medium">KES {targetAmount.toLocaleString()}</span>
          </div>
        </div>

        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          Donate Now
        </button>
      </div>
    </div>
  );
};

const Charity = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState('');

  const charityProjects = [
    {
      id: 1,
      title: "Furniture for Schools",
      description: "Help us provide quality furniture for underprivileged schools in rural Kenya.",
      targetAmount: 500000,
      currentAmount: 125000,
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Home Furnishing for Orphanages",
      description: "Providing comfortable living spaces for children in need.",
      targetAmount: 300000,
      currentAmount: 89000,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Community Center Setup",
      description: "Furnishing community centers to serve local neighborhoods.",
      targetAmount: 750000,
      currentAmount: 203000,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const quickDonationAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonation = () => {
    if (!donationAmount || !selectedCause) {
      alert('Please select a cause and enter donation amount');
      return;
    }
    alert(`Thank you for your donation of KES ${donationAmount} to ${selectedCause}!`);
  };

  return (
    <div className="App">
      <TopNavbar />
      <MainHeader />
      <CharityHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Brand Decor, we believe that everyone deserves a comfortable and dignified living space. 
            Our charity initiative focuses on providing quality furniture to schools, orphanages, and 
            community centers across Kenya. Every purchase you make contributes to our charity fund.
          </p>
        </div>

        {/* Current Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Current Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charityProjects.map((project) => (
              <DonationCard
                key={project.id}
                title={project.title}
                description={project.description}
                targetAmount={project.targetAmount}
                currentAmount={project.currentAmount}
                image={project.image}
              />
            ))}
          </div>
        </div>

        {/* Donation Form */}
        <div className="bg-teal-50 rounded-2xl p-8 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Make a Direct Donation</h2>
            <p className="text-gray-600 mb-8">
              Choose a cause and amount to make a direct contribution via M-Pesa
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select a Cause
                </label>
                <select
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Choose a project to support</option>
                  {charityProjects.map((project) => (
                    <option key={project.id} value={project.title}>
                      {project.title}
                    </option>
                  ))}
                  <option value="General Fund">General Charity Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Donation Amount (KES)
                </label>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {quickDonationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                        donationAmount === amount.toString()
                          ? 'bg-teal-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <button
                onClick={handleDonation}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 px-8 rounded-lg font-bold text-lg transition-colors"
              >
                Donate via M-Pesa
              </button>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl font-bold text-teal-600 mb-2">45</div>
            <div className="text-gray-600">Schools Furnished</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl font-bold text-teal-600 mb-2">12</div>
            <div className="text-gray-600">Orphanages Supported</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl font-bold text-teal-600 mb-2">2,500+</div>
            <div className="text-gray-600">Children Helped</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="text-3xl font-bold text-teal-600 mb-2">KES 1.2M</div>
            <div className="text-gray-600">Total Donations</div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Charity;
