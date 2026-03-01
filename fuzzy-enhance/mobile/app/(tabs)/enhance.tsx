import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ComparisonView } from '../../components/ComparisonView';
import { HistogramChart } from '../../components/HistogramChart';
import { EnhancementControls } from '../../components/EnhancementControls';
import { MetricsPanel } from '../../components/MetricsPanel';
import { RuleViewer } from '../../components/RuleViewer';
import { ProcessingIndicator } from '../../components/ProcessingIndicator';
import { useStore } from '../../store';
import { useEnhancement } from '../../hooks/useEnhancement';
import { useUIState } from '../../store';
import { colors, spacing } from '../../constants/theme';

export default function EnhanceScreen(): React.ReactElement {
  const originalImage = useStore((s) => s.originalImage);
  const enhancedImageBase64 = useStore((s) => s.enhancedImageBase64);
  const ui = useUIState();
  const setComparisonMode = useStore((s) => s.setComparisonMode);
  const { isLoading } = useEnhancement();

  return (
    <View style={styles.container}>
      <ProcessingIndicator isLoading={isLoading} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.modeRow}>
          <ThemedText variant="md" bold>Comparison</ThemedText>
          <View style={styles.modeButtons}>
            {(['side-by-side', 'swipe', 'overlay'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.modeBtn, ui.comparisonMode === mode && styles.modeBtnActive]}
                onPress={() => setComparisonMode(mode)}
                activeOpacity={0.75}
              >
                <ThemedText
                  variant="xs"
                  color={ui.comparisonMode === mode ? 'primary' : 'textSecondary'}
                >
                  {mode}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ComparisonView
          originalUri={originalImage?.uri ?? null}
          enhancedBase64={enhancedImageBase64}
          mode={ui.comparisonMode}
        />
        <HistogramChart />
        <EnhancementControls />
        <MetricsPanel />
        <RuleViewer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  modeBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
  },
  modeBtnActive: {
    backgroundColor: colors.border,
  },
});
