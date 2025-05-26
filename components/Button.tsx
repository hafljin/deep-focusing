import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  // Determine container styles based on variant and size
  const getContainerStyles = (): ViewStyle[] => {
    const styles: ViewStyle[] = [buttonStyles.base];
    
    // Add variant-specific styles
    switch (variant) {
      case 'primary':
        styles.push(buttonStyles.primary);
        break;
      case 'secondary':
        styles.push(buttonStyles.secondary);
        break;
      case 'outline':
        styles.push(buttonStyles.outline);
        break;
      case 'danger':
        styles.push(buttonStyles.danger);
        break;
      case 'ghost':
        styles.push(buttonStyles.ghost);
        break;
    }
    
    // Add size-specific styles
    switch (size) {
      case 'small':
        styles.push(buttonStyles.small);
        break;
      case 'medium':
        styles.push(buttonStyles.medium);
        break;
      case 'large':
        styles.push(buttonStyles.large);
        break;
    }
    
    // Add full width style if needed
    if (fullWidth) {
      styles.push(buttonStyles.fullWidth);
    }
    
    // Add disabled style if needed
    if (disabled || loading) {
      styles.push(buttonStyles.disabled);
    }
    
    return styles;
  };
  
  // Determine text styles based on variant and size
  const getTextStyles = (): TextStyle[] => {
    const styles: TextStyle[] = [buttonStyles.textBase];
    
    // Add variant-specific text styles
    switch (variant) {
      case 'primary':
        styles.push(buttonStyles.textPrimary);
        break;
      case 'secondary':
        styles.push(buttonStyles.textSecondary);
        break;
      case 'outline':
        styles.push(buttonStyles.textOutline);
        break;
      case 'danger':
        styles.push(buttonStyles.textDanger);
        break;
      case 'ghost':
        styles.push(buttonStyles.textGhost);
        break;
    }
    
    // Add size-specific text styles
    switch (size) {
      case 'small':
        styles.push(buttonStyles.textSmall);
        break;
      case 'medium':
        styles.push(buttonStyles.textMedium);
        break;
      case 'large':
        styles.push(buttonStyles.textLarge);
        break;
    }
    
    // Add disabled text style if needed
    if (disabled || loading) {
      styles.push(buttonStyles.textDisabled);
    }
    
    return styles;
  };
  
  // Determine loading indicator color based on variant
  const getLoadingColor = (): string => {
    switch (variant) {
      case 'primary':
        return Colors.neutral[50];
      case 'secondary':
        return Colors.neutral[50];
      case 'danger':
        return Colors.neutral[50];
      case 'outline':
        return Colors.primary[500];
      case 'ghost':
        return Colors.primary[500];
      default:
        return Colors.neutral[50];
    }
  };
  
  return (
    <TouchableOpacity
      style={[...getContainerStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[...getTextStyles(), textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  // Variant styles
  primary: {
    backgroundColor: Colors.primary[500],
  },
  secondary: {
    backgroundColor: Colors.secondary[400],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  danger: {
    backgroundColor: Colors.error[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Size styles
  small: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
  },
  medium: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
  },
  large: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
  },
  // Width styles
  fullWidth: {
    width: '100%',
  },
  // Disabled style
  disabled: {
    opacity: 0.5,
  },
  // Text base style
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Text variant styles
  textPrimary: {
    color: Colors.neutral[50],
  },
  textSecondary: {
    color: Colors.neutral[50],
  },
  textOutline: {
    color: Colors.primary[500],
  },
  textDanger: {
    color: Colors.neutral[50],
  },
  textGhost: {
    color: Colors.primary[500],
  },
  // Text size styles
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  // Text disabled style
  textDisabled: {
    opacity: 0.8,
  },
});