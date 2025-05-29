export { useColorScheme } from 'react-native';
import { ColorSchemeName, useColorScheme as useDeviceColorScheme } from 'react-native';

/**
 * Custom hook that provides the color scheme with a fallback to 'light'
 */
export default function useColorScheme(): ColorSchemeName {
  const colorScheme = useDeviceColorScheme();
  return colorScheme || 'light';
}