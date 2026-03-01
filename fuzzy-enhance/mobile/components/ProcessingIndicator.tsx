import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useStore } from '../store';
import { colors, spacing } from '../constants/theme';

interface ProcessingIndicatorProps {
  isLoading: boolean;
}

function formatExpectedDuration(ms: number): string {
  if (ms < 1000) return '~1 s';
  return `~${(ms / 1000).toFixed(0)} s`;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ isLoading }) => {
  const rotation = useSharedValue(0);
  const processingTimeMs = useStore((s) => s.processingTimeMs);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
  }, [isLoading, rotation]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      return;
    }
    setElapsedSeconds(0);
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!isLoading) return null;

  const expectedHint =
    processingTimeMs != null
      ? `Typically ${formatExpectedDuration(processingTimeMs)}`
      : 'Typically 10-30 seconds';

  return (
    <View style={[styles.overlay, { pointerEvents: 'box-none' }]}>
      <View style={styles.box}>
        <Animated.View style={[styles.spinner, animatedStyle]} />
        <ThemedText variant="md" bold color="textPrimary" style={styles.title}>
          Enhancing image...
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary" style={styles.elapsed}>
          Elapsed: {elapsedSeconds} s
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary" style={styles.expected}>
          {expectedHint}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  box: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.border,
    borderTopColor: colors.primary,
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  elapsed: {
    marginBottom: spacing.xs,
  },
  expected: {
    opacity: 0.9,
  },
});
