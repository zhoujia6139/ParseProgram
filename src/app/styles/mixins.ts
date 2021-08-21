import { CSSProperties } from 'aphrodite';

type BorderStyle =
  | 'dotted'
  | 'dashed'
  | 'solid'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'none'
  | 'hidden';

// type BorderSideType = 'border' | 'borderBottom' | 'borderTop' | 'borderLeft' | 'borderRight';
//
// type TransitionTimingFunction =
//   | 'linear'
//   | 'ease'
//   | 'ease-in'
//   | 'ease-out'
//   | 'ease-in-out'
//   | 'step-start'
//   | 'step-end'
//   | 'initial'
//   | 'inherit';

export function borderBottom(
  color: string,
  width = 1,
  style: BorderStyle = 'solid'
): CSSProperties {
  return { borderBottom: `${width}px ${style} ${color}` };
}
