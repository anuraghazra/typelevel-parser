// Autocomplete is not ready yet
import { NumberMap } from "./utils";

type ArrayKeys = keyof (readonly [] | any[]);
type NumberKeys = keyof number;

type StringifyObject<T> = T extends any
  ? keyof {
      [K in keyof T as T[K] extends Record<string, any>
        ? never
        : `${K & string}:${Extract<T[K], string | number>}`];
    } &
      string
  : never;

type PathRecursive<T, Key extends keyof T> = Key extends string
  ? T[Key] extends ReadonlyArray<any> | Array<any>
    ?
        | `${Key}[${Exclude<keyof T[Key], ArrayKeys> & string}]`
        | `${Key}[${Exclude<keyof T[Key], ArrayKeys> & string}].${PathRecursive<
            T[Key],
            Exclude<keyof T[Key], ArrayKeys> & string
          >}`
        | `${Key}[]`
        | `${Key}[].${PathRecursive<
            T[Key],
            Exclude<keyof T[Key], ArrayKeys> & string
          >}`
        | `${Key}[].$where(${StringifyObject<T[Key][number]>})`
    : Key extends keyof NumberMap
    ? PathRecursive<
        T[Key],
        Exclude<keyof T[Key], ArrayKeys | NumberKeys> & string
      >
    : T[Key] extends Record<string, any>
    ?
        | Key
        | `${Key}.${PathRecursive<
            T[Key],
            Exclude<keyof T[Key], ArrayKeys | NumberKeys> & string
          >}`
        | `${Key}.${Exclude<keyof T[Key], ArrayKeys | NumberKeys> & string}`
    : Key
  : never;

export type PathAutocomplete<T> =
  | (PathRecursive<T, keyof T> | keyof T)
  | (string & {});
