// utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { getEntriesByDate } from './storage';

const NOTIFICATION_KEY = '@petals_notification_set';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 5 random gratitude prompts
const dailyMessages = [
  "🌸 What’s one small thing you’re grateful for today?",
  "💫 Take a moment to appreciate something good from your day.",
  "🌼 Even tiny joys count! Reflect on your day.",
  "🌷 Notice something positive you experienced today.",
  "✨ End your day with gratitude: what made you smile today?"
];

function getRandomDailyMessage() {
  const index = Math.floor(Math.random() * dailyMessages.length);
  return dailyMessages[index];
}

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Notification permissions denied');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FFB7B2',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleDailyReminder = async () => {
  try {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const body = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Petals Reminder",
        body,
        sound: true,
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: 'daily',   // ✅ Must include type
        hour: 19,
        minute: 0,
        repeats: true,
        channelId: 'daily-reminders', // For Android
      },
    });

    await AsyncStorage.setItem(NOTIFICATION_KEY, 'true');
    console.log('✅ Daily reminder scheduled for 7 PM');
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATION_KEY);
    console.log('📭 All notifications cancelled');
    return true;
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return false;
  }
};

// Check if notification toggle is enabled
export const isNotificationScheduled = async () => {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking notification status:', error);
    return false;
  }
};