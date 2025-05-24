import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, shadows } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
  return (
    <View style={[styles.card, shadows.medium, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
  },
});