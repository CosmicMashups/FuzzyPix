import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { useHistogram } from '../hooks/useHistogram';
import { colors, spacing } from '../constants/theme';

const CHART_HEIGHT = 120;

function HistogramBarsWeb({
  normalizedOriginal,
  normalizedEnhanced,
  chartWidth,
}: {
  normalizedOriginal: number[] | null;
  normalizedEnhanced: number[] | null;
  chartWidth: number;
}) {
  const barWidth = chartWidth > 0 ? chartWidth / 256 : 0;
  const data = normalizedOriginal ?? normalizedEnhanced ?? [];
  return (
    <View style={[styles.barRow, { width: chartWidth, height: CHART_HEIGHT }]}>
      {data.map((_, i) => {
        const o = normalizedOriginal?.[i] ?? 0;
        const e = normalizedEnhanced?.[i] ?? 0;
        return (
          <View key={i} style={[styles.barCell, { width: Math.max(1, barWidth - 0.5) }]}>
            {normalizedOriginal && o > 0 && (
              <View
                style={[
                  styles.barSegment,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: o * (CHART_HEIGHT - 4),
                    backgroundColor: 'rgba(26,115,232,0.6)',
                  },
                ]}
              />
            )}
            {normalizedEnhanced && e > 0 && (
              <View
                style={[
                  styles.barSegment,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: e * (CHART_HEIGHT - 4),
                    backgroundColor: 'rgba(52,168,83,0.6)',
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

function HistogramBarsSkia({
  normalizedOriginal,
  normalizedEnhanced,
  chartWidth,
}: {
  normalizedOriginal: number[] | null;
  normalizedEnhanced: number[] | null;
  chartWidth: number;
}) {
  const { Canvas, Rect } = require('@shopify/react-native-skia');
  const barWidth = chartWidth > 0 ? chartWidth / 256 : 0;
  return (
    <Canvas style={[styles.chart, { width: chartWidth, height: CHART_HEIGHT }]}>
      {normalizedOriginal?.map((v, i) => (
        <Rect
          key={`o-${i}`}
          x={i * barWidth}
          y={CHART_HEIGHT - (v ?? 0) * (CHART_HEIGHT - 4)}
          width={Math.max(1, barWidth - 0.5)}
          height={(v ?? 0) * (CHART_HEIGHT - 4)}
          color="rgba(26,115,232,0.6)"
        />
      ))}
      {normalizedEnhanced?.map((v, i) => (
        <Rect
          key={`e-${i}`}
          x={i * barWidth}
          y={CHART_HEIGHT - (v ?? 0) * (CHART_HEIGHT - 4)}
          width={Math.max(1, barWidth - 0.5)}
          height={(v ?? 0) * (CHART_HEIGHT - 4)}
          color="rgba(52,168,83,0.6)"
        />
      ))}
    </Canvas>
  );
}

export const HistogramChart: React.FC = () => {
  const { width } = useWindowDimensions();
  const { normalizedOriginal, normalizedEnhanced } = useHistogram();
  const chartWidth = Math.max(0, width - spacing.md * 2);

  if (!normalizedOriginal && !normalizedEnhanced) {
    return (
      <View style={styles.container}>
        <ThemedText variant="sm" color="textSecondary">Intensity Distribution</ThemedText>
        <View style={[styles.chart, { width: chartWidth, height: CHART_HEIGHT }]} />
      </View>
    );
  }

  const HistogramBars = Platform.OS === 'web' ? HistogramBarsWeb : HistogramBarsSkia;

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <ThemedText variant="sm" color="textSecondary">Intensity Distribution</ThemedText>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(26,115,232,0.6)' }]} />
          <ThemedText variant="xs" color="textSecondary">Before</ThemedText>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(52,168,83,0.6)' }]} />
          <ThemedText variant="xs" color="textSecondary">After</ThemedText>
        </View>
      </View>
      <HistogramBars
        normalizedOriginal={normalizedOriginal}
        normalizedEnhanced={normalizedEnhanced}
        chartWidth={chartWidth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  legend: {
    marginBottom: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  chart: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barCell: {
    position: 'relative',
    height: CHART_HEIGHT,
  },
  barSegment: {
    width: '100%',
    minHeight: 1,
  },
});
