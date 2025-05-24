import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface ListItemProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
}

export const ListItem = ({
  title,
  subtitle,
  rightContent,
  leftIcon,
  onPress,
  showBorder = true,
}: ListItemProps) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, showBorder && styles.border]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  leftIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    marginLeft: 8,
  },
});