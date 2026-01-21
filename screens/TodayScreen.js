import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Switch,
} from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { saveEntry, hasEntryToday } from '../utils/storage';
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  isNotificationScheduled,
  cancelAllNotifications,
} from '../utils/notifications';

const { width } = Dimensions.get('window');

export default function TodayScreen({ onNavigate }) {
  const { theme } = useTheme();
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState('grateful');
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isToggleLoading, setIsToggleLoading] = useState(false);

  useEffect(() => {
    checkIfLoggedToday();
    loadNotificationStatus();
  }, []);

  const checkIfLoggedToday = async () => {
    const hasLogged = await hasEntryToday();
    setAlreadyLogged(hasLogged);
  };

  const loadNotificationStatus = async () => {
    const enabled = await isNotificationScheduled();
    setNotificationsEnabled(enabled);
  };

  const handleNotificationToggle = async (value) => {
    setIsToggleLoading(true);
    setNotificationsEnabled(value);
    
    try {
      if (value) {
        const granted = await requestNotificationPermissions();
        if (granted) {
          const scheduled = await scheduleDailyReminder();
          if (!scheduled) {
            setNotificationsEnabled(false);
          }
        } else {
          setNotificationsEnabled(false);
          // Optional: Show alert about permission being denied
        }
      } else {
        await cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      setNotificationsEnabled(!value); // Revert on error
    } finally {
      setIsToggleLoading(false);
    }
  };

  const handleSave = async () => {
    if (entry.trim().length === 0) return;
    
    await saveEntry({
      text: entry.trim(),
      mood,
      date: new Date().toISOString(),
      id: Date.now(),
    });
    
    setEntry('');
    if (onNavigate) onNavigate('calendar');
  };

  const moods = [
    { id: 'grateful', emoji: '🌸', label: 'Grateful' },
    { id: 'joyful', emoji: '✨', label: 'Joyful' },
    { id: 'peaceful', emoji: '☁️', label: 'Peaceful' },
    { id: 'hopeful', emoji: '🌱', label: 'Hopeful' },
    { id: 'loved', emoji: '💕', label: 'Loved' },
    { id: 'proud', emoji: '🌟', label: 'Proud' },
    { id: 'amused', emoji: '😄', label: 'Amused' },
    { id: 'inspired', emoji: '💡', label: 'Inspired' },
    { id: 'energized', emoji: '⚡', label: 'Energized' },
    { id: 'content', emoji: '😌', label: 'Content' },
    { id: 'nostalgic', emoji: '🕰️', label: 'Nostalgic' },
    { id: 'relieved', emoji: '😅', label: 'Relieved' },
    { id: 'curious', emoji: '🔍', label: 'Curious' },
    { id: 'accomplished', emoji: '🏆', label: 'Accomplished' },
    { id: 'serene', emoji: '🧘', label: 'Serene' },
  ];

  const getMoodColor = (moodId) => {
    const colorMap = {
      grateful: theme.petalGrateful,
      joyful: theme.petalJoyful,
      peaceful: theme.petalPeaceful,
      hopeful: theme.petalHopeful,
      loved: theme.petalLoved,
    };
    return colorMap[moodId] || theme.petalGrateful;
  };

  if (alreadyLogged) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontMedium }]}>
          You've already added today's petal 🌸
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
          Come back tomorrow, or review your garden.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => onNavigate && onNavigate('calendar')}
        >
          <Text style={[styles.buttonText, { color: theme.buttonTextColor, fontFamily: theme.fontMedium }]}>
            View Garden
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Header */}
        <View style={styles.dateContainer}>
          <Text style={[styles.date, { color: theme.text, fontFamily: theme.fontRegular }]}>
            {format(new Date(), 'EEEE')}
          </Text>
          <Text style={[styles.dateSubtitle, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
            {format(new Date(), 'MMMM do, yyyy')}
          </Text>
        </View>

        {/* Prompt */}
        <View style={styles.promptContainer}>
          <Text style={[styles.prompt, { color: theme.primary, fontFamily: theme.fontMedium }]}>
            What made today beautiful?
          </Text>
          <Text style={[styles.subPrompt, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
            One small moment of gratitude
          </Text>
        </View>

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: theme.lightBackground,
              borderColor: theme.inputBorder,
              color: theme.text,
              fontFamily: theme.fontRegular,
            }
          ]}
          multiline
          placeholder="Today, I'm grateful for..."
          placeholderTextColor={theme.textPlaceholder}
          value={entry}
          onChangeText={setEntry}
          autoFocus
          maxLength={300}
        />

        {/* Character Count */}
        <Text style={[styles.charCount, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
          {entry.length}/300
        </Text>

        {/* Mood Selection */}
        <Text style={[styles.moodLabel, { color: theme.text, fontFamily: theme.fontMedium }]}>
          How does this feel?
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.moodScroll}
        >
          {moods.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.moodItem,
                { 
                  backgroundColor: mood === item.id ? getMoodColor(item.id) + '40' : theme.cardBackground,
                  borderColor: mood === item.id ? getMoodColor(item.id) : theme.border,
                }
              ]}
              onPress={() => setMood(item.id)}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text style={[
                styles.moodText,
                { 
                  color: mood === item.id ? getMoodColor(item.id) : theme.text,
                  fontFamily: theme.fontMedium,
                }
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { 
              backgroundColor: entry.trim().length > 0 ? theme.primary : theme.border,
              opacity: entry.trim().length > 0 ? 1 : 0.5,
            }
          ]}
          onPress={handleSave}
          disabled={entry.trim().length === 0}
        >
          <Text style={[styles.saveButtonText, { color: theme.buttonTextColor, fontFamily: theme.fontMedium }]}>
            Add to Petals
          </Text>
        </TouchableOpacity>

        {/* Notification Section */}
        <View style={[styles.notificationSection, {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
          marginTop: 30,
        }]}>
          {/* Title Row */}
          <View style={styles.notificationTitleRow}>
            <Text style={[styles.notificationTitle, { color: theme.text, fontFamily: theme.fontMedium }]}>
              🌅 Daily Reminder
            </Text>
          </View>
          
          {/* Description Row */}
          <View style={styles.notificationDescriptionRow}>
            <Text style={[styles.notificationSubtitle, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
              Get reminded at 7 PM to reflect on your day
            </Text>
          </View>
          
          {/* Toggle Row - Now on its own row */}
          <View style={styles.notificationToggleRow}>
            <Text style={[styles.toggleLabel, { color: theme.text, fontFamily: theme.fontRegular }]}>
              Enable notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={isToggleLoading}
              trackColor={{ 
                false: theme.border, 
                true: theme.primary + '80' 
              }}
              thumbColor={notificationsEnabled ? theme.primary : '#f4f3f4'}
              ios_backgroundColor={theme.border}
            />
          </View>
          
          {notificationsEnabled && (
            <View style={[styles.notificationTime, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.notificationTimeText, { color: theme.primary, fontFamily: theme.fontMedium }]}>
                ⏰ Set for 7:00 PM daily
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => onNavigate && onNavigate('calendar')}
          >
            <Text style={[styles.quickActionText, { color: theme.text, fontFamily: theme.fontMedium }]}>🌸 View Your Garden</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => onNavigate && onNavigate('memories')}
          >
            <Text style={[styles.quickActionText, { color: theme.text, fontFamily: theme.fontMedium }]}>📚 Browse Memories</Text>
          </TouchableOpacity>
        </View>

        {/* Skip Option */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => onNavigate && onNavigate('calendar')}
        >
          <Text style={[styles.skipText, { color: theme.textSecondary, fontFamily: theme.fontRegular }]}>
            I'll come back later
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  dateContainer: {
    marginBottom: 32,
  },
  date: {
    fontSize: 28,
    letterSpacing: 0.5,
  },
  dateSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  promptContainer: {
    marginBottom: 24,
  },
  prompt: {
    fontSize: 22,
    lineHeight: 30,
  },
  subPrompt: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 140,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 14,
    marginTop: 8,
  },
  moodLabel: {
    fontSize: 16,
    marginTop: 32,
    marginBottom: 12,
  },
  moodScroll: {
    marginBottom: 40,
  },
  moodItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  moodText: {
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
  },
  notificationSection: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  notificationTitleRow: {
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 18,
  },
  notificationDescriptionRow: {
    marginBottom: 16,
  },
  notificationSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  toggleLabel: {
    fontSize: 16,
  },
  notificationTime: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  notificationTimeText: {
    fontSize: 13,
  },
  quickActions: {
    marginTop: 24,
  },
  quickAction: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  skipText: {
    fontSize: 15,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});