export const colors = {
  primary: '#1A73E8',
  secondary: '#34A853',
  background: '#0F0F0F',
  surface: '#1C1C1E',
  border: '#2C2C2E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 28,
  display: 34,
} as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadow = {
  card: {
    boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.25)',
    elevation: 3,
  },
} as const;
