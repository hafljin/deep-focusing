import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { Card } from './Card';
import { Flame } from 'lucide-react-native';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  totalDays,
}) => {
  return (
    <Card variant="elevated" style={styles.container}>
      <View style={styles.streakHeader}>
        <Flame size={24} color={currentStreak > 0 ? Colors.accent[500] : Colors.neutral[400]} />
        <Text style={styles.streakTitle}>Your Streak</Text>
      </View>
      
      <View style={styles.streakValue}>
        <Text style={styles.streakCount}>{currentStreak}</Text>
        <Text style={styles.streakDays}>days</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalDays}</Text>
          <Text style={styles.statLabel}>Total Detox Days</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginLeft: Layout.spacing.sm,
  },
  streakValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: Layout.spacing.sm,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  streakDays: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.neutral[600],
    marginLeft: Layout.spacing.xs,
    marginBottom: Layout.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginVertical: Layout.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.neutral[200],
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral[800],
  },
  statLabel: {
    fontSize: 14,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
});