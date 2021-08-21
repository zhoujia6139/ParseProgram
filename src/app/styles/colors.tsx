/* Some of these colors are also defined in pages/quickApp/stylesheets/partials/_colors.scss */

import * as Color from 'color';

type BrandColorKey =
  | 'NIGHT'
  | 'NIGHT_90'
  | 'NIGHT_80'
  | 'NIGHT_70'
  | 'NIGHT_60'
  | 'NIGHT_50'
  | 'NIGHT_40'
  | 'CLOUD'
  | 'CLOUD_70'
  | 'CLOUD_50'
  | 'CLOUD_30'
  | 'CLOUD_20'
  | 'SKY'
  | 'SKY_80'
  | 'SKY_TONE_45'
  | 'SKY_TONE_30'
  | 'SKY_TONE_15'
  | 'ACCENT_GREEN'
  | 'ACCENT_YELLOW'
  | 'ACCENT_YELLOW_07'
  | 'ACCENT_YELLOW_70'
  | 'ACCENT_RED'
  | 'ACCENT_RED_07'
  | 'ACCENT_RED_70'
  | 'ACCENT_RED_DARK'
  | 'ACCENT_ORANGE'
  | 'ACCENT_PURPLE'
  | 'ACCENT_SKY_07'
  | 'ACCENT_SKY_15'
  | 'ACCENT_SKY_70'
  | 'WHITE'
  | 'BLACK'
  | 'WHITE_50'
  | 'WHITE_80'
  | 'BACKGROUND_GREY'
  | 'LOSS'
  | 'GAIN'
  | 'LOSS_LIGHT'
  | 'GAIN_LIGHT'
  | 'BOX_SHADOW';

type Colors = { [key in BrandColorKey]: string };

function mix(a: string, b: string, percentage: number) {
  return Color(b)
    .mix(Color(a), percentage)
    .hex();
}

// app page background color
const BACKGROUND_GREY = '#F9F9F9';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const NIGHT = '#143859';
const SKY = '#66C3CC';
const ACCENT_RED = '#DB3751';
const ACCENT_YELLOW = '#F2C849';
const ACCENT_ORANGE = '#F5A623';
const ACCENT_PURPLE = '#7372D7';
const ACCENT_GREEN = '#39BF7C';
const CLOUD = mix(NIGHT, WHITE, 0.3);
const WHITE_50 = Color(WHITE)
  .alpha(0.5)
  .hsl()
  .string();
const WHITE_80 = Color(WHITE)
  .alpha(0.8)
  .hsl()
  .string();

export const CommonColors: Readonly<Colors> = {
  WHITE, // "#FFFFFF"
  WHITE_50, // WHITE at 50% opacity
  WHITE_80, // WHITE at 80% opacity
  BLACK, // "#000000"
  BACKGROUND_GREY, // #F9F9F9

  NIGHT, // "#143859"
  NIGHT_90: mix(NIGHT, WHITE, 0.9), // "#2B4C6A"
  NIGHT_80: mix(NIGHT, WHITE, 0.8), // "#43607A"
  NIGHT_70: mix(NIGHT, WHITE, 0.7), // "#5B748B"
  NIGHT_60: mix(NIGHT, WHITE, 0.6), // "#72889B"
  NIGHT_50: mix(NIGHT, WHITE, 0.5), // "#8A9CAC"
  NIGHT_40: mix(NIGHT, WHITE, 0.4), // "#A1AFBD"

  CLOUD, // "#B9C3CD"
  CLOUD_70: mix(CLOUD, WHITE, 0.7), // "#CED5DC"
  CLOUD_50: mix(CLOUD, WHITE, 0.5), // "#DCE1E6"
  CLOUD_30: mix(CLOUD, WHITE, 0.3), // "#EAEDF0"
  CLOUD_20: mix(CLOUD, WHITE, 0.2), // "#F1F3F5"

  SKY, // "#66C3CC"
  SKY_80: mix(SKY, WHITE, 0.9), // "#75C9D1"
  SKY_TONE_45: mix(NIGHT, SKY, 0.45), // "#5AAEBB"
  SKY_TONE_30: mix(NIGHT, SKY, 0.3), // "#4D99A9"
  SKY_TONE_15: mix(NIGHT, SKY, 0.15), // "#418498"

  ACCENT_RED, // '#DB3751'
  ACCENT_RED_07: mix(ACCENT_RED, WHITE, 0.07),
  ACCENT_RED_70: mix(ACCENT_RED, WHITE, 0.7),
  ACCENT_RED_DARK: mix(BLACK, ACCENT_RED, 0.2),
  ACCENT_SKY_07: mix(SKY, WHITE, 0.07),
  ACCENT_SKY_15: mix(SKY, WHITE, 0.15),
  ACCENT_SKY_70: mix(SKY, WHITE, 0.7),
  ACCENT_ORANGE, // '#F5A623'
  ACCENT_PURPLE, // '#7372D7'
  ACCENT_GREEN, // '#39BF7C'
  ACCENT_YELLOW, // '#F2C849'
  ACCENT_YELLOW_07: mix(ACCENT_YELLOW, WHITE, 0.07),
  ACCENT_YELLOW_70: mix(ACCENT_YELLOW, WHITE, 0.7),
  LOSS: '#a54a34',
  GAIN: '#3e8654',
  LOSS_LIGHT: '#e9d1cb',
  GAIN_LIGHT: '#ccded1',
  BOX_SHADOW: 'rgba(0, 0, 0, 0.08)' // Custom color for box shadows
};
