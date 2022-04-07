// UTILS
export type Split<
  Str extends string,
  SplitBy extends string,
  Acc extends string[] = []
> = Str extends ""
  ? Acc
  : Str extends `${infer P1}${SplitBy}${infer P2}`
  ? Split<P2, SplitBy, [...Acc, P1]>
  : [...Acc, Str];

export type Primitive = string | number | boolean | bigint;
export type Join<
  T extends unknown[],
  D extends string,
  Acc extends string = ""
> = T extends []
  ? ""
  : T extends [Primitive]
  ? `${Acc}${T[0]}`
  : T extends [Primitive, ...infer U]
  ? Join<U, D, `${Acc}${T[0]}${D}`>
  : string;

export type NumberMap = {
  "0": 0;
  "1": 1;
  "2": 2;
  "3": 3;
  "4": 4;
  "5": 5;
  "6": 6;
  "7": 7;
  "8": 8;
  "9": 9;
  "10": 10;
  "11": 11;
  "12": 12;
  "13": 13;
  "14": 14;
  "15": 15;
  "16": 16;
  "17": 17;
  "18": 18;
  "19": 19;
  "20": 20;
};

export type Pop<T extends unknown[]> = T extends [...infer P, infer _T]
  ? P
  : [];
export type Head<T extends unknown[]> = T extends [infer H, ...infer _P]
  ? H
  : [];
export type Head2<T extends unknown[]> = T extends [
  infer H1,
  infer H2,
  ...infer _P
]
  ? H2
  : never;
export type Tail<T extends unknown[]> = T extends [infer _H, ...infer T]
  ? T
  : [];
export type TailBy<
  T extends unknown[],
  By extends number,
  A extends number[] = []
> = By extends A["length"] ? T : TailBy<Tail<T>, By, Push<A>>;
export type Push<T extends unknown[], V = 0> = [...T, V];

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

export type TuplifyUnion<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
export type GetByField<T, Query> = Extract<T, Partial<Query>>;

export type ParseObj<
  ObjStr extends string,
  Splitted extends string[] = Split<ObjStr, ",">
> = UnionToIntersection<
  {
    [K in Splitted[number]]: Split<K, ":"> extends [infer D, infer V]
      ? {
          [P in D & string]: V extends "true"
            ? true
            : V extends "false"
            ? false
            : V extends keyof NumberMap
            ? NumberMap[V]
            : V;
        }
      : {};
  }[Splitted[number]]
>;
