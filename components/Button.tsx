import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
  View
} from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon
}: ButtonProps) => {
  
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getButtonStyle = (): ViewStyle[] => {
    let buttonStyle: ViewStyle[] = [styles.button];
    
    // Add size styles
    if (size === 'small') buttonStyle.push(styles.buttonSmall);
    if (size === 'large') buttonStyle.push(styles.buttonLarge);
    
    // Add variant styles
    if (variant === 'primary') buttonStyle.push(styles.buttonPrimary);
    if (variant === 'secondary') buttonStyle.push(styles.buttonSecondary);
    if (variant === 'outline') buttonStyle.push(styles.buttonOutline);
    
    // Add disabled style
    if (disabled) buttonStyle.push(styles.buttonDisabled);
    
    // Add custom style
    if (style) buttonStyle.push(style);
    
    return buttonStyle;
  };
  
  const getTextStyle = (): TextStyle[] => {
    let textStyleArray: TextStyle[] = [styles.text];
    
    // Add size styles
    if (size === 'small') textStyleArray.push(styles.textSmall);
    if (size === 'large') textStyleArray.push(styles.textLarge);
    
    // Add variant styles
    if (variant === 'primary') textStyleArray.push(styles.textPrimary);
    if (variant === 'secondary') textStyleArray.push(styles.textSecondary);
    if (variant === 'outline') textStyleArray.push(styles.textOutline);
    
    // Add disabled style
    if (disabled) textStyleArray.push(styles.textDisabled);
    
    // Add custom text style
    if (textStyle) textStyleArray.push(textStyle);
    
    return textStyleArray;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.background} 
          size="small" 
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSmall: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  textPrimary: {
    color: colors.background,
  },
  textSecondary: {
    color: colors.background,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textSecondary,
  },
  iconContainer: {
    marginRight: 8,
  },
});