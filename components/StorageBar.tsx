import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface StorageCategory {
  name: string;
  size: number;
  color: string;
}

interface StorageBarProps {
  categories: StorageCategory[];
  total: number;
  height?: number;
  showLegend?: boolean;
}

export const StorageBar = ({
  categories,
  total,
  height = 16,
  showLegend = true,
}: StorageBarProps) => {
  // Calculate percentages
  const categoriesWithPercentage = categories.map(category => ({
    ...category,
    percentage: (category.size / total) * 100,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.barContainer, { height }]}>
        {categoriesWithPercentage.map((category, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                width: `${category.percentage}%`,
                backgroundColor: category.color,
                borderTopLeftRadius: index === 0 ? height / 2 : 0,
                borderBottomLeftRadius: index === 0 ? height / 2 : 0,
                borderTopRightRadius: index === categoriesWithPercentage.length - 1 ? height / 2 : 0,
                borderBottomRightRadius: index === categoriesWithPercentage.length - 1 ? height / 2 : 0,
              },
            ]}
          />
        ))}
      </View>

      {showLegend && (
        <View style={styles.legendContainer}>
          {categoriesWithPercentage.map((category, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: category.color }]} />
              <Text style={styles.legendText}>
                {category.name} ({category.size.toFixed(1)} GB)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});