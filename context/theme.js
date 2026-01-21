// theme.js

const lightTheme = {
  theme: 'light',
  
  // Primary colors (elegant earthy palette)
  primary: '#9D6B53',        // Earthy brown
  primaryLight: '#E8D5CC',   // Light clay
  darkPrimary: '#7A523F',    // Darker brown
  
  // 15 Petal colors for moods
  petalGrateful: '#FFB7B2',  // Blush pink
  petalJoyful: '#FFDAC1',    // Peach
  petalPeaceful: '#B5EAD7',  // Mint
  petalHopeful: '#C7CEEA',   // Periwinkle
  petalLoved: '#E2F0CB',     // Sage
  petalProud: '#FFD700',     // Gold
  petalAmused: '#FF9AA2',    // Coral pink
  petalInspired: '#AEC6CF',  // Pastel blue
  petalEnergized: '#FFB347', // Orange
  petalContent: '#B19CD9',   // Lavender
  petalNostalgic: '#C4C1E0', // Soft purple
  petalRelieved: '#77DD77',  // Light green
  petalCurious: '#FDFD96',   // Light yellow
  petalAccomplished: '#F49AC2', // Light magenta
  petalSerene: '#A2D2FF',    // Sky blue
  
  
  // Background & surfaces
  background: '#FDFCFB',     // Warm white
  cardBackground: '#FFFFFF',
  lightBackground: '#FAF9F7',
  
  // Text
  text: '#2D2A26',           // Charcoal
  secondaryText: '#8A8A8A',
  textPlaceholder: '#B0AEA9',
  
  // UI Elements
  border: '#F0EDEB',
  cardShadow: 'rgba(157, 107, 83, 0.1)',
  inputBorder: '#E5E2DF',
  
  // Status
  success: '#7DBE8C',
  error: '#E66767',
  warning: '#FFB74D',
  
  // Fonts
  fontRegular: 'jakarta-regular',
  fontMedium: 'jakarta-medium',
  fontBold: 'jakarta-bold',
  
  // Gradients
  gradientStart: '#9D6B53',
  gradientEnd: '#7A523F',
  
  // Button
  buttonBackground: '#9D6B53',
  buttonTextColor: '#FFFFFF',
  secondaryButtonBackground: '#FFFFFF',
  secondaryButtonTextColor: '#9D6B53',
  
  // Overlays
  overlay: 'rgba(253, 252, 251, 0.8)',
  darkOverlay: 'rgba(45, 42, 38, 0.3)',
};

const darkTheme = {
  theme: 'dark',
  
  // Primary colors (softer for dark mode)
  primary: '#D4A574',        // Warm clay
  primaryLight: '#2A211C',   // Dark brown
  darkPrimary: '#B38964',    // Lighter clay
  
  petalGrateful: '#D1928F',
  petalJoyful: '#D4B7A1',
  petalPeaceful: '#8BC4B5',
  petalHopeful: '#9FA9D4',
  petalLoved: '#B5C49A',
  petalProud: '#D4B700',
  petalAmused: '#D98289',
  petalInspired: '#8DA6B3',
  petalEnergized: '#D49965',
  petalContent: '#9586C9',
  petalNostalgic: '#A49FC9',
  petalRelieved: '#65C165',
  petalCurious: '#D8D87A',
  petalAccomplished: '#D07FA3',
  petalSerene: '#82B8E6',
  
  // Background & surfaces
  background: '#1A1816',     // Dark charcoal
  cardBackground: '#24211E',
  lightBackground: '#2D2A26',
  
  // Text
  text: '#F5F3F0',           // Off-white
  secondaryText: '#A5A29D',
  textPlaceholder: '#6D6A65',
  
  // UI Elements
  border: '#36332F',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
  inputBorder: '#3D3A36',
  
  // Status
  success: '#7DBE8C',
  error: '#E66767',
  warning: '#FFB74D',
  
  // Fonts
  fontRegular: 'jakarta-regular',
  fontMedium: 'jakarta-medium',
  fontBold: 'jakarta-bold',
  
  // Gradients
  gradientStart: '#D4A574',
  gradientEnd: '#B38964',
  
  // Button
  buttonBackground: '#D4A574',
  buttonTextColor: '#1A1816',
  secondaryButtonBackground: '#24211E',
  secondaryButtonTextColor: '#D4A574',
  
  // Overlays
  overlay: 'rgba(26, 24, 22, 0.8)',
  darkOverlay: 'rgba(0, 0, 0, 0.5)',
};

export default { light: lightTheme, dark: darkTheme };