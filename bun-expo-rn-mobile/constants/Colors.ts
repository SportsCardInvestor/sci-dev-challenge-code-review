/**
 * Colors for light and dark themes
 * Used throughout the app for consistent theming
 */

const tintColorLight = '#3B82F6';
const tintColorDark = '#60A5FA';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F9FAFB',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardText: '#1F2937',
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    card: '#1F2937',
    cardText: '#F9FAFB',
  },
};

export default Colors;