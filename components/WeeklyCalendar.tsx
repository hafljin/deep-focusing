import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { Card } from './Card';

interface Day {
  date: Date;
  isToday: boolean;
  completed: boolean;
}

interface WeeklyCalendarProps {
  days: Day[];
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ days }) => {
  // Helper function to format day of week
  const formatDayOfWeek = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 1);
  };
  
  // Helper function to format day of month
  const formatDayOfMonth = (date: Date): string => {
    return date.getDate().toString();
  };
  
  return (
    <Card variant="elevated" style={styles.container}>
      <Text style={styles.title}>This Week</Text>
      
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={[
              styles.dayOfWeek,
              day.isToday && styles.todayText,
            ]}>
              {formatDayOfWeek(day.date)}
            </Text>
            
            <View style={[
              styles.dateCircle,
              day.isToday && styles.todayCircle,
              day.completed && styles.completedCircle,
            ]}>
              <Text style={[
                styles.dayOfMonth,
                day.isToday && styles.todayText,
                day.completed && styles.completedText,
              ]}>
                {formatDayOfMonth(day.date)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: Layout.spacing.md,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginBottom: Layout.spacing.xs,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[100],
  },
  dayOfMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  todayCircle: {
    backgroundColor: Colors.primary[500],
  },
  todayText: {
    color: Colors.neutral[50],
  },
  completedCircle: {
    backgroundColor: Colors.success[500],
  },
  completedText: {
    color: Colors.neutral[50],
  },
});