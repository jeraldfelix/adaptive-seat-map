
import { useState, useEffect } from 'react';
import { Seat, fetchSeats } from '../../utils/mockData';
import { ChevronDown, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StatusBadge from './StatusBadge';

interface SeatMapProps {
  onSelectSeat?: (seat: Seat) => void;
  selectedSeatId?: string;
  floor?: number;
  section?: string;
}

const SeatMap = ({ onSelectSeat, selectedSeatId, floor: initialFloor, section: initialSection }: SeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [floor, setFloor] = useState(initialFloor || 1);
  const [section, setSection] = useState(initialSection || 'All');
  
  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);
        const sectionParam = section === 'All' ? undefined : section;
        const data = await fetchSeats(floor, sectionParam);
        setSeats(data);
        setError(null);
      } catch (err) {
        setError('Failed to load seats. Please try again.');
        toast.error('Failed to load seats');
      } finally {
        setLoading(false);
      }
    };
    
    loadSeats();
  }, [floor, section]);
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') {
      toast.error('This seat is already occupied');
      return;
    }
    
    if (onSelectSeat) {
      onSelectSeat(seat);
    }
  };
  
  const renderSeat = (seat: Seat) => {
    const isSelected = seat.id === selectedSeatId;
    let seatClass = '';
    
    if (isSelected) {
      seatClass = 'seat-selected';
    } else {
      switch (seat.status) {
        case 'available':
          seatClass = 'seat-available';
          break;
        case 'booked':
          seatClass = 'seat-booked';
          break;
        case 'reserved':
          seatClass = 'seat-reserved';
          break;
        case 'occupied':
          seatClass = 'seat-occupied';
          break;
      }
    }
    
    return (
      <Popover key={seat.id}>
        <PopoverTrigger asChild>
          <div 
            className={`seat ${seatClass} ${seat.status !== 'occupied' ? 'hover:scale-105' : ''}`}
            onClick={() => handleSeatClick(seat)}
          >
            <span className="font-medium">{seat.name}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Seat {seat.name}</h3>
              <StatusBadge status={isSelected ? 'selected' : seat.status} />
            </div>
            <div className="text-sm text-gray-500">
              <p>Floor: {seat.floor}</p>
              <p>Section: {seat.section}</p>
            </div>
            {seat.amenities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mt-2">Amenities</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {seat.amenities.map((amenity) => (
                    <span 
                      key={amenity} 
                      className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {seat.assignedTo && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs text-red-500">Assigned to another user</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  
  const floorOptions = [1, 2, 3];
  const sectionOptions = ['All', 'A', 'B', 'C', 'D'];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse-light">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 border rounded-lg border-red-200 bg-red-50">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Create a grid layout for the seat map
  // Group seats by section and sort
  const groupedSeats: Record<string, Seat[]> = {};
  seats.forEach(seat => {
    if (!groupedSeats[seat.section]) {
      groupedSeats[seat.section] = [];
    }
    groupedSeats[seat.section].push(seat);
  });
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <h2 className="text-lg font-semibold">Office Seat Map</h2>
          <div className="flex gap-2">
            <div className="flex items-center space-x-2">
              <label htmlFor="floor-select" className="text-sm font-medium">
                Floor:
              </label>
              <select
                id="floor-select"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
              >
                {floorOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="section-select" className="text-sm font-medium">
                Section:
              </label>
              <select
                id="section-select"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm"
              >
                {sectionOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-seatmap-available border border-blue-200 rounded-sm mr-1.5"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-seatmap-booked border border-orange-200 rounded-sm mr-1.5"></div>
            <span className="text-xs">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-seatmap-reserved border border-purple-200 rounded-sm mr-1.5"></div>
            <span className="text-xs">Reserved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-seatmap-occupied border border-red-200 rounded-sm mr-1.5"></div>
            <span className="text-xs">Occupied</span>
          </div>
          {selectedSeatId && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-seatmap-selected border border-blue-400 rounded-sm mr-1.5"></div>
              <span className="text-xs">Selected</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-slate-50/50">
        {Object.keys(groupedSeats).length === 0 ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center">
            <p className="text-gray-500">No seats available for the selected floor and section.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSeats).map(([sectionKey, sectionSeats]) => (
              <div key={sectionKey} className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                <h3 className="text-md font-medium mb-3">Section {sectionKey}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {sectionSeats.map(renderSeat)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
