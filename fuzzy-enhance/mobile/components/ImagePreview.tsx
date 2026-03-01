import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../constants/theme';

interface ImagePreviewProps {
  uri: string | null;
  width?: number;
  height?: number;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  uri,
  width = 200,
  height = 200,
}) => {
  if (!uri) return <View style={[styles.placeholder, { width, height }]} />;
  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width, height }]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
});
