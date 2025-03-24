
import { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Seat, bookSeat } from '../../utils/mockData';
import StatusBadge from './StatusBadge';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingCardProps {
  seat: Seat;
  userId: string;
  onBookingComplete?: () => void;
}

const BookingCard = ({ seat, userId, onBookingComplete }: BookingCardProps) => {
  const [loading, setLoading] = useState(false);
  
  const handleBooking = async () => {
    try {
      setLoading(true);
      await bookSeat(seat.id, userId);
      toast.success('Seat booked successfully!');
      if (onBookingComplete) {
        onBookingComplete();
      }
    } catch (error) {
      toast.error('Failed to book seat. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Today and tomorrow formatted dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Seat {seat.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Floor {seat.floor}, Section {seat.section}
            </CardDescription>
          </div>
          <StatusBadge status={seat.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {seat.amenities.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1.5">Amenities</div>
              <div className="flex flex-wrap gap-1.5">
                {seat.amenities.map((amenity) => (
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
          
          <div className="flex space-x-2 items-center">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="text-sm">{formatDate(today)} - {formatDate(tomorrow)}</div>
          </div>
          
          <div className="flex space-x-2 items-center">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-sm">9:00 AM - 5:00 PM</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button
          onClick={handleBooking}
          disabled={loading || seat.status === 'occupied'}
          className={`w-full ${
            seat.status === 'occupied' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : seat.status === 'occupied' ? (
            <span className="flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Unavailable
            </span>
          ) : (
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Book Seat
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
