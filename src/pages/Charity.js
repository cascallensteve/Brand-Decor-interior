import React, { useState, useEffect } from 'react';
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

const DonationCard = ({ title, description, targetAmount, currentAmount, image, onDonate }) => {
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

        <button 
          onClick={() => onDonate(title)}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
          Donate Now
        </button>
      </div>
    </div>
  );
};

const Charity = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedCause, setSelectedCause] = useState('');
  const [charityProjects, setCharityProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);

  // Fetch charities from API
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch('https://brand-decor-ecom-api.vercel.app/donations/list-charities', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const charities = data.charities || [];
          
          // Map API data to component format
          const mappedCharities = charities.map(charity => ({
            id: charity.id,
            title: charity.title,
            description: charity.description,
            targetAmount: parseFloat(charity.target_amount),
            currentAmount: parseFloat(charity.total_amount),
            image: charity.banner || 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
          }));
          
          setCharityProjects(mappedCharities);
        } else {
          console.error('Failed to fetch charities');
          setCharityProjects([]);
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
        setCharityProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const quickDonationAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDonateClick = (cause) => {
    setSelectedCause(cause);
    setDonationAmount('');
    setShowDonationForm(true);
    // Scroll to donation form
    setTimeout(() => {
      document.getElementById('donation-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDonation = () => {
    if (!donationAmount || !selectedCause) {
      alert('Please select a cause and enter donation amount');
      return;
    }
    alert(`Thank you for your donation of KES ${donationAmount} to ${selectedCause}!`);
    setShowDonationForm(false);
    setDonationAmount('');
    setSelectedCause('');
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
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              <p className="mt-4 text-gray-600">Loading charities...</p>
            </div>
          ) : charityProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No charity projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {charityProjects.map((project) => (
                <DonationCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  targetAmount={project.targetAmount}
                  currentAmount={project.currentAmount}
                  image={project.image}
                  onDonate={handleDonateClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Donation Form */}
        {showDonationForm && (
        <div id="donation-form-section" className="bg-teal-50 rounded-2xl p-8 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Donate to {selectedCause}</h2>

            <div className="space-y-6">
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
        )}
        

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
