import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ 
  progress, 
  height = 8, 
  color = colors.primary,
  label,
  showPercentage = true
}: ProgressBarProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && <Text style={styles.percentage}>{clampedProgress.toFixed(0)}%</Text>}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View 
          style={[
            styles.progress, 
            { 
              width: `${clampedProgress}%`,
              height,
              backgroundColor: color
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  track: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});