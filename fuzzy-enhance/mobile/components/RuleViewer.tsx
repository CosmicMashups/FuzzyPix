import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useStore } from '../store';
import { colors, spacing } from '../constants/theme';

const CONSEQUENT_COLORS: Record<string, string> = {
  STRONG_BRIGHTENING: colors.success,
  MODERATE_BRIGHTENING: '#7BCF7B',
  NO_CHANGE: colors.textSecondary,
  MODERATE_DARKENING: '#F5A5A5',
  STRONG_DARKENING: colors.error,
};

export const RuleViewer: React.FC = () => {
  const metadata = useStore((s) => s.metadata);
  const topRules = metadata?.topRuleActivations?.slice(0, 5) ?? [];

  if (topRules.length === 0) return null;

  return (
    <View style={styles.container}>
      <ThemedText variant="md" bold style={styles.title}>Top rule activations</ThemedText>
      {topRules.map((r) => (
        <View key={r.ruleId} style={styles.row}>
          <View style={styles.ruleMeta}>
            <ThemedText variant="xs" color="textSecondary">R{r.ruleId}</ThemedText>
            <ThemedText variant="sm" numberOfLines={1} style={styles.desc}>
              {r.description}
            </ThemedText>
            <ThemedText variant="xs" style={{ color: CONSEQUENT_COLORS[r.consequentTerm] ?? colors.textSecondary }}>
              {r.consequentTerm}
            </ThemedText>
          </View>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(100, r.avgFiringStrength * 100)}%`,
                  backgroundColor: CONSEQUENT_COLORS[r.consequentTerm] ?? colors.primary,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: spacing.md,
  },
  title: { marginBottom: spacing.sm },
  row: { marginBottom: spacing.sm },
  ruleMeta: { marginBottom: spacing.xs },
  desc: { marginVertical: 2 },
  barBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
