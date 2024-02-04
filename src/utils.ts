/**
 * Debugging type that will display a fully resolved type
 * in Intellisense instead of just the type aliases
 *
 * @type {T} The type to expand out
 */
export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
    ? T extends infer O
      ? { [K in keyof O]: ExpandRecursively<O[K]> }
      : never
    : T;
