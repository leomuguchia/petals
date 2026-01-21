import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Animated,
} from 'react-native';
import { format, formatDistanceToNow } from 'date-fns';
import { useTheme } from '../context/ThemeContext';
import { getEntries, exportEntries } from '../utils/storage';

export default function MemoriesScreen({ onNavigate }) {  
  const { theme } = useTheme();
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const allEntries = await getEntries();
    setEntries(allEntries);
  };

  const handleShare = async () => {
    try {
      const content = await exportEntries();
      await Share.share({
        message: `My Gratitude Journal\n\n${content}`,
        title: 'My Gratitude Petals',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEntryPress = (entry) => {
    setSelectedEntry(selectedEntry?.id === entry.id ? null : entry);
  };

  // 15 moods with emojis
  const getMoodEmoji = (mood) => {
    const emojis = {
      grateful: '🌸',
      joyful: '✨',
      peaceful: '☁️',
      hopeful: '🌱',
      loved: '💕',
      proud: '🌟',
      amused: '😄',
      inspired: '💡',
      energized: '⚡',
      content: '😌',
      nostalgic: '🕰️',
      relieved: '😅',
      curious: '🔍',
      accomplished: '🏆',
      serene: '🧘',
    };
    return emojis[mood] || '🌸';
  };

  // Get color for each mood from theme
  const getMoodColor = (mood) => {
    const colorMap = {
      grateful: theme.petalGrateful,
      joyful: theme.petalJoyful,
      peaceful: theme.petalPeaceful,
      hopeful: theme.petalHopeful,
      loved: theme.petalLoved,
      proud: theme.petalProud,
      amused: theme.petalAmused,
      inspired: theme.petalInspired,
      energized: theme.petalEnergized,
      content: theme.petalContent,
      nostalgic: theme.petalNostalgic,
      relieved: theme.petalRelieved,
      curious: theme.petalCurious,
      accomplished: theme.petalAccomplished,
      serene: theme.petalSerene,
    };
    return colorMap[mood] || theme.petalGrateful;
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { 
            color: theme.text, 
            fontFamily: theme.fontMedium,
            letterSpacing: 1,
          }]}>
            Your Memories
          </Text>
          <Text style={[styles.subtitle, { 
            color: theme.textSecondary, 
            fontFamily: theme.fontRegular,
          }]}>
            {entries.length} moments of gratitude
          </Text>
        </View>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          {entries.map((entry) => {
            const moodColor = getMoodColor(entry.mood);
            const isSelected = selectedEntry?.id === entry.id;
            
            return (
              <TouchableOpacity
                key={entry.id}
                style={[
                  styles.entryCard,
                  { 
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.border,
                  },
                  isSelected && {
                    borderColor: moodColor,
                    backgroundColor: moodColor + '20',
                  }
                ]}
                onPress={() => handleEntryPress(entry)}
                activeOpacity={0.8}
              >
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryDate, { 
                    color: theme.text, 
                    fontFamily: theme.fontMedium,
                  }]}>
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </Text>
                  <Text style={[styles.entryTimeAgo, { 
                    color: theme.textSecondary,
                    fontFamily: theme.fontRegular,
                  }]}>
                    {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                  </Text>
                </View>
                
                <Text style={[styles.entryText, { 
                  color: theme.text,
                  fontFamily: theme.fontRegular,
                  lineHeight: 24,
                }]} numberOfLines={isSelected ? undefined : 3}>
                  {entry.text}
                </Text>
                
                <View style={styles.entryFooter}>
                  <View style={[styles.moodTag, { 
                    backgroundColor: moodColor + '30',
                  }]}>
                    <Text style={styles.moodEmoji}>
                      {getMoodEmoji(entry.mood)}
                    </Text>
                    <Text style={[styles.moodText, { 
                      color: moodColor,
                      fontFamily: theme.fontMedium,
                    }]}>
                      {entry.mood}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Export Button */}
      {entries.length > 0 && (
        <View style={[styles.footer, { 
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        }]}>
          <TouchableOpacity
            style={[styles.exportButton, { 
              backgroundColor: theme.secondaryButtonBackground || theme.cardBackground, 
              borderColor: theme.border 
            }]}
            onPress={handleShare}
          >
            <Text style={[styles.exportButtonText, { 
              color: theme.secondaryButtonTextColor || theme.text, 
              fontFamily: theme.fontMedium 
            }]}>
              Export All Memories
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  entriesContainer: {
    paddingBottom: 100,
  },
  entryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
  },
  entryTimeAgo: {
    fontSize: 14,
  },
  entryText: {
    fontSize: 16,
  },
  entryFooter: {
    marginTop: 16,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  moodText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
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
  },
});