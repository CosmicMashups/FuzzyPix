import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../constants/theme';

interface ThemedTextProps extends TextProps {
  variant?: keyof typeof typography;
  color?: keyof typeof colors;
  bold?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'md',
  color = 'textPrimary',
  bold,
  style,
  ...rest
}) => {
  return (
    <Text
      style={[
        { fontSize: typography[variant], color: colors[color] },
        bold && styles.bold,
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  bold: { fontWeight: '600' },
});
