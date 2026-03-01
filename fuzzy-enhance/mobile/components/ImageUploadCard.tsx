import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import { useImagePicker } from '../hooks/useImagePicker';
import { useStore } from '../store';
import { colors, spacing, borderRadius } from '../constants/theme';

export const ImageUploadCard: React.FC = () => {
  const { pickImage, pickFromCamera } = useImagePicker();
  const originalImage = useStore((s) => s.originalImage);

  if (originalImage) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: originalImage.uri }} style={styles.preview} resizeMode="cover" />
        <View style={styles.badge}>
          <ThemedText variant="xs" color="textPrimary">
            {originalImage.width} x {originalImage.height}
          </ThemedText>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.75}>
            <ThemedText variant="md" color="primary">Choose from Gallery</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickFromCamera} activeOpacity={0.75}>
            <ThemedText variant="md" color="primary">Use Camera</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardEmpty}>
      <ThemedText variant="lg" color="textSecondary" style={styles.placeholderText}>
        No image selected
      </ThemedText>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.75}>
          <ThemedText variant="md" color="primary">Choose from Gallery</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickFromCamera} activeOpacity={0.75}>
          <ThemedText variant="md" color="primary">Use Camera</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    minHeight: 200,
  },
  cardEmpty: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  preview: {
    width: '100%',
    height: 200,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  placeholderText: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
