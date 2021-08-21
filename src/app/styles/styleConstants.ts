import { CommonColors } from './colors';
import { CSSProperties } from 'aphrodite';

export const primaryLinkButtonStyle: CSSProperties = {
  color: CommonColors.SKY_TONE_30
};

export const boxShadowBottom: CSSProperties = {
  boxShadow: `0 1px 3px ${CommonColors.BOX_SHADOW}`
};

export const fontSize: Record<string, CSSProperties> = {
  sm: { fontSize: '1.2rem' },
  md: { fontSize: '1.6rem' },
  lg: { fontSize: '1.8rem' }
};

export const defaultScaleFactor = 0.96;
export const defaultScaleDown = `scale(${defaultScaleFactor})`;
