import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { ImageUploadCard } from '../../components/ImageUploadCard';
import { useOriginalImage } from '../../store';
import { colors, spacing, borderRadius } from '../../constants/theme';

export default function HomeScreen(): React.ReactElement {
  const router = useRouter();
  const originalImage = useOriginalImage();
  const hasImage = originalImage != null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="display" bold color="textPrimary">FuzzyEnhance</ThemedText>
      </View>
      <ImageUploadCard />
      {hasImage && (
        <View style={styles.status}>
          <ThemedText variant="sm" color="textSecondary">Image selected. Proceed to enhance.</ThemedText>
        </View>
      )}
      <TouchableOpacity
        style={[styles.cta, !hasImage && styles.ctaDisabled]}
        onPress={() => hasImage && router.push('/(tabs)/enhance')}
        disabled={!hasImage}
        activeOpacity={0.75}
      >
        <ThemedText variant="lg" bold color="textPrimary">Proceed to Enhance</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  status: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  ctaDisabled: {
    opacity: 0.4,
  },
});
