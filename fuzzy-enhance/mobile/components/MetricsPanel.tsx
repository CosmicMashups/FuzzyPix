import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useMetrics } from '../hooks/useMetrics';
import { useStore } from '../store';
import { formatNumber, formatMs } from '../utils/formatters';
import { colors, spacing } from '../constants/theme';

export const MetricsPanel: React.FC = () => {
  const { metrics } = useMetrics();
  const processingTimeMs = useStore((s) => s.processingTimeMs);
  const [expanded, setExpanded] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: withTiming(expanded ? 400 : 48, { duration: 200 }),
    overflow: 'hidden' as const,
  }));

  if (!metrics) return null;

  const entropyColor = metrics.entropyDelta >= 0 ? colors.success : colors.error;
  const ciiColor =
    metrics.contrastImprovementIndex >= 1 ? colors.success : colors.warning;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.75}
      >
        <ThemedText variant="md" bold>Metrics</ThemedText>
        <ThemedText variant="sm" color="textSecondary">
          {expanded ? 'Collapse' : 'Expand'}
        </ThemedText>
      </TouchableOpacity>
      <Animated.View style={[styles.body, animatedStyle]}>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">Entropy Before</ThemedText>
          <ThemedText variant="sm">{formatNumber(metrics.entropyBefore, 2)}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">Entropy After</ThemedText>
          <ThemedText variant="sm">{formatNumber(metrics.entropyAfter, 2)}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">Entropy Delta</ThemedText>
          <ThemedText variant="sm" style={{ color: entropyColor }}>
            {formatNumber(metrics.entropyDelta, 2)}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">Mean Before / After</ThemedText>
          <ThemedText variant="sm">
            {formatNumber(metrics.meanBefore, 0)} / {formatNumber(metrics.meanAfter, 0)}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">StdDev Before / After</ThemedText>
          <ThemedText variant="sm">
            {formatNumber(metrics.stddevBefore, 2)} / {formatNumber(metrics.stddevAfter, 2)}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">CII</ThemedText>
          <ThemedText variant="sm" style={{ color: ciiColor }}>
            {formatNumber(metrics.contrastImprovementIndex, 2)}
          </ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText variant="sm" color="textSecondary">Processing Time</ThemedText>
          <ThemedText variant="sm">
            {processingTimeMs != null ? formatMs(processingTimeMs) : '-'}
          </ThemedText>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
