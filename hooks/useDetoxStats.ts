import { useState, useEffect } from 'react';
import {
  DEFAULT_DETOX_STATS,
  DetoxStats,
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
} from '../utils/storage';
import { getTodayISODate } from '../utils/time';

export const useDetoxStats = () => {
  const [stats, setStats] = useState<DetoxStats>(DEFAULT_DETOX_STATS);
  const [loading, setLoading] = useState(true);
  
  // Load stats from storage on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedStats = await getStorageItem(STORAGE_KEYS.DETOX_STATS);
        if (storedStats) {
          setStats(storedStats);
        }
      } catch (error) {
        console.error('Error loading detox stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  // Save stats to storage whenever they change
  const updateStats = async (newStats: Partial<DetoxStats>) => {
    try {
      const updatedStats = { ...stats, ...newStats };
      setStats(updatedStats);
      await setStorageItem(STORAGE_KEYS.DETOX_STATS, updatedStats);
      return true;
    } catch (error) {
      console.error('Error updating detox stats:', error);
      return false;
    }
  };
  
  // Mark today as a completed detox day
  const completeDetoxDay = async () => {
    const today = getTodayISODate();
    
    // If already completed today, do nothing
    if (stats.lastCompletedDate === today) {
      return true;
    }
    
    // Check if the last completed date was yesterday to continue the streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];
    
    let currentStreak = stats.currentStreak;
    
    // If last completion was yesterday, increment streak
    // Otherwise, reset streak to 1 (today only)
    if (stats.lastCompletedDate === yesterdayISO) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    
    // Calculate longest streak
    const longestStreak = Math.max(currentStreak, stats.longestStreak);
    
    return await updateStats({
      currentStreak,
      longestStreak,
      totalDetoxDays: stats.totalDetoxDays + 1,
      lastCompletedDate: today,
    });
  };
  
  // Reset streak (e.g., if user bypasses detox)
  const resetStreak = async () => {
    return await updateStats({
      currentStreak: 0,
    });
  };
  
  // Reset all stats
  const resetStats = async () => {
    return await updateStats(DEFAULT_DETOX_STATS);
  };
  
  return {
    stats,
    loading,
    updateStats,
    completeDetoxDay,
    resetStreak,
    resetStats,
  };
};