import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isSameDay } from 'date-fns';

const ENTRY_KEY = '@petals_entries';

export const saveEntry = async (entry) => {
  try {
    const existingEntries = await AsyncStorage.getItem(ENTRY_KEY);
    const entries = existingEntries ? JSON.parse(existingEntries) : [];
    
    // Add new entry at the beginning
    entries.unshift(entry);
    
    // Keep only last 365 days of entries
    const recentEntries = entries.slice(0, 365);
    
    await AsyncStorage.setItem(ENTRY_KEY, JSON.stringify(recentEntries));
    return true;
  } catch (error) {
    console.error('Error saving entry:', error);
    return false;
  }
};

export const getEntries = async () => {
  try {
    const entries = await AsyncStorage.getItem(ENTRY_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

export const getEntriesByDate = async (date) => {
  try {
    const entries = await getEntries();
    return entries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
  } catch (error) {
    console.error('Error getting entries by date:', error);
    return [];
  }
};

export const hasEntryToday = async () => {
  try {
    const entries = await getEntries();
    const today = new Date();
    return entries.some(entry => 
      isSameDay(new Date(entry.date), today)
    );
  } catch (error) {
    console.error('Error checking today entry:', error);
    return false;
  }
};

export const getStreak = async () => {
  try {
    const entries = await getEntries();
    if (entries.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    // Sort entries by date (newest first)
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Check consecutive days
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      
      if (isSameDay(entryDate, currentDate) || 
          isSameDay(entryDate, new Date(currentDate.setDate(currentDate.getDate() - 1)))) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

export const exportEntries = async () => {
  try {
    const entries = await getEntries();
    const content = entries.map(entry => {
      return `${format(new Date(entry.date), 'MMMM d, yyyy')}\n${entry.text}\n\n`;
    }).join('---\n\n');
    
    return content;
  } catch (error) {
    console.error('Error exporting entries:', error);
    return '';
  }
};