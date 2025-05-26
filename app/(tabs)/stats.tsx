import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressCircle } from '@/components/ProgressCircle';
import { useDetoxStats } from '@/hooks/useDetoxStats';
import { ChartBar as BarChart, Calendar, Trophy, Clock, Battery, Smartphone } from 'lucide-react-native';

// Mock data for charts
const generateWeeklyData = () => {
  return [
    { day: 'Mon', completed: true, minutes: 180 },
    { day: 'Tue', completed: true, minutes: 180 },
    { day: 'Wed', completed: false, minutes: 60 },
    { day: 'Thu', completed: true, minutes: 180 },
    { day: 'Fri', completed: true, minutes: 180 },
    { day: 'Sat', completed: true, minutes: 180 },
    { day: 'Sun', completed: true, minutes: 180 },
  ];
};

export default function StatsScreen() {
  const { stats } = useDetoxStats();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');
  
  const weeklyData = generateWeeklyData();
  
  // Calculate completion percentage
  const completionRate = weeklyData.filter(day => day.completed).length / weeklyData.length;
  
  // Calculate total detox time (in hours)
  const totalDetoxTime = weeklyData.reduce((total, day) => total + day.minutes, 0) / 60;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.subtitle}>Track your digital detox progress</Text>
      </View>
      
      <View style={styles.timeframeSelector}>
        <Button
          title="Week"
          variant={selectedTimeframe === 'week' ? 'primary' : 'outline'}
          onPress={() => setSelectedTimeframe('week')}
          style={styles.timeframeButton}
        />
        <Button
          title="Month"
          variant={selectedTimeframe === 'month' ? 'primary' : 'outline'}
          onPress={() => setSelectedTimeframe('month')}
          style={styles.timeframeButton}
        />
      </View>
      
      <View style={styles.statsRow}>
        <Card variant="elevated" style={Object.assign({}, styles.statCard, styles.halfCard)}>
          <View style={styles.statHeader}>
            <Trophy size={20} color={Colors.primary[500]} />
            <Text style={styles.statTitle}>Current Streak</Text>
          </View>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statSubtext}>days</Text>
        </Card>
        
        <Card variant="elevated" style={Object.assign({}, styles.statCard, styles.halfCard)}>
          <View style={styles.statHeader}>
            <Clock size={20} color={Colors.secondary[400]} />
            <Text style={styles.statTitle}>Detox Time</Text>
          </View>
          <Text style={styles.statValue}>{totalDetoxTime.toFixed(1)}</Text>
          <Text style={styles.statSubtext}>hours this week</Text>
        </Card>
      </View>
      
      <Card variant="elevated" style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <View style={styles.statHeader}>
            <Calendar size={20} color={Colors.primary[500]} />
            <Text style={styles.statTitle}>Completion Rate</Text>
          </View>
          <Text style={styles.completionRate}>
            {(completionRate * 100).toFixed(0)}%
          </Text>
        </View>
        
        <View style={styles.completionChartContainer}>
          <ProgressCircle
            progress={completionRate}
            size={120}
            strokeWidth={12}
            color={completionRate >= 0.7 ? Colors.success[500] : Colors.warning[500]}
          >
            <Text style={styles.completionChartText}>
              {(completionRate * 100).toFixed(0)}%
            </Text>
          </ProgressCircle>
          
          <View style={styles.weeklyChart}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.dayColumn}>
                <View 
                  style={[
                    styles.dayBar, 
                    { 
                      height: (item.minutes / 180) * 100,
                      backgroundColor: item.completed ? Colors.primary[500] : Colors.neutral[300]
                    }
                  ]} 
                />
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
      
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Insights</Text>
        
        <Card variant="outline" style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Battery size={20} color={Colors.success[500]} />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Battery Life Improved</Text>
            <Text style={styles.insightText}>
              Your phone's battery lasts 22% longer on detox days.
            </Text>
          </View>
        </Card>
        
        <Card variant="outline" style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Smartphone size={20} color={Colors.primary[500]} />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Usage Reduced</Text>
            <Text style={styles.insightText}>
              You've reduced morning screen time by 87% this week.
            </Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // 落ち着いたグレー
  },
  header: {
    padding: Layout.spacing.xl,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: '#263238', // 濃いグレー
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#607D8B', // 落ち着いたブルーグレー
    marginTop: Layout.spacing.xs,
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.xl,
  },
  timeframeButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
    backgroundColor: '#F8FAFB', // カードも淡いグレー
    borderRadius: 16,
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  halfCard: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  statTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F', // 濃いグレー
    marginLeft: Layout.spacing.xs,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    fontWeight: '700',
    color: '#263238',
  },
  statSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#78909C', // 落ち着いたブルーグレー
  },
  completionCard: {
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    backgroundColor: '#F8FAFB',
    borderRadius: 16,
    shadowColor: '#B0BEC5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  completionRate: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#263238',
  },
  completionChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completionChartText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: '#263238',
  },
  weeklyChart: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
    marginLeft: Layout.spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dayColumn: {
    alignItems: 'center',
    width: '12%',
  },
  dayBar: {
    width: '70%',
    minHeight: 4,
    backgroundColor: '#90A4AE', // 落ち着いたブルーグレー
    borderRadius: Layout.borderRadius.sm,
  },
  dayLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#78909C',
    marginTop: Layout.spacing.xs,
  },
  insightsSection: {
    padding: Layout.spacing.xl,
    paddingTop: 0,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: '#37474F',
    marginBottom: Layout.spacing.md,
  },
  insightCard: {
    flexDirection: 'row',
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    backgroundColor: '#F8FAFB',
    borderRadius: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: Layout.spacing.xs,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#607D8B',
  },
});