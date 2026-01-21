import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, 
         isSameMonth, isToday, isSameDay } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { getEntriesByDate } from '../utils/storage';
import DayCell from '../components/DayCell';
import ElegantButton from '../components/ElegantButton';

export default function CalendarScreen({ onNavigate }) {  
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    loadEntries();
  }, [currentDate]);

  const loadEntries = async () => {
    const days = getDaysInMonth(currentDate);
    const entriesMap = {};
    
    for (const day of days) {
      const dayEntries = await getEntriesByDate(day);
      if (dayEntries.length > 0) {
        entriesMap[format(day, 'yyyy-MM-dd')] = dayEntries;
      }
    }
    
    setEntries(entriesMap);
  };

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const handleDayPress = (day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    if (entries[dayKey]) {
      setSelectedDay(day);
      // Could show a modal here instead of navigating
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthName = format(currentDate, 'MMMM yyyy');

  return (
    <Animated.View style={[styles.container, { 
      backgroundColor: theme.background, 
      opacity: fadeAnim 
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.monthTitle, { 
          color: theme.text, 
          fontFamily: theme.fontMedium,
          letterSpacing: 1,
        }]}>
          {monthName}
        </Text>
        <Text style={[styles.subtitle, { 
          color: theme.textSecondary,
          fontFamily: theme.fontRegular,
        }]}>
          Each petal is a moment of gratitude
        </Text>
      </View>

      {/* Calendar Grid */}
      <View style={styles.weekDays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={[styles.weekDay, { 
            color: theme.textSecondary,
            fontFamily: theme.fontMedium,
          }]}>
            {day}
          </Text>
        ))}
      </View>

      <ScrollView style={styles.calendarScroll}>
        <View style={styles.calendarGrid}>
          {days.map((day, index) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayEntries = entries[dayKey] || [];
            
            return (
              <DayCell
                key={index}
                date={day}
                entries={dayEntries}
                isToday={isToday(day)}
                isCurrentMonth={isSameMonth(day, currentDate)}
                onPress={() => handleDayPress(day)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Stats & Actions */}
      <View style={[styles.footer, { 
        borderTopColor: theme.border,
      }]}>
        <TouchableOpacity
          style={[styles.writeButton, { 
            backgroundColor: theme.secondaryButtonBackground,
            borderColor: theme.border,
          }]}
          onPress={() => onNavigate && onNavigate('today')}  // Changed
        >
          <Text style={[styles.writeButtonText, { 
            color: theme.secondaryButtonTextColor,
            fontFamily: theme.fontMedium,
          }]}>
            Write Today's Entry
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.viewMemories}
          onPress={() => onNavigate && onNavigate('memories')}  // Changed
        >
          <Text style={[styles.viewMemoriesText, { 
            color: theme.primary,
            fontFamily: theme.fontMedium,
          }]}>
            View All Memories →
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  monthTitle: {
    fontSize: 32,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: '500',
    width: 40,
    textAlign: 'center',
  },
  calendarScroll: {
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  footer: {
    paddingVertical: 24,
    borderTopWidth: 1,
  },
  viewMemories: {
    padding: 16,
    alignItems: 'center',
  },
  viewMemoriesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  writeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  writeButtonText: {
    fontSize: 16,
  },
  exportButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  exportButtonText: {
    fontSize: 16,
  }
});