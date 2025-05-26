import { useState, useEffect } from 'react';
import {
  DEFAULT_DETOX_SETTINGS,
  DetoxSettings,
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
} from '../utils/storage';

export const useDetoxSettings = () => {
  const [settings, setSettings] = useState<DetoxSettings>(DEFAULT_DETOX_SETTINGS);
  const [loading, setLoading] = useState(true);
  
  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await getStorageItem(STORAGE_KEYS.DETOX_SETTINGS);
        if (storedSettings) {
          setSettings(storedSettings);
        }
      } catch (error) {
        console.error('Error loading detox settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings to storage whenever they change
  const updateSettings = async (newSettings: Partial<DetoxSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await setStorageItem(STORAGE_KEYS.DETOX_SETTINGS, updatedSettings);
      return true;
    } catch (error) {
      console.error('Error updating detox settings:', error);
      return false;
    }
  };
  
  // Toggle enabled state
  const toggleEnabled = async () => {
    return await updateSettings({ enabled: !settings.enabled });
  };
  
  // Update start time
  const updateStartTime = async (startTime: string) => {
    return await updateSettings({ startTime });
  };
  
  // Update end time
  const updateEndTime = async (endTime: string) => {
    return await updateSettings({ endTime });
  };
  
  // Toggle a day in the active days array
  const toggleActiveDay = async (day: number) => {
    const activeDays = [...settings.activeDays];
    const index = activeDays.indexOf(day);
    
    if (index === -1) {
      // Add the day if it's not already active
      activeDays.push(day);
    } else {
      // Remove the day if it's already active
      activeDays.splice(index, 1);
    }
    
    return await updateSettings({ activeDays });
  };
  
  // Reset settings to defaults
  const resetSettings = async () => {
    return await updateSettings(DEFAULT_DETOX_SETTINGS);
  };
  
  return {
    settings,
    loading,
    updateSettings,
    toggleEnabled,
    updateStartTime,
    updateEndTime,
    toggleActiveDay,
    resetSettings,
  };
};