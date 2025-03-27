
import { useState } from 'react';
import { Send, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Seat, MOCK_CURRENT_USER } from '../../utils/mockData';

interface NLPSeatPromptProps {
  onSeatFound: (seat: Seat) => void;
  availableSeats: Seat[];
}

const NLPSeatPrompt = ({ onSeatFound, availableSeats }: NLPSeatPromptProps) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processNaturalLanguagePrompt = (query: string) => {
    setIsProcessing(true);
    
    // Convert query to lowercase for easier matching
    const lowercaseQuery = query.toLowerCase();
    
    // Parse the query to identify key preferences
    const preferenceMap: Record<string, boolean> = {
      window: lowercaseQuery.includes('window') || lowercaseQuery.includes('natural light'),
      'standing desk': lowercaseQuery.includes('standing') || lowercaseQuery.includes('stand up'),
      'dual monitor': lowercaseQuery.includes('monitor') || lowercaseQuery.includes('dual screen'),
      'ergonomic chair': lowercaseQuery.includes('ergonomic') || lowercaseQuery.includes('comfortable chair'),
      'near kitchen': lowercaseQuery.includes('kitchen') || lowercaseQuery.includes('coffee'),
      'near meeting room': lowercaseQuery.includes('meeting') || lowercaseQuery.includes('conference'),
    };
    
    // Parse floor preference
    let floorPreference: number | null = null;
    if (lowercaseQuery.includes('floor')) {
      const floorMatch = lowercaseQuery.match(/floor\s*(\d+)/i);
      if (floorMatch && floorMatch[1]) {
        floorPreference = parseInt(floorMatch[1], 10);
      }
    }
    
    // Parse section preference
    let sectionPreference: string | null = null;
    const sectionMatch = lowercaseQuery.match(/section\s*([a-d])/i);
    if (sectionMatch && sectionMatch[1]) {
      sectionPreference = sectionMatch[1].toUpperCase();
    }
    
    // New: Parse team proximity preference
    const wantsTeamProximity = lowercaseQuery.includes('team') || 
                               lowercaseQuery.includes('colleague') || 
                               lowercaseQuery.includes('coworker') ||
                               lowercaseQuery.includes('department');
    
    // Calculate scores for each seat based on how well they match preferences
    const scoredSeats = availableSeats
      .filter(seat => seat.status === 'available')
      .map(seat => {
        let score = 0;
        
        // Score based on amenities
        for (const amenity of seat.amenities) {
          if (preferenceMap[amenity]) {
            score += 3;
          }
        }
        
        // Score based on floor preference
        if (floorPreference !== null && seat.floor === floorPreference) {
          score += 5;
        }
        
        // Score based on section preference
        if (sectionPreference !== null && seat.section === sectionPreference) {
          score += 5;
        }
        
        // NEW: Score based on team proximity
        if (wantsTeamProximity && MOCK_CURRENT_USER.team && seat.nearTeam === MOCK_CURRENT_USER.team) {
          score += 8; // Higher priority for team proximity
        }
        
        // NEW: If seat is in the user's department zone, give it a bonus
        if (seat.departmentZone === MOCK_CURRENT_USER.team) {
          score += 6;
        }
        
        return { seat, score };
      });
    
    // Sort seats by score
    scoredSeats.sort((a, b) => b.score - a.score);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      if (scoredSeats.length > 0 && scoredSeats[0].score > 0) {
        const bestSeat = scoredSeats[0].seat;
        onSeatFound(bestSeat);
        
        let successMessage = `Found seat ${bestSeat.name} that matches your preferences!`;
        
        // NEW: Enhanced success message with team proximity information
        if (wantsTeamProximity && bestSeat.nearTeam === MOCK_CURRENT_USER.team) {
          successMessage = `Found seat ${bestSeat.name} near your team members!`;
        } else if (wantsTeamProximity && bestSeat.departmentZone === MOCK_CURRENT_USER.team) {
          successMessage = `Found seat ${bestSeat.name} in your department zone!`;
        } else if (wantsTeamProximity) {
          // Fallback message when team proximity was requested but not available
          successMessage = `Found the best available seat ${bestSeat.name}, though not directly near your team.`;
        }
        
        toast.success(successMessage, {
          description: `Floor ${bestSeat.floor}, Section ${bestSeat.section} with ${bestSeat.amenities.join(', ')}`,
        });
      } else {
        toast.error("Couldn't find a seat matching your preferences", {
          description: "Try being less specific or check available filters",
        });
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '') {
      toast.error('Please enter a prompt');
      return;
    }
    
    processNaturalLanguagePrompt(prompt);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Find your ideal seat</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 min-w-0 h-10 px-3 py-2 rounded-md border border-input bg-background"
          placeholder="e.g., Find me a seat near a window on floor 2..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isProcessing}
        />
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Find
            </>
          )}
        </Button>
      </form>
      
      <p className="text-xs text-gray-500 mt-2">
        Try: "I need a quiet spot with a standing desk" or "Find me a seat near my team with dual monitors"
      </p>
      <div className="flex items-center mt-2 text-xs text-blue-600">
        <Users className="h-3 w-3 mr-1" />
        <span>New! Team proximity is now considered in seat allocation</span>
      </div>
    </div>
  );
};

export default NLPSeatPrompt;
