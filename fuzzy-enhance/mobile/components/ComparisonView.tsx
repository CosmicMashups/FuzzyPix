import React from 'react';
import { View, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { base64ToDataUri } from '../utils/imageUtils';
import { ThemedText } from './ThemedText';
import { colors, spacing } from '../constants/theme';

interface ComparisonViewProps {
  originalUri: string | null;
  enhancedBase64: string | null;
  mode: 'side-by-side' | 'overlay' | 'swipe';
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalUri,
  enhancedBase64,
  mode,
}) => {
  const { width } = useWindowDimensions();
  const half = (width - spacing.md * 3) / 2;
  const enhancedUri = enhancedBase64 ? base64ToDataUri(enhancedBase64, 'image/png') : null;

  if (mode === 'side-by-side') {
    return (
      <View style={styles.row}>
        <View style={styles.half}>
          <View style={styles.labelBg}>
            <ThemedText variant="xs" bold color="textPrimary">Before</ThemedText>
          </View>
          {originalUri ? (
            <Image source={{ uri: originalUri }} style={[styles.img, { width: half, height: half }]} resizeMode="contain" />
          ) : (
            <View style={[styles.placeholder, { width: half, height: half }]} />
          )}
        </View>
        <View style={styles.half}>
          <View style={[styles.labelBg, styles.labelRight]}>
            <ThemedText variant="xs" bold color="textPrimary">After</ThemedText>
          </View>
          {enhancedUri ? (
            <Image source={{ uri: enhancedUri }} style={[styles.img, { width: half, height: half }]} resizeMode="contain" />
          ) : (
            <View style={[styles.placeholder, { width: half, height: half }]} />
          )}
        </View>
      </View>
    );
  }

  if (mode === 'overlay') {
    return (
      <View style={styles.overlayContainer}>
        {originalUri && (
          <Image source={{ uri: originalUri }} style={styles.fullImg} resizeMode="contain" />
        )}
        {enhancedUri && (
          <View style={StyleSheet.absoluteFill}>
            <Image source={{ uri: enhancedUri }} style={styles.fullImg} resizeMode="contain" />
          </View>
        )}
        {!originalUri && !enhancedUri && <View style={[styles.placeholder, styles.fullImg]} />}
      </View>
    );
  }

  return (
    <View style={styles.swipeContainer}>
      {originalUri && (
        <Image source={{ uri: originalUri }} style={styles.fullImg} resizeMode="contain" />
      )}
      {enhancedUri && (
        <View style={StyleSheet.absoluteFill}>
          <Image source={{ uri: enhancedUri }} style={styles.fullImg} resizeMode="contain" />
        </View>
      )}
      {!originalUri && !enhancedUri && <View style={[styles.placeholder, styles.fullImg]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  half: {
    flex: 1,
    position: 'relative',
  },
  labelBg: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  labelRight: {
    left: undefined,
    right: spacing.sm,
  },
  labelLeft: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  labelBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  label: {
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  overlayContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 400,
    position: 'relative',
    padding: spacing.md,
  },
  swipeContainer: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 400,
    position: 'relative',
    padding: spacing.md,
  },
  fullImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
});
