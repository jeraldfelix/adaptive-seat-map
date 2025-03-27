/**
 * This file provides AI functionality for seat allocation and recommendations.
 */

import { Seat, User, DEPARTMENT_ZONES, isSeatInDepartmentZone, isSeatNearDepartmentZone } from "./mockData";

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
    
    // Get the user's department (either from preferences or user object)
    const userDepartment = preferences.department || user.team;
    
    if (!userDepartment) {
      // If no department is specified, use general recommendations
      return getGeneralRecommendations(user, availableSeats, preferences);
    }
    
    // Get department zone info
    const departmentZone = DEPARTMENT_ZONES[userDepartment];
    if (!departmentZone) {
      // Department not found in zones config, use general recommendations
      return getGeneralRecommendations(user, availableSeats, preferences);
    }
    
    // Step 1: Filter available seats only
    const allAvailableSeats = availableSeats.filter(
      seat => seat.status === 'available' || seat.status === 'reserved'
    );
    
    // Step 2: Prioritize seats by location relative to department
    const prioritizedSeats = prioritizeSeatsForDepartment(
      allAvailableSeats,
      userDepartment,
      departmentZone,
      preferences
    );
    
    // Step 3: Take the top recommendations (max 3)
    const topRecommendations = prioritizedSeats.slice(0, 3);
    
    if (topRecommendations.length === 0) {
      return {
        recommendation: {
          message: `No seats currently available that match your criteria. Please try adjusting your preferences or check back later.`,
        }
      };
    }
    
    // Get the section of the top recommendation for messaging
    const topSection = topRecommendations[0].section;
    const topFloor = topRecommendations[0].floor;
    
    // Check if the top recommendation is in the department's primary zone
    const isInDepartmentZone = departmentZone.sections.includes(topSection) && 
                               topFloor === departmentZone.floor;
    
    let locationDescription = '';
    if (isInDepartmentZone) {
      locationDescription = `in your ${userDepartment} department zone (Section ${topSection})`;
    } else if (topFloor === departmentZone.floor) {
      locationDescription = `near your ${userDepartment} department zone (Section ${topSection})`;
    } else {
      locationDescription = `on floor ${topFloor} in Section ${topSection}`;
    }
    
    return {
      recommendation: {
        seatIds: topRecommendations.map(seat => seat.id),
        message: `Based on your preferences and ${userDepartment} department, I recommend these seats ${locationDescription}. ${getRecommendationReasoning(topRecommendations[0], preferences)}.`,
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

/**
 * Prioritize seats for a specific department following the priority algorithm:
 * 1. Exact department section and floor
 * 2. Adjacent seats in the same section
 * 3. Other sections on the same floor
 * 4. Other floors
 */
const prioritizeSeatsForDepartment = (
  availableSeats: Seat[],
  department: string,
  departmentZone: { floor: number, sections: string[] },
  preferences: {
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
    nearTeam?: boolean;
  }
): Seat[] => {
  // Create priority groups for seats
  const exactDepartmentZone: Seat[] = [];
  const adjacentInSameSection: Seat[] = [];
  const otherSectionsOnSameFloor: Seat[] = [];
  const otherFloors: Seat[] = [];
  const nearTeamSeats: Seat[] = [];
  
  // Group all seats by priority
  availableSeats.forEach(seat => {
    // Check if seat matches amenity preferences
    if (preferences.amenities && preferences.amenities.length > 0) {
      if (!preferences.amenities.every(amenity => seat.amenities.includes(amenity))) {
        return; // Skip seats that don't match amenity preferences
      }
    }
    
    // Check if user specified a specific floor or section preference
    // These take precedence over department-based allocation if specified
    if (preferences.preferredFloor !== undefined && seat.floor !== preferences.preferredFloor) {
      return; // Skip seats that don't match preferred floor
    }
    
    if (preferences.preferredSection && seat.section !== preferences.preferredSection) {
      return; // Skip seats that don't match preferred section
    }
    
    // NEW FEATURE: Team proximity check
    if (preferences.nearTeam && seat.nearTeam === department) {
      nearTeamSeats.push(seat);
    }
    
    // Now group by department priority
    const isInPrimaryZone = departmentZone.sections.includes(seat.section) && 
                           seat.floor === departmentZone.floor;
                           
    if (isInPrimaryZone) {
      exactDepartmentZone.push(seat);
    } else if (seat.floor === departmentZone.floor) {
      if (departmentZone.sections.includes(seat.section)) {
        // Same section but not primary zone (later seats in same section)
        adjacentInSameSection.push(seat);
      } else {
        // Different section but same floor
        otherSectionsOnSameFloor.push(seat);
      }
    } else {
      // Different floor
      otherFloors.push(seat);
    }
  });
  
  // Sort each group by quality (amenities, etc.)
  const sortByQuality = (seats: Seat[]) => {
    return seats.sort((a, b) => {
      const scoreA = getSeatScore(a, preferences);
      const scoreB = getSeatScore(b, preferences);
      // If scores are equal, sort by name for deterministic results
      if (scoreB === scoreA) {
        return a.name.localeCompare(b.name);
      }
      return scoreB - scoreA;
    });
  };
  
  // Sort each category by quality
  const sortedNearTeam = sortByQuality(nearTeamSeats);
  const sortedExactZone = sortByQuality(exactDepartmentZone);
  const sortedAdjacent = sortByQuality(adjacentInSameSection);
  const sortedOtherSections = sortByQuality(otherSectionsOnSameFloor);
  const sortedOtherFloors = sortByQuality(otherFloors);
  
  // New feature: Proximity to team is highest priority when enabled
  if (preferences.nearTeam && sortedNearTeam.length > 0) {
    // Prioritize team proximity over department zone when that preference is set
    return sortedNearTeam;
  }
  
  // Combine all groups by priority - UPDATED to implement the fallback system
  // If no seats are available in the department zone, it will automatically
  // allocate the next best possible nearby seats
  return [
    ...sortedExactZone,
    ...sortedAdjacent,
    ...sortedOtherSections,
    ...sortedOtherFloors
  ];
};

/**
 * Fallback method for general recommendations (no department priority)
 */
const getGeneralRecommendations = (
  user: User,
  availableSeats: Seat[],
  preferences: {
    department?: string;
    nearTeam?: boolean;
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
  }
): AiResponse => {
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
    // Try to find seats near the team first
    const nearTeamSeats = recommendedSeats.filter(
      seat => seat.nearTeam === preferences.department
    );
    
    // If seats near team are available, prioritize those
    if (nearTeamSeats.length > 0) {
      recommendedSeats = nearTeamSeats;
    }
    // Otherwise, keep the filtered seats (automatic fallback)
  }
  
  // Sort by best match
  recommendedSeats.sort((a, b) => {
    // Simple scoring algorithm
    const scoreA = getSeatScore(a, preferences);
    const scoreB = getSeatScore(b, preferences);
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
  
  // Create a message mentioning team proximity if relevant
  let message = `Based on your general preferences, I recommend these seats which provide ${getRecommendationReasoning(topRecommendations[0], preferences)}.`;
  
  if (preferences.nearTeam && topRecommendations[0].nearTeam === preferences.department) {
    message = `I found seats near your ${preferences.department} team members that match your preferences.`;
  }
  
  return {
    recommendation: {
      seatIds: topRecommendations.map(seat => seat.id),
      message: message,
    }
  };
};

// Helper function to generate a score for a seat based on preferences
const getSeatScore = (
  seat: Seat, 
  preferences: {
    preferredFloor?: number;
    preferredSection?: string;
    amenities?: string[];
    nearTeam?: boolean;
    department?: string;
  }
): number => {
  let score = 0;
  
  // Match floor preference
  if (preferences.preferredFloor !== undefined && seat.floor === preferences.preferredFloor) {
    score += 3;
  }
  
  // Match section preference
  if (preferences.preferredSection && seat.section === preferences.preferredSection) {
    score += 2;
  }
  
  // Match amenities
  if (preferences.amenities) {
    preferences.amenities.forEach(amenity => {
      if (seat.amenities.includes(amenity)) {
        score += 1;
      }
    });
  }
  
  // NEW: Score boost for team proximity
  if (preferences.nearTeam && preferences.department && seat.nearTeam === preferences.department) {
    score += 5; // High priority for team proximity
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
