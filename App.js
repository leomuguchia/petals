// App.js
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import { FontLoader, MainApp } from './utils/appUtils';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontLoader>
          <MainApp />
        </FontLoader>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}