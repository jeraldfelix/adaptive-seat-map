
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Smart Workspace,{' '}
                <span className="text-gradient">Smarter Decisions</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our adaptive seat booking system optimizes office space usage while
                providing employees with the best working environment.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => navigate('/select-seat')}
                  className="btn-primary animate-pulse-light"
                >
                  Reserve your seat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-outline"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Getting started with SeatSync is simple and straightforward.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-semibold ml-4">View Available Seats</h3>
                </div>
                <p className="text-gray-600">
                  Browse the interactive map to see which seats are available in your office.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Select Your Seat</h3>
                </div>
                <p className="text-gray-600">
                  Choose your preferred seat based on location, amenities, or team proximity.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Confirm and Go</h3>
                </div>
                <p className="text-gray-600">
                  Book your seat with one click and receive a confirmation with all the details.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
