import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/Button';
import { ProgressCircle } from '@/components/ProgressCircle';
import { router } from 'expo-router';
import { useDetoxSettings } from '@/hooks/useDetoxSettings';
import { useDetoxStats } from '@/hooks/useDetoxStats';
import {
  getCurrentTime,
  getRemainingDetoxTime,
  formatMinutesToHoursAndMinutes,
  isTimeInRange,
} from '@/utils/time';
import { ShieldCheck, ShieldAlert, Lock, Coffee, Brain } from 'lucide-react-native';

export default function LockScreen() {
  const { settings } = useDetoxSettings();
  const { resetStreak } = useDetoxStats();
  
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [bypassAttempts, setBypassAttempts] = useState(0);
  
  // Calculate remaining time and progress
  const totalDetoxMinutes = getRemainingDetoxTime(settings.startTime, settings.endTime);
  const remainingMinutes = getRemainingDetoxTime(currentTime, settings.endTime);
  const elapsedMinutes = totalDetoxMinutes - remainingMinutes;
  const progress = Math.min(elapsedMinutes / totalDetoxMinutes, 1);
  
  // Update time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTime = getCurrentTime();
      setCurrentTime(newTime);
      
      // Check if detox period is over
      if (!isTimeInRange(newTime, settings.startTime, settings.endTime)) {
        router.replace('/(tabs)');
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [settings.startTime, settings.endTime]);
  
  // Handle bypass attempt
  const handleBypassAttempt = () => {
    setBypassAttempts(prev => prev + 1);
    
    if (bypassAttempts >= 2) {
      // Reset streak when user bypasses lock
      resetStreak();
      router.replace('/(tabs)');
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {bypassAttempts === 0 ? (
          <ShieldCheck size={32} color={Colors.primary[500]} />
        ) : (
          <ShieldAlert size={32} color={Colors.warning[500]} />
        )}
        <Text style={styles.headerTitle}>Digital Detox Active</Text>
      </View>
      
      <View style={styles.content}>
        <ProgressCircle
          progress={progress}
          size={260}
          strokeWidth={15}
          color={Colors.primary[500]}
        >
          <View style={styles.progressContent}>
            <Lock size={36} color={Colors.primary[500]} />
            <Text style={styles.timeRemaining}>
              {formatMinutesToHoursAndMinutes(remainingMinutes)}
            </Text>
            <Text style={styles.timeRemainingLabel}>remaining</Text>
          </View>
        </ProgressCircle>
        
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Your phone is locked to help you start your day mindfully. Try these instead:
          </Text>
          
          <View style={styles.suggestionList}>
            <View style={styles.suggestion}>
              <Coffee size={24} color={Colors.secondary[400]} />
              <Text style={styles.suggestionText}>
                Enjoy your morning coffee
              </Text>
            </View>
            
            <View style={styles.suggestion}>
              <Brain size={24} color={Colors.secondary[400]} />
              <Text style={styles.suggestionText}>
                Meditate for 5-10 minutes
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Emergency Bypass"
          variant="outline"
          onPress={handleBypassAttempt}
          style={styles.bypassButton}
        />
        
        {bypassAttempts > 0 && (
          <Text style={styles.bypassWarning}>
            Warning: Bypassing will reset your streak. 
            {bypassAttempts === 1 ? ' (1 more tap to confirm)' : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Layout.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginLeft: Layout.spacing.sm,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRemaining: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginTop: Layout.spacing.sm,
  },
  timeRemainingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[600],
  },
  messageContainer: {
    marginTop: Layout.spacing.xl,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  message: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral[700],
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  suggestionList: {
    marginTop: Layout.spacing.md,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[800],
    marginLeft: Layout.spacing.md,
  },
  footer: {
    marginTop: Layout.spacing.xl,
  },
  bypassButton: {
    marginBottom: Layout.spacing.sm,
  },
  bypassWarning: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.warning[500],
    textAlign: 'center',
  },
});