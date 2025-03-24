
import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { MOCK_CURRENT_USER, MOCK_SEATS, Seat, fetchUserInfo } from '../utils/mockData';
import { CalendarDays, MapPin, Clock, User, Settings, BellRing, CheckSquare } from 'lucide-react';
import SeatMap from '../components/ui/SeatMap';
import StatusBadge from '../components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(MOCK_CURRENT_USER);
  const [currentSeat, setCurrentSeat] = useState<Seat | null>(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserInfo('user-1');
        setUser(userData);
        
        // Find the user's current seat
        if (userData.currentSeat) {
          const seat = MOCK_SEATS.find(s => s.id === userData.currentSeat);
          if (seat) {
            setCurrentSeat(seat);
          }
        }
      } catch (error) {
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="animate-pulse-light">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-4">
                <button className="btn-outline flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </button>
                <button className="btn-primary flex items-center">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Book a Seat
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile Card */}
              <Card className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-24 w-24 rounded-full border-4 border-white"
                    />
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">User ID</h4>
                        <p className="text-sm text-gray-500">{user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Preferred Location</h4>
                        <p className="text-sm text-gray-500">
                          {user.preferences.preferredFloor 
                            ? `Floor ${user.preferences.preferredFloor}, Section ${user.preferences.preferredSection}`
                            : 'No preference set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Current Seat Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Seat Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentSeat ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Seat {currentSeat.name}</h3>
                        <StatusBadge status={currentSeat.status} />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-sm">
                            Floor {currentSeat.floor}, Section {currentSeat.section}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-sm">
                            {formatDate(new Date().toISOString().split('T')[0])}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-sm">9:00 AM - 5:00 PM</span>
                        </div>
                      </div>
                      
                      {currentSeat.amenities.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Amenities</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {currentSeat.amenities.map((amenity) => (
                              <span 
                                key={amenity} 
                                className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                        <button className="text-sm text-gray-500 hover:text-gray-700">
                          Request Change
                        </button>
                        <button className="text-sm text-red-500 hover:text-red-700">
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="bg-blue-50 p-3 rounded-full mb-3">
                        <MapPin className="h-6 w-6 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Seat Assigned</h3>
                      <p className="text-sm text-gray-500 text-center mb-4">
                        You don't have a seat assigned for today.
                      </p>
                      <button className="btn-primary w-full">
                        Book a Seat
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Notifications Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Notifications</CardTitle>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      3
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                        <BellRing className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Seat Change Alert</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your assigned seat has been changed for tomorrow due to office maintenance.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Booking Confirmed</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your seat booking for tomorrow has been confirmed.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                        <Settings className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Preference Update</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your seating preferences have been updated successfully.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4">
                    View All Notifications
                  </button>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs */}
              <Tabs defaultValue="seat-map" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="seat-map">Seat Map</TabsTrigger>
                  <TabsTrigger value="booking-history">Booking History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="seat-map" className="mt-0">
                  <SeatMap selectedSeatId={currentSeat?.id} />
                </TabsContent>
                
                <TabsContent value="booking-history" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Booking History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {user.bookingHistory.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                          {user.bookingHistory.map((booking, index) => {
                            const seat = MOCK_SEATS.find(s => s.id === booking.seatId);
                            if (!seat) return null;
                            
                            return (
                              <div key={index} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">Seat {seat.name}</p>
                                    <p className="text-sm text-gray-500">
                                      Floor {seat.floor}, Section {seat.section}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                      {formatDate(booking.date)}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                      ${
                                        booking.status === 'completed'
                                          ? 'bg-green-100 text-green-800'
                                          : booking.status === 'cancelled'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-blue-100 text-blue-800'
                                      }
                                    `}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="mt-2 flex gap-2">
                                  {seat.amenities.slice(0, 3).map((amenity) => (
                                    <span 
                                      key={amenity} 
                                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {seat.amenities.length > 3 && (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                      +{seat.amenities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-500">No booking history yet.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Preferences Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seating Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Location Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="preferred-floor" className="text-sm text-gray-600">
                            Preferred Floor
                          </label>
                          <select 
                            id="preferred-floor" 
                            className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm"
                            defaultValue={user.preferences.preferredFloor}
                          >
                            <option value="">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="preferred-section" className="text-sm text-gray-600">
                            Preferred Section
                          </label>
                          <select 
                            id="preferred-section" 
                            className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm"
                            defaultValue={user.preferences.preferredSection}
                          >
                            <option value="">Any</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Amenity Preferences</h4>
                      <div className="space-y-2">
                        {['window', 'standing desk', 'dual monitor', 'ergonomic chair', 'near kitchen', 'near meeting room'].map((amenity) => (
                          <div key={amenity} className="flex items-center">
                            <input
                              id={`amenity-${amenity.replace(/\s+/g, '-')}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              defaultChecked={user.preferences.amenities.includes(amenity)}
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
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                    <button className="btn-primary">
                      Save Preferences
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
