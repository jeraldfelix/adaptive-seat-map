
import { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Briefcase, Users, Building } from 'lucide-react';
import { Seat, bookSeat, isSeatInDepartmentZone } from '../../utils/mockData';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { format, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  seat: Seat;
  userId: string;
  userDepartment?: string;
  onBookingComplete?: () => void;
  inDepartmentZone?: boolean;
}

const bookingFormSchema = z.object({
  department: z.string().min(1, "Department is required"),
  seatPreference: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  bookingReason: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingCard = ({ seat, userId, userDepartment, onBookingComplete, inDepartmentZone }: BookingCardProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);
  const [confirmationDate, setConfirmationDate] = useState<Date | null>(null);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      department: userDepartment || "",
      seatPreference: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      bookingReason: "",
    },
  });
  
  const handleInitialBooking = async () => {
    setShowPreferencesForm(true);
  };
  
  const handleSubmitPreferences = async (values: BookingFormValues) => {
    try {
      setLoading(true);
      
      // If seat is not in user's department zone, show a notification
      if (values.department && !inDepartmentZone && seat.departmentZone) {
        toast.info(`Note: This seat is in the ${seat.departmentZone} department zone.`, {
          description: "You're booking a seat outside your department's allocated zone."
        });
      }
      
      // Simulate API call to book seat with preferences
      await bookSeat(seat.id, userId);
      
      // Set confirmation state
      setConfirmationPending(true);
      
      // Calculate confirmation date (2 days from now)
      const confirmDate = addDays(new Date(), 2);
      setConfirmationDate(confirmDate);
      
      toast.success('Booking request submitted!', {
        description: `Your booking will be confirmed by ${format(confirmDate, 'PPP')}`,
      });
      
      setShowPreferencesForm(false);
    } catch (error) {
      toast.error('Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = () => {
    toast('Booking cancelled', {
      description: 'The seat will be available for others to book.',
    });
    
    if (onBookingComplete) {
      onBookingComplete();
    }
  };
  
  const handleConfirmBooking = () => {
    toast.success('Booking confirmed!', {
      description: 'Your seat has been allocated.',
    });
    
    if (onBookingComplete) {
      onBookingComplete();
    }
  };
  
  // Today and tomorrow formatted dates
  const today = new Date();
  const oneWeekLater = addDays(today, 7);
  
  const formatDate = (date: Date) => {
    return format(date, 'EEE, MMM d');
  };
  
  if (showPreferencesForm) {
    return (
      <Card className="transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Book Seat {seat.name}</CardTitle>
          <CardDescription>
            Enter your preferences for this booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitPreferences)} className="space-y-3">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department / Team</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your department or team" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="seatPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seat Preference (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any specific seat requirements" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < today || date > addDays(today, 30)
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bookingReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking Reason (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any specific reason for booking this seat"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreferencesForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }
  
  if (confirmationPending) {
    return (
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2 bg-yellow-50 border-b border-yellow-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Booking Pending</CardTitle>
              <CardDescription className="mt-1">
                Confirmation expected by {confirmationDate ? format(confirmationDate, 'PPP') : ''}
              </CardDescription>
            </div>
            <StatusBadge status="reserved" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <p className="text-amber-700 text-sm">
              Your booking request has been submitted. You'll receive confirmation within 2 days.
            </p>
            
            <div className="flex space-x-2 items-center">
              <Calendar className="h-4 w-4 text-primary" />
              <div className="text-sm">{formatDate(today)} - {formatDate(oneWeekLater)}</div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="w-[48%]"
                  onClick={handleCancelBooking}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                
                <Button 
                  className="w-[48%]"
                  onClick={handleConfirmBooking}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
          {seat.departmentZone && (
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {seat.departmentZone} Department
              </span>
              {inDepartmentZone === true && userDepartment && userDepartment === seat.departmentZone && (
                <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200 text-xs">
                  Your Department
                </Badge>
              )}
              {inDepartmentZone === false && userDepartment && userDepartment !== seat.departmentZone && (
                <Badge variant="outline" className="ml-1 bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  Other Department
                </Badge>
              )}
            </div>
          )}
          
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
            <div className="text-sm">{formatDate(today)} - {formatDate(oneWeekLater)}</div>
          </div>
          
          <div className="flex space-x-2 items-center">
            <Clock className="h-4 w-4 text-primary" />
            <div className="text-sm">9:00 AM - 5:00 PM</div>
          </div>
          
          <div className="flex space-x-2 items-center text-gray-500">
            <Users className="h-4 w-4" />
            <div className="text-xs">Seats allocated near team members when possible</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button
          onClick={handleInitialBooking}
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
