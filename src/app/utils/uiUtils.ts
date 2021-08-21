export function getColorFromChange(percent: number) {
  if (percent > 0.005) {
    return '#039630';
  } else if (percent > 0.0025) {
    return '#47c16e';
  } else if (percent < -0.005) {
    return '#ff0000';
  } else if (percent < -0.025) {
    return 'fc766a';
  }
  return '#333333';
}
