export function createAxis(
  id: string,
  labelString: string,
  position: string,
  fontColor: string,
  gridLines?: any
) {
  const ret: any = {
    id,
    display: true,
    scaleLabel: {
      display: true,
      labelString,
      fontColor
    },
    position
  };
  if (gridLines) {
    ret.gridLines = gridLines;
  }
  return ret;
}
export function formatPercent(num: number) {
  const percent = +(num * 100).toFixed(2);
  return `${percent}%`;
}
