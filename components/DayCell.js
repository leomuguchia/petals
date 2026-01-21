// components/DayCell.js - SIMPLE COLORED CIRCLE
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

export default function DayCell({ date, entries, isToday, isCurrentMonth, onPress }) {
  const { theme } = useTheme();
  const hasEntries = entries.length > 0;
  const dayNumber = format(date, 'd');
  
  // Get the dominant mood color
  const getDominantColor = () => {
    if (entries.length === 0) return null;
    
    const moodCounts = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    const colorMap = {
      grateful: theme.petalGrateful,
      joyful: theme.petalJoyful,
      peaceful: theme.petalPeaceful,
      hopeful: theme.petalHopeful,
      loved: theme.petalLoved,
    };
    
    return colorMap[dominantMood] || theme.petalGrateful;
  };

  const dominantColor = getDominantColor();

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        { opacity: isCurrentMonth ? 1 : 0.3 },
        isToday && styles.todayContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Background circle for days with entries */}
      {hasEntries && dominantColor && (
        <View style={[
          styles.entryBackground,
          { backgroundColor: dominantColor + '40' } // 40 = 25% opacity
        ]} />
      )}
      
      {/* Day number */}
      <Text style={[
        styles.dayNumber,
        { 
          color: isCurrentMonth ? theme.text : theme.textSecondary,
          fontFamily: theme.fontRegular,
        },
        isToday && { 
          color: theme.primary,
          fontFamily: theme.fontMedium,
          fontWeight: '600',
        },
        hasEntries && styles.dayNumberWithEntries,
      ]}>
        {dayNumber}
      </Text>
      
      {/* Entry count badge */}
      {hasEntries && entries.length > 1 && (
        <View style={[styles.countBadge, { backgroundColor: dominantColor || theme.primary }]}>
          <Text style={[styles.countText, { color: theme.buttonTextColor }]}>
            {entries.length}
          </Text>
        </View>
      )}
      
      {/* Single entry dot */}
      {hasEntries && entries.length === 1 && (
        <View style={[
          styles.singleEntryDot,
          { backgroundColor: dominantColor || theme.primary }
        ]} />
      )}
      
      {/* Today indicator (only if no entries) */}
      {isToday && !hasEntries && (
        <View style={[styles.todayIndicator, { backgroundColor: theme.primary }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    borderRadius: 22,
    position: 'relative',
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: '#9D6B53', // theme.primary
  },
  entryBackground: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '400',
    zIndex: 2,
  },
  dayNumberWithEntries: {
    fontWeight: '500',
  },
  countBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 3,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  singleEntryDot: {
    position: 'absolute',
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 3,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});