import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/Colors';
import { Layout } from '../constants/Layout';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface TimePickerProps {
  value: string; // Format: 'HH:MM'
  onChange: (time: string) => void;
  label?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
}) => {
  // Parse initial value
  const [hours, minutes] = value.split(':').map(Number);
  
  // State for hours and minutes
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);
  
  // Handle hour change
  const handleHourChange = (increment: boolean) => {
    let newHours = increment ? selectedHours + 1 : selectedHours - 1;
    
    // Handle hour wrapping
    if (newHours < 0) newHours = 23;
    if (newHours > 23) newHours = 0;
    
    setSelectedHours(newHours);
    updateTime(newHours, selectedMinutes);
  };
  
  // Handle minute change
  const handleMinuteChange = (increment: boolean) => {
    let newMinutes = increment ? selectedMinutes + 5 : selectedMinutes - 5;
    
    // Handle minute wrapping
    if (newMinutes < 0) newMinutes = 55;
    if (newMinutes > 55) newMinutes = 0;
    
    setSelectedMinutes(newMinutes);
    updateTime(selectedHours, newMinutes);
  };
  
  // Update the time value
  const updateTime = (hours: number, minutes: number) => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    onChange(`${formattedHours}:${formattedMinutes}`);
  };
  
  // Format time for display
  const formatTimeDisplay = (hours: number, minutes: number): string => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes} ${period}`;
  };
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.pickerContainer}>
        {/* Hours */}
        <View style={styles.column}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleHourChange(true)}
          >
            <ChevronUp color={Colors.primary[500]} size={24} />
          </TouchableOpacity>
          
          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {(selectedHours % 12 || 12).toString()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleHourChange(false)}
          >
            <ChevronDown color={Colors.primary[500]} size={24} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.separator}>:</Text>
        
        {/* Minutes */}
        <View style={styles.column}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleMinuteChange(true)}
          >
            <ChevronUp color={Colors.primary[500]} size={24} />
          </TouchableOpacity>
          
          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {selectedMinutes.toString().padStart(2, '0')}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleMinuteChange(false)}
          >
            <ChevronDown color={Colors.primary[500]} size={24} />
          </TouchableOpacity>
        </View>
        
        {/* AM/PM */}
        <View style={styles.amPmContainer}>
          <TouchableOpacity 
            style={[
              styles.amPmButton, 
              selectedHours < 12 && styles.amPmButtonActive
            ]}
            onPress={() => {
              if (selectedHours >= 12) {
                const newHours = selectedHours - 12;
                setSelectedHours(newHours);
                updateTime(newHours, selectedMinutes);
              }
            }}
          >
            <Text style={[
              styles.amPmText, 
              selectedHours < 12 && styles.amPmTextActive
            ]}>AM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.amPmButton, 
              selectedHours >= 12 && styles.amPmButtonActive
            ]}
            onPress={() => {
              if (selectedHours < 12) {
                const newHours = selectedHours + 12;
                setSelectedHours(newHours);
                updateTime(newHours, selectedMinutes);
              }
            }}
          >
            <Text style={[
              styles.amPmText, 
              selectedHours >= 12 && styles.amPmTextActive
            ]}>PM</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.timeDisplay}>
        {formatTimeDisplay(selectedHours, selectedMinutes)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Layout.spacing.sm,
    color: Colors.neutral[700],
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  column: {
    alignItems: 'center',
  },
  button: {
    padding: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.neutral[100],
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  valueContainer: {
    paddingVertical: Layout.spacing.sm,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.neutral[800],
  },
  separator: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: Layout.spacing.sm,
    color: Colors.neutral[800],
  },
  amPmContainer: {
    marginLeft: Layout.spacing.md,
  },
  amPmButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    marginVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.neutral[100],
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  amPmButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  amPmText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
  },
  amPmTextActive: {
    color: Colors.neutral[50],
  },
  timeDisplay: {
    marginTop: Layout.spacing.md,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral[600],
    textAlign: 'center',
  },
});