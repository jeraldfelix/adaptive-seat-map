// Seat types and statuses
export type SeatStatus = 'available' | 'booked' | 'reserved' | 'occupied';

export interface Seat {
  id: string;
  name: string;
  status: SeatStatus;
  assignedTo?: string;
  floor: number;
  section: string;
  amenities: string[];
  nearTeam?: string;
  departmentZone?: string; // Added department zone field
}

export interface Office {
  id: string;
  name: string;
  floors: number[];
  sections: Record<number, string[]>;
  teams: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  role: 'user' | 'admin';
  team?: string;
  preferences: {
    preferredFloor?: number;
    preferredSection?: string;
    amenities: string[];
  };
  currentSeat?: string;
  bookingHistory: {
    seatId: string;
    date: string;
    status: 'completed' | 'cancelled' | 'upcoming';
  }[];
}

export interface UtilizationData {
  date: string;
  occupancyRate: number;
  bookingRate: number;
}

// Mock data
export const MOCK_OFFICE: Office = {
  id: 'office-1',
  name: 'Headquarters',
  floors: [1, 2, 3],
  sections: {
    1: ['A', 'B', 'C', 'D'],
    2: ['A', 'B', 'C', 'D'],
    3: ['A', 'B', 'C']
  },
  teams: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Leadership']
};

// Department zone mapping for the office
export const DEPARTMENT_ZONES: Record<string, { floor: number, sections: string[] }> = {
  'Engineering': { floor: 1, sections: ['A', 'B'] },
  'Design': { floor: 1, sections: ['C', 'D'] },
  'Marketing': { floor: 2, sections: ['A'] },
  'Sales': { floor: 2, sections: ['B'] },
  'HR': { floor: 2, sections: ['C'] },
  'Finance': { floor: 2, sections: ['D'] },
  'Product': { floor: 3, sections: ['A'] },
  'Leadership': { floor: 3, sections: ['B', 'C'] }
};

// Function to check if a seat is within a department zone
export const isSeatInDepartmentZone = (seat: Seat, department: string): boolean => {
  const zone = DEPARTMENT_ZONES[department];
  if (!zone) return false;
  
  return seat.floor === zone.floor && zone.sections.includes(seat.section);
};

// Function to check if a seat is near a department zone
export const isSeatNearDepartmentZone = (seat: Seat, department: string): boolean => {
  const zone = DEPARTMENT_ZONES[department];
  if (!zone) return false;
  
  // Consider seats on the same floor or adjacent floors as "near"
  const isNearbyFloor = Math.abs(seat.floor - zone.floor) <= 1;
  
  // If on the same floor, consider adjacent sections as "near"
  if (seat.floor === zone.floor) {
    // Different section but on same floor is considered nearby
    return !zone.sections.includes(seat.section);
  }
  
  // If on a different but adjacent floor, it's considered nearby
  return isNearbyFloor;
};

export const MOCK_SEATS: Seat[] = Array.from({ length: 80 }, (_, i) => {
  const floor = Math.floor(i / 30) + 1;
  const sectionIndex = Math.floor((i % 30) / 8);
  const section = MOCK_OFFICE.sections[floor][sectionIndex];
  const seatNumber = (i % 8) + 1;
  
  // Randomly assign seat statuses
  const statusOptions: SeatStatus[] = ['available', 'booked', 'reserved', 'occupied'];
  const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  
  // Randomly assign amenities
  const allAmenities = ['window', 'standing desk', 'dual monitor', 'ergonomic chair', 'near kitchen', 'near meeting room'];
  const amenities = allAmenities.filter(() => Math.random() > 0.7);
  
  // Randomly assign a team for team-based allocation
  const randomTeamIndex = Math.floor(Math.random() * MOCK_OFFICE.teams.length);
  const nearTeam = Math.random() > 0.5 ? MOCK_OFFICE.teams[randomTeamIndex] : undefined;
  
  // Assign department zone based on floor and section
  let departmentZone: string | undefined = undefined;
  for (const [dept, zone] of Object.entries(DEPARTMENT_ZONES)) {
    if (floor === zone.floor && zone.sections.includes(section)) {
      departmentZone = dept;
      break;
    }
  }
  
  return {
    id: `seat-${i + 1}`,
    name: `${floor}${section}-${seatNumber}`,
    status: randomStatus,
    floor,
    section,
    amenities,
    nearTeam,
    departmentZone,
    assignedTo: randomStatus === 'booked' || randomStatus === 'occupied' ? `user-${Math.floor(Math.random() * 10) + 1}` : undefined
  };
});

