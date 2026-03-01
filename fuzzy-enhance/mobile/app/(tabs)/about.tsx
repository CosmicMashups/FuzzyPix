import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { colors, spacing } from '../../constants/theme';

export default function AboutScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedText variant="xxl" bold color="textPrimary" style={styles.title}>
        FuzzyEnhance
      </ThemedText>
      <ThemedText variant="sm" color="textSecondary" style={styles.version}>
        Version 1.0.0
      </ThemedText>
      <ThemedText variant="md" color="textPrimary" style={styles.paragraph}>
        Complex Fuzzy Logic Image Enhancement System. Accepts a digital image, extracts
        per-pixel neighborhood features, applies a Mamdani fuzzy inference engine to compute
        per-pixel intensity adjustments, and returns an enhanced image with quality metrics.
      </ThemedText>
      <ThemedText variant="lg" bold color="textPrimary" style={styles.section}>
        Technical overview
      </ThemedText>
      <ThemedText variant="md" color="textSecondary" style={styles.paragraph}>
        Mamdani fuzzy inference with six input features per pixel: pixel intensity, local
        contrast, local mean, local standard deviation, edge magnitude (Sobel), and
        neighborhood Shannon entropy. Output is a signed intensity adjustment via centroid
        defuzzification over five terms: STRONG_DARKENING, MODERATE_DARKENING, NO_CHANGE,
        MODERATE_BRIGHTENING, STRONG_BRIGHTENING.
      </ThemedText>
      <ThemedText variant="lg" bold color="textPrimary" style={styles.section}>
        Input features
      </ThemedText>
      <ThemedText variant="md" color="textSecondary" style={styles.paragraph}>
        Pixel Intensity, Local Contrast, Local Mean, Local StdDev, Edge Magnitude,
        Neighborhood Entropy.
      </ThemedText>
      <ThemedText variant="lg" bold color="textPrimary" style={styles.section}>
        Output terms
      </ThemedText>
      <ThemedText variant="md" color="textSecondary" style={styles.paragraph}>
        STRONG_DARKENING, MODERATE_DARKENING, NO_CHANGE, MODERATE_BRIGHTENING, STRONG_BRIGHTENING.
      </ThemedText>
      <ThemedText variant="lg" bold color="textPrimary" style={styles.section}>
        Technology stack
      </ThemedText>
      <ThemedText variant="md" color="textSecondary" style={styles.paragraph}>
        Expo SDK 51+, React Native, TypeScript, Zustand, React Query, Axios, React Native Skia,
        Node.js, Express, Sharp, custom Mamdani fuzzy engine.
      </ThemedText>
      <ThemedText variant="md" color="textSecondary" style={styles.attribution}>
        Research project – Complex Fuzzy Logic Image Enhancement.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  version: {
    marginBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paragraph: {
    marginBottom: spacing.md,
  },
  attribution: {
    marginTop: spacing.xl,
  },
});
