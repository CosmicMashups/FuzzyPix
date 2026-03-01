import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '../store';
import { MAX_IMAGE_DIMENSION } from '../constants/config';
import { resizeImageIfNeeded } from '../services/imageService';
import type { ImagePickerResult } from '../types';

export function useImagePicker(): {
  pickImage: () => Promise<void>;
  pickFromCamera: () => Promise<void>;
  isPermissionDenied: boolean;
  requestPermission: () => Promise<void>;
} {
  const setOriginalImage = useStore((s) => s.setOriginalImage);

  const requestPermission = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
  }, []);

  const pickImage = useCallback(async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    let uri = asset.uri;
    try {
      uri = await resizeImageIfNeeded(uri, MAX_IMAGE_DIMENSION);
    } catch (_) {}
    const pick: ImagePickerResult = {
      uri,
      width: asset.width ?? 0,
      height: asset.height ?? 0,
      mimeType: 'image/jpeg',
    };
    setOriginalImage(pick);
  }, [setOriginalImage]);

  const pickFromCamera = useCallback(async (): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    let uri = asset.uri;
    try {
      uri = await resizeImageIfNeeded(uri, MAX_IMAGE_DIMENSION);
    } catch (_) {}
    const pick: ImagePickerResult = {
      uri,
      width: asset.width ?? 0,
      height: asset.height ?? 0,
      mimeType: 'image/jpeg',
    };
    setOriginalImage(pick);
  }, [setOriginalImage]);

  return {
    pickImage,
    pickFromCamera,
    isPermissionDenied: false,
    requestPermission,
  };
}
