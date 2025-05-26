// Format time string (HH:MM) to readable format
export const formatTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format');
    }
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

// Get current time in HH:MM format
export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Check if current time is within detox period
export const isDetoxActive = (startTime: string, endTime: string): boolean => {
  try {
    const currentTime = getCurrentTime();
    return isTimeInRange(currentTime, startTime, endTime);
  } catch (error) {
    console.error('Error checking if detox is active:', error);
    return false;
  }
};

// Check if time is within range
export const isTimeInRange = (
  time: string,
  startTime: string,
  endTime: string
): boolean => {
  try {
    // Convert all times to minutes since midnight for easier comparison
    const timeMinutes = convertTimeToMinutes(time);
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    
    if (startMinutes <= endMinutes) {
      // Simple case: start time is before end time
      return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    } else {
      // Complex case: end time is on the next day (e.g., 22:00 to 06:00)
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }
  } catch (error) {
    console.error('Error checking if time is in range:', error);
    return false;
  }
};

// Convert time (HH:MM) to minutes since midnight
export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Get remaining time in detox period (in minutes)
export const getRemainingDetoxTime = (
  currentTime: string,
  endTime: string
): number => {
  try {
    const currentMinutes = convertTimeToMinutes(currentTime);
    const endMinutes = convertTimeToMinutes(endTime);
    
    if (endMinutes >= currentMinutes) {
      return endMinutes - currentMinutes;
    } else {
      // End time is on the next day
      return endMinutes + (24 * 60) - currentMinutes;
    }
  } catch (error) {
    console.error('Error calculating remaining detox time:', error);
    return 0;
  }
};

// Format minutes to HH:MM display
export const formatMinutesToHoursAndMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Get day of week (1-7, Monday-Sunday)
export const getDayOfWeek = (date: Date = new Date()): number => {
  const day = date.getDay();
  return day === 0 ? 7 : day; // Convert Sunday from 0 to 7
};

// Check if detox should be active today based on activeDays setting
export const isDetoxDay = (activeDays: number[]): boolean => {
  const today = getDayOfWeek();
  return activeDays.includes(today);
};

// Format date to readable string (e.g., "Monday, January 1")
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// Get today's date as ISO string (YYYY-MM-DD)
export const getTodayISODate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};