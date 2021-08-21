/** Global definitions for development **/

// Only genetic typings should exist in this file

// Omit type https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-377567046
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialPick<T, K extends keyof T> = Partial<T> & Pick<T, K>;

declare var Highlight: any;

declare module "react-highlight" {
  export default Highlight;
}
