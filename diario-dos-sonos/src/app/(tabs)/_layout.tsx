import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/shared/components/haptic-tab';
import { IconSymbol } from '@/src/shared/components/ui/icon-symbol';
import { Colors } from '@/src/shared/constants/theme';
import { useColorScheme } from '@/src/shared/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='calendar-clear' color={color} />,
        }}
      />
    </Tabs>
  );
}
