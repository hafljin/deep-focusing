import { Platform } from 'react-native';

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  DETOX_SETTINGS: 'detox_settings',
  DETOX_STATS: 'detox_stats',
  DETOX_HISTORY: 'detox_history',
};

// Default detox settings
export const DEFAULT_DETOX_SETTINGS = {
  enabled: true,
  startTime: '06:00', // 6:00 AM
  endTime: '09:00', // 9:00 AM
  activeDays: [1, 2, 3, 4, 5, 6, 7], // All days of the week (1=Monday, 7=Sunday)
};

// Interface for detox settings
export interface DetoxSettings {
  enabled: boolean;
  startTime: string; // Format: 'HH:MM'
  endTime: string; // Format: 'HH:MM'
  activeDays: number[]; // Days of the week when detox is active (1-7)
}

// Interface for detox stats
export interface DetoxStats {
  currentStreak: number;
  longestStreak: number;
  totalDetoxDays: number;
  lastCompletedDate: string | null; // ISO date string
}

// Default detox stats
export const DEFAULT_DETOX_STATS: DetoxStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalDetoxDays: 0,
  lastCompletedDate: null,
};

// Interface for detox day history
export interface DetoxDayHistory {
  date: string; // ISO date string
  completed: boolean;
  startTime: string;
  endTime: string;
  bypassCount: number;
}

// Get data from storage
export const getStorageItem = async (key: string) => {
  try {
    if (Platform.OS === 'web') {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else {
      // For mobile platforms, we would typically use AsyncStorage
      // For this demo, we'll simulate it using a mock implementation
      return null;
    }
  } catch (error) {
    console.error('Error getting data from storage:', error);
    return null;
  }
};

// Save data to storage
export const setStorageItem = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    if (Platform.OS === 'web') {
      localStorage.setItem(key, jsonValue);
    } else {
      // For mobile platforms, we would typically use AsyncStorage
      // For this demo, we'll simulate it
    }
  } catch (error) {
    console.error('Error saving data to storage:', error);
  }
};