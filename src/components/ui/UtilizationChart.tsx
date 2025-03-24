
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { UtilizationData, fetchUtilizationData } from '../../utils/mockData';
import { toast } from 'sonner';

const UtilizationChart = () => {
  const [data, setData] = useState<UtilizationData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const utilData = await fetchUtilizationData();
        setData(utilData);
      } catch (error) {
        toast.error('Failed to load utilization data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-white rounded-lg shadow-sm border border-slate-200 animate-pulse">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Format date to show only the day and month
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format percentage for tooltip
  const formatTooltipValue = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-slate-200">
          <p className="text-sm font-medium mb-1">{formattedDate}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatTooltipValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Seat Utilization</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${Math.round(value * 100)}%`}
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="occupancyRate"
              name="Occupancy Rate"
              stroke="#3498db"
              fillOpacity={1}
              fill="url(#colorOccupancy)"
            />
            <Area
              type="monotone"
              dataKey="bookingRate"
              name="Booking Rate"
              stroke="#2ecc71"
              fillOpacity={1}
              fill="url(#colorBooking)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UtilizationChart;
