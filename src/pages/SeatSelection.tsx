
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SeatMap from '../components/ui/SeatMap';
import BookingCard from '../components/ui/BookingCard';
import NLPSeatPrompt from '../components/ui/NLPSeatPrompt';
import AIIntegration from '../components/ui/AIIntegration';
import { Seat, MOCK_CURRENT_USER, fetchSeats } from '../utils/mockData';
import { Search, Filter, ChevronDown, Sliders, UserPlus2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [availableSeats, setAvailableSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    floor: '',
    section: '',
    amenities: [] as string[],
  });
  const [activeTab, setActiveTab] = useState('map');
  
  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);
        const seats = await fetchSeats();
        const availableOnly = seats.filter(
          (seat) => seat.status === 'available' || seat.status === 'reserved'
        );
        setAvailableSeats(availableOnly);
      } catch (error) {
        toast.error('Failed to load available seats');
      } finally {
        setLoading(false);
      }
    };
    
    loadSeats();
  }, []);
  
  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeat(seat);
    // Smooth scroll to booking card on mobile
    if (window.innerWidth < 768) {
      document.getElementById('booking-section')?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };
  
  const handleBookingComplete = () => {
    // In a real app, you would refresh the seat data here
    toast('Booking successful! Redirecting to dashboard...', {
      action: {
        label: 'View Dashboard',
        onClick: () => {
          window.location.href = '/dashboard';
        },
      },
    });
    
    // Simulate redirect after booking
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 3000);
  };
  
  // Filter available seats based on selected filters
  const filteredSeats = availableSeats.filter((seat) => {
    // Filter by floor
    if (filters.floor && seat.floor.toString() !== filters.floor) {
      return false;
    }
    
    // Filter by section
    if (filters.section && seat.section !== filters.section) {
      return false;
    }
    
    // Filter by amenities
    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((amenity) => seat.amenities.includes(amenity))
    ) {
      return false;
    }
    
    return true;
  });
  
  // Get unique floors and sections for filter dropdowns
  const uniqueFloors = [...new Set(availableSeats.map((seat) => seat.floor))].sort();
  const uniqueSections = [...new Set(availableSeats.map((seat) => seat.section))].sort();
  
  // Get all possible amenities for filter checkboxes
  const allAmenities = [
    'window',
    'standing desk',
    'dual monitor',
    'ergonomic chair',
    'near kitchen',
    'near meeting room',
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Select a Seat</h1>
              <p className="text-gray-600 mt-1">
                Find and book your perfect workspace
              </p>
            </div>
            
            {/* Filters */}
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-white h-10 block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by seat name..."
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="h-10 btn-outline flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Floor</h4>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                          value={filters.floor}
                          onChange={(e) => 
                            setFilters({ ...filters, floor: e.target.value })
                          }
                        >
                          <option value="">Any Floor</option>
                          {uniqueFloors.map((floor) => (
                            <option key={floor} value={floor}>
                              Floor {floor}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Section</h4>
                        <select
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                          value={filters.section}
                          onChange={(e) =>
                            setFilters({ ...filters, section: e.target.value })
                          }
                        >
                          <option value="">Any Section</option>
                          {uniqueSections.map((section) => (
                            <option key={section} value={section}>
                              Section {section}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {allAmenities.map((amenity) => (
                            <div key={amenity} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`amenity-${amenity.replace(/\s+/g, '-')}`}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={filters.amenities.includes(amenity)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFilters({
                                      ...filters,
                                      amenities: [...filters.amenities, amenity],
                                    });
                                  } else {
                                    setFilters({
                                      ...filters,
                                      amenities: filters.amenities.filter(
                                        (a) => a !== amenity
                                      ),
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`amenity-${amenity.replace(/\s+/g, '-')}`}
                                className="ml-2 text-sm text-gray-600"
                              >
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <button
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={() =>
                            setFilters({
                              floor: '',
                              section: '',
                              amenities: [],
                            })
                          }
                        >
                          Reset Filters
                        </button>
                        <button
                          className="text-sm text-primary hover:text-primary/90"
                          onClick={() => {
                            // Apply filters and close popover
                            document.body.click();
                          }}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Takes 2/3 of the width on desktop */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="map">
                    Seat Map
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    AI Integration
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="map" className="mt-0">
                  {/* NLP Prompt */}
                  <NLPSeatPrompt 
                    onSeatFound={handleSelectSeat} 
                    availableSeats={availableSeats} 
                  />
                  
                  <div className="mt-4">
                    <SeatMap onSelectSeat={handleSelectSeat} selectedSeatId={selectedSeat?.id} />
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">AI-Powered Seat Allocation</h2>
                      <p className="text-gray-600">
                        Set up AI integration to automatically allocate seats based on team proximity and user preferences.
                      </p>
                    </div>
                    
                    <AIIntegration />
                    
                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                      <h3 className="text-md font-medium text-blue-800 mb-2 flex items-center">
                        <UserPlus2 className="h-4 w-4 mr-2" />
                        Team-Based Allocation
                      </h3>
                      <p className="text-sm text-blue-700">
                        When you specify your department or team, the system will automatically try to allocate
                        seats near team members to facilitate collaboration.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Section - Takes 1/3 of the width on desktop */}
            <div id="booking-section">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSeat ? (
                    <BookingCard
                      seat={selectedSeat}
                      userId={MOCK_CURRENT_USER.id}
                      onBookingComplete={handleBookingComplete}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <Sliders className="h-8 w-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Select a Seat
                      </h3>
                      <p className="text-sm text-gray-500 max-w-xs">
                        Click on an available seat on the map to view details and book it.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Available Seats Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Available Seats</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredSeats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSeats.slice(0, 8).map((seat) => (
                  <div
                    key={seat.id}
                    className={`cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                      selectedSeat?.id === seat.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectSeat(seat)}
                  >
                    <BookingCard
                      seat={seat}
                      userId={MOCK_CURRENT_USER.id}
                      onBookingComplete={handleBookingComplete}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No seats match your filters
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  className="btn-primary"
                  onClick={() =>
                    setFilters({
                      floor: '',
                      section: '',
                      amenities: [],
                    })
                  }
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SeatSelection;
