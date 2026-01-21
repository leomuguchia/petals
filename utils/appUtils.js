// utils/appUtils.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useTheme } from '../context/ThemeContext';
import TodayScreen from '../screens/TodayScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MemoriesScreen from '../screens/MemoriesScreen';
import {
  requestNotificationPermissions,
} from './notifications';

export const MainApp = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    (async () => {
      await requestNotificationPermissions();
    })();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'today':
        return <TodayScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'calendar':
        return <CalendarScreen onNavigate={(tab) => setActiveTab(tab)} />;
      case 'memories':
        return <MemoriesScreen onNavigate={(tab) => setActiveTab(tab)} />;
      default:
        return <TodayScreen onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  const renderTabBar = () => (
    <View
      style={{
        flexDirection: 'row',
        height: 60 + insets.bottom,
        backgroundColor: theme.cardBackground,
        borderTopWidth: 1,
        borderTopColor: theme.border,
        paddingBottom: insets.bottom,
      }}
    >
      <TabButton title="Today" isActive={activeTab === 'today'} onPress={() => setActiveTab('today')} theme={theme} />
      <TabButton title="Calendar" isActive={activeTab === 'calendar'} onPress={() => setActiveTab('calendar')} theme={theme} />
      <TabButton title="Memories" isActive={activeTab === 'memories'} onPress={() => setActiveTab('memories')} theme={theme} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: insets.top }}>
      <StatusBar
        barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      {renderTabBar()}
    </View>
  );
};

const TabButton = ({ title, isActive, onPress, theme }) => (
  <TouchableOpacity
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={{ fontSize: 14, fontFamily: theme.fontMedium || 'System', color: isActive ? theme.primary : theme.textSecondary }}>
      {title}
    </Text>
    {isActive && (
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.primary, marginTop: 4 }} />
    )}
  </TouchableOpacity>
);

export const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'jakarta-bold': require('../assets/fonts/jakarta-bold.ttf'),
          'jakarta-medium': require('../assets/fonts/jakarta-medium.ttf'),
          'jakarta-regular': require('../assets/fonts/jakarta-regular.ttf'),
        });
      } catch (error) {
        console.log('Fonts not found, using system fonts');
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFCFB' }}>
        <ActivityIndicator size="large" color="#9D6B53" />
      </View>
    );
  }

  return children;
};