import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { TimePicker } from '@/components/TimePicker';
import { Lamp, Moon, Sunrise, Clock, PhoneOff, Trophy } from 'lucide-react-native';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content?: React.ReactNode;
}

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState('06:00');
  const [endTime, setEndTime] = useState('09:00');
  
  // Onboarding slides data
  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'Welcome to Digital Detox',
      description: 'Take control of your screen time and start your day with intention, not distraction.',
      icon: <Lamp size={64} color={Colors.primary[500]} />,
    },
    {
      id: '2',
      title: 'Morning Lock',
      description: 'We\'ll lock your phone during the critical morning hours to help you start your day mindfully.',
      icon: <Sunrise size={64} color={Colors.primary[500]} />,
    },
    {
      id: '3',
      title: 'Set Your Detox Schedule',
      description: 'Choose when you want your phone to be locked. We recommend 6:00 AM to 9:00 AM for optimal results.',
      icon: <Clock size={64} color={Colors.primary[500]} />,
      content: (
        <View style={styles.timePickerContainer}>
          <View style={styles.timePicker}>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
            />
          </View>
          <View style={styles.timePicker}>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
            />
          </View>
        </View>
      ),
    },
    {
      id: '4',
      title: 'Build a Streak',
      description: 'Track your progress and build a streak of mindful mornings. The longer your streak, the more benefits you\'ll see.',
      icon: <Trophy size={64} color={Colors.primary[500]} />,
    },
  ];
  
  // Handle next slide
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };
  
  // Handle scroll event
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };
  
  // Complete onboarding and navigate to home
  const completeOnboarding = async () => {
    try {
      // Save onboarding completion status
      await setStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      
      // Save detox settings
      await setStorageItem(STORAGE_KEYS.DETOX_SETTINGS, {
        enabled: true,
        startTime,
        endTime,
        activeDays: [1, 2, 3, 4, 5, 6, 7], // All days of the week
      });
      
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  // Render slide item
  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        {item.content}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        <Button
          title={currentIndex < slides.length - 1 ? 'Next' : 'Get Started'}
          onPress={handleNext}
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  iconContainer: {
    marginBottom: Layout.spacing.xl,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  timePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: Layout.spacing.lg,
  },
  timePicker: {
    width: '48%',
  },
  footer: {
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[300],
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary[500],
    width: 20,
  },
});