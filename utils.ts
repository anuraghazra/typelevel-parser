// UTILS
export type Split<
  Str extends string,
  SplitBy extends string
> = Str extends `${infer P1}${SplitBy}${infer P2}`
  ? [P1, ...Split<P2, SplitBy>]
  : Str extends ""
  ? []
  : [Str];

export type Primitive = string | number | boolean | bigint;
export type Join<T extends unknown[], D extends string> = T extends []
  ? ""
  : T extends [Primitive]
  ? `${T[0]}`
  : T extends [Primitive, ...infer U]
  ? `${T[0]}${D}${Join<U, D>}`
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

export type Pop<T extends unknown[]> = T extends [...infer P, infer _T] ? P : [];
export type Head<T extends unknown[]> = T extends [infer H, ...infer _P] ? H : [];
export type Head2<T extends unknown[]> = T extends [infer H1, infer H2, ...infer _P]
  ? H2
  : never;
export type Tail<T extends unknown[]> = T extends [infer _H, ...infer T] ? T : [];
export type TailBy<
  T extends unknown[],
  By extends number,
  A extends number[] = []
> = By extends A["length"] ? T : TailBy<Tail<T>, By, Push<A>>;
export type Push<T extends unknown[]> = [...T, 0];
