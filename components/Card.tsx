import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outline' | 'elevated';
  padding?: keyof typeof Layout.spacing | number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
}) => {
  const getCardStyles = (): ViewStyle[] => {
    const styles: ViewStyle[] = [cardStyles.base];
    
    // Determine padding value
    const paddingValue = typeof padding === 'number' 
      ? padding 
      : Layout.spacing[padding];
    
    styles.push({ padding: paddingValue });
    
    // Add variant-specific styles
    switch (variant) {
      case 'default':
        styles.push(cardStyles.default);
        break;
      case 'outline':
        styles.push(cardStyles.outline);
        break;
      case 'elevated':
        styles.push(cardStyles.elevated);
        break;
    }
    
    return styles;
  };
  
  return (
    <View style={[...getCardStyles(), style]}>
      {children}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  base: {
    borderRadius: Layout.borderRadius.lg,
    backgroundColor: Colors.background,
  },
  default: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  elevated: {
    backgroundColor: Colors.background,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});