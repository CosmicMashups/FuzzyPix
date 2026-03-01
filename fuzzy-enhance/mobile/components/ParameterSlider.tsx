import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from './ThemedText';
import { colors, spacing, typography } from '../constants/theme';
import type { SliderConfig } from '../types';

interface ParameterSliderProps {
  config: SliderConfig;
  value: number;
  onChange: (value: number) => void;
}

const THROTTLE_MS = 100;

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  config,
  value,
  onChange,
}) => {
  const lastCall = useRef(0);
  const handleChange = useCallback(
    (v: number) => {
      const now = Date.now();
      if (now - lastCall.current >= THROTTLE_MS) {
        lastCall.current = now;
        onChange(v);
      }
    },
    [onChange]
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText variant="sm" color="textSecondary">
          {config.label}
        </ThemedText>
        <ThemedText variant="sm" color="primary">
          {value}{config.unit}
        </ThemedText>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={config.min}
        maximumValue={config.max}
        step={config.step}
        value={value}
        onValueChange={handleChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      <View style={styles.row}>
        <ThemedText variant="xs" color="textSecondary">
          {config.min}{config.unit}
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          {config.max}{config.unit}
        </ThemedText>
      </View>
      {config.description ? (
        <ThemedText variant="xs" color="textSecondary" style={styles.desc}>
          {config.description}
        </ThemedText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: { width: '100%', height: 40 },
  desc: { marginTop: spacing.xs },
});
