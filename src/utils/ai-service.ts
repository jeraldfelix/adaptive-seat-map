/**
 * This file provides AI functionality for seat allocation and recommendations.
 */

import { Seat, User } from "./mockData";

// Check if AI is configured - now always returns true
export const isMistralConfigured = (): boolean => {
  return true;
};

// Simple interface for the AI response
interface AiResponse {
  recommendation: {
    seatIds?: string[];
    message: string;
  };
}

/**
 * Get AI seat recommendations based on user preferences and team
 */
export const getAiSeatRecommendations = async (
  user: User,
  availableSeats: Seat[],
  preferences: {
    department?: string;
    nearTeam?: boolean;
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
  }
): Promise<AiResponse> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter seats based on preferences
    let recommendedSeats = [...availableSeats];
    
    if (preferences.preferredFloor !== undefined) {
      recommendedSeats = recommendedSeats.filter(
        seat => seat.floor === preferences.preferredFloor
      );
    }
    
    if (preferences.preferredSection) {
      recommendedSeats = recommendedSeats.filter(
        seat => seat.section === preferences.preferredSection
      );
    }
    
    if (preferences.amenities && preferences.amenities.length > 0) {
      recommendedSeats = recommendedSeats.filter(seat => 
        preferences.amenities!.every(amenity => seat.amenities.includes(amenity))
      );
    }
    
    // If team-based allocation is requested
    if (preferences.department && preferences.nearTeam) {
      recommendedSeats = recommendedSeats.filter(
        seat => seat.nearTeam === preferences.department
      );
    }
    
    // Sort by best match
    recommendedSeats.sort((a, b) => {
      // Simple scoring algorithm
      const scoreA = getSeatScore(a, user, preferences);
      const scoreB = getSeatScore(b, user, preferences);
      return scoreB - scoreA;
    });
    
    // Take the top 3 recommendations
    const topRecommendations = recommendedSeats.slice(0, 3);
    
    if (topRecommendations.length === 0) {
      return {
        recommendation: {
          message: "No seats match your preferences. Try adjusting your criteria.",
        }
      };
    }
    
    return {
      recommendation: {
        seatIds: topRecommendations.map(seat => seat.id),
        message: `Based on your preferences${preferences.department ? ` and team (${preferences.department})` : ''}, I recommend these seats which provide ${getRecommendationReasoning(topRecommendations[0], preferences)}.`,
      }
    };
    
  } catch (error) {
    console.error('Error with AI recommendations:', error);
    return {
      recommendation: {
        message: "An error occurred while getting AI recommendations. Please try again.",
      }
    };
  }
};

// Helper function to generate a score for a seat based on preferences
const getSeatScore = (
  seat: Seat, 
  user: User, 
  preferences: {
    department?: string;
    nearTeam?: boolean;
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
  }
): number => {
  let score = 0;
  
  // Match floor preference
  if (seat.floor === (preferences.preferredFloor || user.preferences.preferredFloor)) {
    score += 3;
  }
  
  // Match section preference
  if (seat.section === (preferences.preferredSection || user.preferences.preferredSection)) {
    score += 2;
  }
  
  // Match amenities
  const desiredAmenities = preferences.amenities || user.preferences.amenities;
  desiredAmenities.forEach(amenity => {
    if (seat.amenities.includes(amenity)) {
      score += 1;
    }
  });
  
  // Team proximity
  if (preferences.nearTeam && seat.nearTeam === preferences.department) {
    score += 4;
  }
  
  return score;
};

// Generate human-readable reasoning for recommendations
const getRecommendationReasoning = (
  seat: Seat,
  preferences: {
    department?: string;
    nearTeam?: boolean;
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
  }
): string => {
  const reasons = [];
  
  if (preferences.nearTeam && seat.nearTeam === preferences.department) {
    reasons.push(`proximity to your ${preferences.department} team`);
  }
  
  if (preferences.preferredFloor !== undefined && seat.floor === preferences.preferredFloor) {
    reasons.push(`your preferred floor (${preferences.preferredFloor})`);
  }
  
  if (preferences.preferredSection && seat.section === preferences.preferredSection) {
    reasons.push(`your preferred section (${preferences.preferredSection})`);
  }
  
  if (seat.amenities.length > 0) {
    const matchedAmenities = seat.amenities.filter(
      amenity => preferences.amenities?.includes(amenity)
    );
    
    if (matchedAmenities.length > 0) {
      reasons.push(`desired amenities (${matchedAmenities.join(', ')})`);
    }
  }
  
  if (reasons.length === 0) {
    return "good overall match to your preferences";
  } else if (reasons.length === 1) {
    return reasons[0];
  } else {
    return `${reasons.slice(0, -1).join(', ')} and ${reasons[reasons.length - 1]}`;
  }
};
