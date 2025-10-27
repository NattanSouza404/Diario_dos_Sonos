import { useThemeColor } from '@/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  backgroundIsSecondary?: boolean;
  hasBorder?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, backgroundIsSecondary, hasBorder, ...otherProps }: ThemedViewProps) {
  const backgroundColor = backgroundIsSecondary ?
    useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundSecondary') :
    useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const borderColor = useThemeColor({}, 'borderColor');

  return <View style={[{ backgroundColor }, style, hasBorder && { borderColor: borderColor }]} {...otherProps} />;
}
