import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { colors, spacing } from '../constants/theme';

export default function NotFoundScreen(): React.ReactElement {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <ThemedText variant="xxl" bold color="textPrimary">Not found</ThemedText>
        <Link href="/(tabs)" style={styles.link}>
          <ThemedText variant="md" color="primary">Go to Home</ThemedText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  link: {
    marginTop: spacing.lg,
  },
});
