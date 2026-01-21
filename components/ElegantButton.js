import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ElegantButton({
  title,
  onPress,
  disabled = false,
  icon = null,
  variant = 'primary',
}) {
  const { theme } = useTheme();
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    if (disabled) {
      return [styles.button, { backgroundColor: theme.border }];
    }
    if (variant === 'secondary') {
      return [styles.button, { 
        backgroundColor: theme.secondaryButtonBackground,
        borderWidth: 1,
        borderColor: theme.border,
      }];
    }
    return [styles.button, { backgroundColor: theme.buttonBackground }];
  };

  const getTextStyle = () => {
    if (disabled) {
      return [styles.text, { color: theme.textSecondary }];
    }
    if (variant === 'secondary') {
      return [styles.text, { color: theme.secondaryButtonTextColor }];
    }
    return [styles.text, { color: theme.buttonTextColor }];
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={getTextStyle()}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'jakarta-medium',
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
});