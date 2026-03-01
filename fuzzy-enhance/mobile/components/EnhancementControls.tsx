import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ParameterSlider } from './ParameterSlider';
import { ThemedText } from './ThemedText';
import { useStore } from '../store';
import { useEnhancement } from '../hooks/useEnhancement';
import { useOriginalImage } from '../store';
import { colors, spacing, borderRadius } from '../constants/theme';
import type { SliderConfig } from '../types';
import type { EnhancementParameters } from '../../shared';

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    label: 'Window Radius',
    key: 'windowRadius',
    min: 1,
    max: 8,
    step: 1,
    unit: '',
    description: 'Neighborhood size for feature extraction',
  },
  {
    label: 'Output Points',
    key: 'nDelta',
    min: 51,
    max: 511,
    step: 10,
    unit: '',
    description: 'Defuzzification resolution',
  },
];

export const EnhancementControls: React.FC = () => {
  const parameters = useStore((s) => s.parameters);
  const setParameters = useStore((s) => s.setParameters);
  const resetParameters = useStore((s) => s.resetParameters);
  const originalImage = useOriginalImage();
  const { enhance, isLoading, isError, error, reset } = useEnhancement();

  const handleApply = useCallback(() => {
    if (!originalImage?.uri) return;
    enhance({
      imageUri: originalImage.uri,
      parameters,
    });
  }, [originalImage, parameters, enhance]);

  return (
    <View style={styles.container}>
      {SLIDER_CONFIGS.map((config) => (
        <ParameterSlider
          key={config.key}
          config={config}
          value={parameters[config.key] as number}
          onChange={(v) => setParameters({ [config.key]: v })}
        />
      ))}
      <View style={styles.row}>
        <ThemedText variant="sm" color="textSecondary">Defuzzification</ThemedText>
        <View style={styles.segmented}>
          {(['centroid', 'bisector', 'mom'] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.segButton,
                parameters.defuzzMethod === method && styles.segButtonActive,
              ]}
              onPress={() => setParameters({ defuzzMethod: method })}
              activeOpacity={0.75}
            >
              <ThemedText
                variant="xs"
                color={parameters.defuzzMethod === method ? 'textPrimary' : 'textSecondary'}
              >
                {method}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText variant="sm" color="textSecondary">T-Norm</ThemedText>
        <View style={styles.segmented}>
          {(['min', 'product'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.segButton, parameters.tnorm === t && styles.segButtonActive]}
              onPress={() => setParameters({ tnorm: t })}
              activeOpacity={0.75}
            >
              <ThemedText
                variant="xs"
                color={parameters.tnorm === t ? 'textPrimary' : 'textSecondary'}
              >
                {t}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {isError && error && (
        <View style={styles.errorBox}>
          <ThemedText variant="sm" color="error">{error.message}</ThemedText>
          {error.statusCode === 0 && (
            <ThemedText variant="xs" color="textSecondary" style={styles.errorHint}>
              Ensure the backend is running (cd backend && npm run dev) and EXPO_PUBLIC_API_URL points to it.
            </ThemedText>
          )}
          <TouchableOpacity onPress={() => reset()} style={styles.dismissError}>
            <ThemedText variant="xs" color="primary">Dismiss</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primary, (!originalImage || isLoading) && styles.disabled]}
          onPress={handleApply}
          disabled={!originalImage || isLoading}
          activeOpacity={0.75}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.textPrimary} size="small" />
          ) : (
            <ThemedText variant="lg" color="textPrimary" bold>Apply Enhancement</ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => resetParameters()}
          activeOpacity={0.75}
        >
          <ThemedText variant="md" color="primary">Reset Parameters</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.md,
  },
  row: {
    marginBottom: spacing.md,
  },
  segmented: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  segButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  segButtonActive: {
    backgroundColor: colors.border,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  errorBox: {
    backgroundColor: 'rgba(255,59,48,0.15)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorHint: {
    marginTop: spacing.xs,
  },
  dismissError: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
});
