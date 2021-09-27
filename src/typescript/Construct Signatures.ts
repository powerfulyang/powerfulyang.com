export type SomeConstructor = {
  new (s: string): Record<string, string>;
};
export interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
export function fn(Ctor: SomeConstructor) {
  return new Ctor('hello');
}
