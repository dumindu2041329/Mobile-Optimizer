import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface CircularProgressProps {
  size: number;
  strokeWidth?: number;
  progress: number; // 0-100
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const CircularProgress = ({
  size,
  strokeWidth = 10,
  progress,
  color = colors.primary,
  backgroundColor = colors.border,
  children,
}: CircularProgressProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Calculate radius and center point
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;
  
  // Calculate stroke dash offset based on progress
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {/* Center Content */}
      <View style={styles.content}>
        {children || (
          <Text style={styles.progressText}>{clampedProgress}%</Text>
        )}
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
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});