export const MOCK_CURRENT_USER: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  profileImage: 'https://i.pravatar.cc/150?u=alex',
  role: 'user',
  team: 'Engineering',
  preferences: {
    preferredFloor: 2,
    preferredSection: 'B',
    amenities: ['window', 'standing desk']
  },
  currentSeat: 'seat-42',
  bookingHistory: [
    { seatId: 'seat-42', date: '2023-06-12', status: 'upcoming' },
    { seatId: 'seat-26', date: '2023-06-05', status: 'completed' },
    { seatId: 'seat-15', date: '2023-05-29', status: 'completed' }
  ]
};

export const MOCK_ADMIN_USER: User = {
  id: 'user-10',
  name: 'Sam Taylor',
  email: 'sam@example.com',
  profileImage: 'https://i.pravatar.cc/150?u=sam',
  role: 'admin',
  team: 'Leadership',
  preferences: {
    amenities: ['dual monitor', 'ergonomic chair']
  },
  bookingHistory: []
};

export const MOCK_UTILIZATION_DATA: UtilizationData[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 13 + i);
  
  return {
    date: date.toISOString().split('T')[0],
    occupancyRate: 0.4 + Math.random() * 0.4,
    bookingRate: 0.5 + Math.random() * 0.3
  };
});

// Helper functions to simulate API calls
export const fetchSeats = async (floor?: number, section?: string, department?: string): Promise<Seat[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let seats = [...MOCK_SEATS];
  
  if (floor !== undefined) {
    seats = seats.filter(seat => seat.floor === floor);
  }
  
  if (section !== undefined) {
    seats = seats.filter(seat => seat.section === section);
  }
  
  if (department !== undefined) {
    seats = seats.filter(seat => {
      // Get seats that are either in the department zone or have that department as nearTeam
      return seat.departmentZone === department || seat.nearTeam === department;
    });
  }
  
  return seats;
};

export const fetchSeatsByDepartmentZone = async (department: string, includeNearby: boolean = false): Promise<{
  inZone: Seat[],
  nearZone: Seat[]
}> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allSeats = [...MOCK_SEATS];
  
  const inZone = allSeats.filter(seat => 
    isSeatInDepartmentZone(seat, department)
  );
  
  const nearZone = includeNearby ? 
    allSeats.filter(seat => 
      !isSeatInDepartmentZone(seat, department) && 
      isSeatNearDepartmentZone(seat, department)
    ) : [];
  
  return { inZone, nearZone };
};

export const fetchUserInfo = async (userId: string): Promise<User> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (userId === 'user-1') return MOCK_CURRENT_USER;
  if (userId === 'user-10') return MOCK_ADMIN_USER;
  
  throw new Error('User not found');
};

export const fetchUtilizationData = async (): Promise<UtilizationData[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return MOCK_UTILIZATION_DATA;
};

export const bookSeat = async (seatId: string, userId: string): Promise<{ success: boolean }> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simulate successful booking
  return { success: true };
};

export const fetchTeamMembers = async (team: string): Promise<User[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, you would fetch actual team members
  return [MOCK_CURRENT_USER, MOCK_ADMIN_USER].filter(user => user.team === team);
};

export const checkSeatConfirmation = async (bookingId: string): Promise<boolean> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simulate 80% confirmation rate
  return Math.random() > 0.2;
};
