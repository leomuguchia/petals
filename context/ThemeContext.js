// ThemeContext.js - SUPER SAFE VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('petals_theme');
        
        // Debug log to see what's stored
        console.log('Theme debug - storedTheme:', storedTheme, 'type:', typeof storedTheme);
        console.log('Theme debug - systemColorScheme:', systemColorScheme, 'type:', typeof systemColorScheme);
        
        // Validate stored theme
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setCurrentTheme(storedTheme);
        } else {
          // Validate system theme
          const validSystemTheme = (systemColorScheme === 'light' || systemColorScheme === 'dark') 
            ? systemColorScheme 
            : 'light';
          setCurrentTheme(validSystemTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
        setCurrentTheme('light');
      } finally {
        // Force boolean true
        setThemeLoaded(true);
      }
    };

    // Small delay to ensure systemColorScheme is ready
    const timer = setTimeout(() => {
      loadTheme();
    }, 100);

    return () => clearTimeout(timer);
  }, [systemColorScheme]);

  const setTheme = async (newTheme) => {
    // Only accept valid theme values
    if (newTheme === 'light' || newTheme === 'dark') {
      setCurrentTheme(newTheme);
      try {
        await AsyncStorage.setItem('petals_theme', newTheme);
      } catch (error) {
        console.log('Error saving theme:', error);
      }
    }
  };

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  const getSelectedTheme = () => {
    // Ensure currentTheme is valid
    const validTheme = (currentTheme === 'light' || currentTheme === 'dark') 
      ? currentTheme 
      : 'light';
    return theme[validTheme] || theme.light;
  };

  const selectedTheme = getSelectedTheme();

  // EXPLICIT boolean check - this is the key fix
  if (themeLoaded === false) {
    console.log('Theme not loaded yet, returning null');
    return null;
  }

  console.log('Theme loaded, rendering with theme:', currentTheme);

  return (
    <ThemeContext.Provider value={{ 
      theme: selectedTheme, 
      currentTheme, 
      setTheme,
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined || context === null) {
    console.error('useTheme was called outside ThemeProvider');
    // Return default theme instead of throwing to prevent crash
    return { 
      theme: theme.light, 
      currentTheme: 'light', 
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
  return context;
};