import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';

export default function TabLayout(): React.ReactElement {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'FuzzyEnhance',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tabs.Screen
        name="enhance"
        options={{
          title: 'Enhancement',
          tabBarLabel: 'Enhance',
          tabBarIcon: ({ color }) => null,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarLabel: 'About',
          tabBarIcon: ({ color }) => null,
        }}
      />
    </Tabs>
  );
}
