import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

// Create an animated circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 200,
  strokeWidth = 15,
  color = Colors.primary[500],
  backgroundColor = Colors.neutral[100],
  children,
}) => {
  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Create animated value for the progress
  const progressValue = useSharedValue(0);
  
  // Update the animation when progress changes
  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, progressValue]);
  
  // Create animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progressValue.value);
    return { strokeDashoffset };
  });
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotateZ: '-90deg' }],
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});