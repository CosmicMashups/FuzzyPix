import { Platform } from 'react-native';
import { apiClient, ApiError } from './apiClient';
import { API_BASE_URL } from '../constants/config';
import type { EnhancementParameters } from '../../shared';
import type { EnhancementResponse } from '../../shared';

export interface EnhanceImageParams {
  imageUri: string;
  parameters: EnhancementParameters;
}

async function createImageFormPart(uri: string): Promise<Blob | { uri: string; type: string; name: string }> {
  if (Platform.OS === 'web') {
    const res = await fetch(uri);
    if (!res.ok) throw new ApiError(0, 'FETCH_IMAGE', `Failed to fetch image: ${res.status}`);
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';
    return new Blob([blob], { type: mimeType });
  }
  return {
    uri,
    type: 'image/jpeg',
    name: 'image.jpg',
  } as { uri: string; type: string; name: string };
}

async function enhanceImageWeb(params: EnhanceImageParams): Promise<EnhancementResponse['data']> {
  const imagePart = await createImageFormPart(params.imageUri);
  if (!(imagePart instanceof Blob)) throw new ApiError(0, 'INVALID_STATE', 'Expected Blob on web');

  const formData = new FormData();
  formData.append('image', imagePart, 'image.jpg');
  formData.append('windowRadius', String(params.parameters.windowRadius));
  formData.append('nDelta', String(params.parameters.nDelta));
  formData.append('defuzzMethod', params.parameters.defuzzMethod);
  formData.append('applyPostFilter', String(params.parameters.applyPostFilter));
  formData.append('tnorm', params.parameters.tnorm);
  formData.append('implicationMethod', params.parameters.implicationMethod);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/enhance`, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });
  } catch (e) {
    throw new ApiError(0, 'NETWORK_ERROR', 'Network request failed. Ensure the backend is running.');
  }

  let json: EnhancementResponse & { error?: { code?: string; message?: string } };
  try {
    json = (await res.json()) as EnhancementResponse & { error?: { code?: string; message?: string } };
  } catch {
    throw new ApiError(res.status, 'INVALID_RESPONSE', `Server returned ${res.status}`);
  }

  if (!res.ok) {
    const e = json.error;
    throw new ApiError(res.status, e?.code ?? 'UNKNOWN', e?.message ?? `Request failed: ${res.status}`);
  }
  if (!json.success || !json.data) {
    throw new ApiError(500, 'INVALID_RESPONSE', 'Invalid enhancement response');
  }
  return json.data;
}

async function enhanceImageNative(params: EnhanceImageParams): Promise<EnhancementResponse['data']> {
  const imagePart = await createImageFormPart(params.imageUri);
  if (imagePart instanceof Blob) throw new ApiError(0, 'INVALID_STATE', 'Expected URI object on native');

  const formData = new FormData();
  formData.append('image', imagePart);
  formData.append('windowRadius', String(params.parameters.windowRadius));
  formData.append('nDelta', String(params.parameters.nDelta));
  formData.append('defuzzMethod', params.parameters.defuzzMethod);
  formData.append('applyPostFilter', String(params.parameters.applyPostFilter));
  formData.append('tnorm', params.parameters.tnorm);
  formData.append('implicationMethod', params.parameters.implicationMethod);

  const res = await apiClient.post<EnhancementResponse>('/enhance', formData, {
    headers: {},
  });

  if (!res.data.success || !res.data.data) {
    throw new ApiError(500, 'INVALID_RESPONSE', 'Invalid enhancement response');
  }
  return res.data.data;
}

export async function enhanceImage(params: EnhanceImageParams): Promise<EnhancementResponse['data']> {
  if (Platform.OS === 'web') {
    return enhanceImageWeb(params);
  }
  return enhanceImageNative(params);
}

export async function checkHealth(): Promise<{ status: string; timestamp: string; uptime: number }> {
  const res = await apiClient.get('/health');
  return res.data as { status: string; timestamp: string; uptime: number };
}
