
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import UtilizationChart from '../components/ui/UtilizationChart';
import { MOCK_SEATS, MOCK_ADMIN_USER, Seat, fetchSeats } from '../utils/mockData';
import { BarChart3, Users, MapPin, Calendar, ArrowUp, ArrowDown, RefreshCw, Download, Clock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SeatMap from '../components/ui/SeatMap';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState(1);
  
  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);
        const seatData = await fetchSeats();
        setSeats(seatData);
      } catch (error) {
        toast.error('Failed to load seat data');
      } finally {
        setLoading(false);
      }
    };
    
    loadSeats();
  }, []);
  
  // Calculate statistics
  const totalSeats = seats.length;
  const bookedSeats = seats.filter(seat => seat.status === 'booked').length;
  const occupiedSeats = seats.filter(seat => seat.status === 'occupied').length;
  const availableSeats = seats.filter(seat => seat.status === 'available').length;
  
  const occupancyRate = totalSeats > 0 ? ((occupiedSeats + bookedSeats) / totalSeats) * 100 : 0;
  const availabilityRate = totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0;
  
  // Generate dummy activity data
  const activityData = [
    {
      user: 'Alex Johnson',
      action: 'Booked a seat',
      seat: '2B-4',
      time: '10 minutes ago',
      image: 'https://i.pravatar.cc/150?u=alex',
    },
    {
      user: 'Sarah Miller',
      action: 'Changed seat',
      seat: '1A-7',
      time: '25 minutes ago',
      image: 'https://i.pravatar.cc/150?u=sarah',
    },
    {
      user: 'James Wilson',
      action: 'Cancelled booking',
      seat: '3C-2',
      time: '1 hour ago',
      image: 'https://i.pravatar.cc/150?u=james',
    },
    {
      user: 'Emma Thompson',
      action: 'Checked in',
      seat: '2D-9',
      time: '2 hours ago',
      image: 'https://i.pravatar.cc/150?u=emma',
    },
    {
      user: 'Michael Brown',
      action: 'Requested change',
      seat: '1B-3',
      time: '3 hours ago',
      image: 'https://i.pravatar.cc/150?u=michael',
    },
  ];
  
  // Generate dummy recent overrides
  const overrideData = [
    {
      user: 'Daniel Lee',
      from: '2A-5',
      to: '3B-8',
      reason: 'Need to be closer to team',
      date: '2023-06-12',
    },
    {
      user: 'Rachel Green',
      from: '1C-3',
      to: '1D-6',
      reason: 'Window seat preference',
      date: '2023-06-11',
    },
    {
      user: 'Thomas Wright',
      from: '3C-9',
      to: '2B-2',
      reason: 'Medical accommodation',
      date: '2023-06-10',
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage your workspace
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex gap-2">
                <button className="btn-outline flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </button>
                <button className="btn-primary flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Seats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
                  <CardDescription>All seats in office</CardDescription>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSeats}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Across {new Set(seats.map(s => s.floor)).size} floors
                </p>
              </CardContent>
            </Card>
            
            {/* Occupied Seats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-sm font-medium">Occupied Seats</CardTitle>
                  <CardDescription>Currently in use</CardDescription>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupiedSeats}</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3.5 w-3.5 mr-1" />
                  <span>+5% from yesterday</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Occupancy Rate */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <CardDescription>Booked + occupied</CardDescription>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
                <div className="flex items-center text-xs text-purple-600 mt-1">
                  <ArrowUp className="h-3.5 w-3.5 mr-1" />
                  <span>+2.5% from last week</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Available Seats */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
                  <CardDescription>Ready to book</CardDescription>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableSeats}</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <ArrowDown className="h-3.5 w-3.5 mr-1" />
                  <span>-7% from yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts and Analytics - Takes 2/3 of the width on desktop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Utilization Chart */}
              <UtilizationChart />
              
              {/* Floor Selector and Seat Map */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Office Layout</CardTitle>
                    <div className="flex space-x-2">
                      {[1, 2, 3].map((floor) => (
                        <button
                          key={floor}
                          className={`px-3 py-1 text-sm rounded-md ${
                            selectedFloor === floor
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedFloor(floor)}
                        >
                          Floor {floor}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SeatMap floor={selectedFloor} />
                </CardContent>
              </Card>
              
              {/* Recent Overrides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Seat Override Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-slate-50 p-3 text-xs font-medium text-slate-500">
                      <div>User</div>
                      <div>From</div>
                      <div>To</div>
                      <div>Reason</div>
                      <div>Date</div>
                    </div>
                    {overrideData.map((override, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-5 p-3 text-sm border-t hover:bg-slate-50"
                      >
                        <div>{override.user}</div>
                        <div>Seat {override.from}</div>
                        <div>Seat {override.to}</div>
                        <div className="truncate" title={override.reason}>
                          {override.reason}
                        </div>
                        <div>{new Date(override.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-4">
                    View All Override Requests
                  </button>
                </CardContent>
              </Card>
            </div>
            
            {/* Side Content - Takes 1/3 of the width on desktop */}
            <div className="space-y-6">
              {/* Admin Profile */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Admin Profile</CardTitle>
                      <CardDescription>
                        Welcome back, {MOCK_ADMIN_USER.name}
                      </CardDescription>
                    </div>
                    <img
                      src={MOCK_ADMIN_USER.profileImage}
                      alt={MOCK_ADMIN_USER.name}
                      className="w-10 h-10 rounded-full border border-slate-200"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <div className="text-sm">{MOCK_ADMIN_USER.email}</div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <div className="text-sm">Last login: Today at 9:32 AM</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button className="w-full btn-primary">
                      Manage Admin Settings
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {activityData.map((activity, index) => (
                      <div key={index} className="flex items-start">
                        <img
                          src={activity.image}
                          alt={activity.user}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{' '}
                            <span className="text-gray-600">{activity.action}</span>{' '}
                            <span className="font-medium">Seat {activity.seat}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 mt-6">
                    View All Activity
                  </button>
                </CardContent>
              </Card>
              
              {/* Floor Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Floor Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="occupancy">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                      <TabsTrigger value="availability">Availability</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="occupancy" className="mt-0">
                      <div className="space-y-4">
                        {[1, 2, 3].map((floor) => {
                          const floorSeats = seats.filter(s => s.floor === floor);
                          const floorOccupied = floorSeats.filter(s => s.status === 'occupied' || s.status === 'booked').length;
                          const floorRate = floorSeats.length > 0 ? (floorOccupied / floorSeats.length) * 100 : 0;
                          
                          return (
                            <div key={floor}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Floor {floor}</span>
                                <span className="text-sm font-medium">{floorRate.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{ width: `${floorRate}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="availability" className="mt-0">
                      <div className="space-y-4">
                        {[1, 2, 3].map((floor) => {
                          const floorSeats = seats.filter(s => s.floor === floor);
                          const floorAvailable = floorSeats.filter(s => s.status === 'available').length;
                          const floorRate = floorSeats.length > 0 ? (floorAvailable / floorSeats.length) * 100 : 0;
                          
                          return (
                            <div key={floor}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Floor {floor}</span>
                                <span className="text-sm font-medium">{floorRate.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-green-500 h-2.5 rounded-full" 
                                  style={{ width: `${floorRate}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  </Tabs>
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

export default AdminDashboard;
