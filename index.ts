import { Head, TailBy } from "./utils";
import { TokenTypes, Tokenize } from "./tokenizer";

// ----
// PARSER
// ----

type ParserError<T extends string> = T & { __brand: "ParserError" };
type Expect<T extends { type: keyof TokenTypes }, Type extends string, Else> = [
  T
] extends [never]
  ? ParserError<`Unexpected end of input, Expected token of type ${Type}`>
  : T extends undefined
  ? ParserError<`Unexpected end of input, Expected token of type ${Type}`>
  : T["type"] extends Type
  ? Else
  : ParserError<`Expected token of type ${Type}, got ${T["type"]}`>;

type Eat<T extends { type: keyof TokenTypes }, Type extends string> = Expect<
  T,
  Type,
  true
> extends true
  ? T
  : Expect<T, Type, true>;

type HasErrors<E extends ParserError<any>, Else> = E extends ParserError<
  infer M
>
  ? E
  : Else;

type IsToken<
  Tok extends { type: string },
  TokenType extends keyof TokenTypes
> = Tok["type"] extends TokenType ? true : false;

// RAW Parser
// OLD Initial attempt
// type Parser<
//   Obj,
//   T extends any[],
//   Curr extends { type: string } = Head<T>,
//   LookAhead extends { type: keyof TokenTypes } = Head2<T>
// > = T extends []
//   ? Obj
//   : IsToken<Curr, "IDENT"> extends true
//   ? Parser<
//       Obj[Curr["name"]] extends any[]
//         ? IsToken<LookAhead, "NUMBER"> extends false
//           ? Obj[Curr["name"]][number]
//           : Obj[Curr["name"]]
//         : Obj[Curr["name"]],
//       Tail<T>
//     >
//   : IsToken<Curr, "DOT"> extends true
//   ? Parser<Obj extends any[] ? Obj[number] : Obj, Tail<T>>
//   : IsToken<Curr, "BRACKET_START"> extends true
//   ? Expect<LookAhead, "NUMBER" | "BRACKET_END", Parser<Obj, Tail<T>>>
//   : IsToken<Curr, "BRACKET_END"> extends true
//   ? Parser<Obj, Tail<T>>
//   : IsToken<Curr, "NUMBER"> extends true
//   ? Expect<LookAhead, "BRACKET_END", Parser<Obj[Curr["value"]], Tail<T>>>
//   : Obj;

// type ParseDotAccess<T extends any[]> = [
//   Eat<T[0], "IDENT">,
//   Eat<T[1], "DOT">
// ] extends [infer A, infer Dot]
//   ? Dot extends ParserError<infer E>
//     ? { type: "Access"; name: A["name"]; eat: 1 }
//     : {
//         eat: 3;
//         type: "DotAccess";
//         left: A;
//         right: ParseDotAccess<Tail<Tail<T>>>;
//       }
//   : never;

type ParseIndexAccess<T extends any[]> = [
  Eat<T[0], "BRACKET_START">,
  ...(Eat<T[1], "NUMBER"> extends { type: "NUMBER" }
    ? [Eat<T[1], "NUMBER">, Eat<T[2], "BRACKET_END">]
    : [Eat<T[1], "BRACKET_END">])
] extends [infer P1, infer P2, ...infer Rest]
  ? HasErrors<
      P1 | P2 | Rest[0],
      P2 extends { type: "NUMBER" }
        ? { type: "ArrayAccess"; index: P2["value"]; eat: 3 }
        : { type: "ArrayAccess"; index: never; eat: 3 }
    >
  : never;

// Second attempt
// type ParseV2<Obj, T extends any[]> = ParseDotAccess<T> extends {
//   left: infer L;
//   right: infer R;
// }
//   ? L extends { type: "IDENT" }
//     ? ParseV2<Obj[L["name"]], Tail<Tail<Tail<T>>>>
//     : [L, R]
//   : ParseIndexAccess<T> extends { index: infer Index }
//   ? ParseV2<Obj[Index], Tail<Tail<Tail<T>>>>
//   : T[0] extends { type: "DOT" }
//   ? ParseV2<Obj[T[1]["name"]], Tail<T>>
//   : Obj;

type ParseAccess<T extends any[], AST = {}> = IsToken<
  Head<T>,
  "IDENT"
> extends true
  ? ParseAccess<
      TailBy<T, 1>,
      AST & { type: "Identifier"; value: Head<T>["name"] }
    >
  : IsToken<Head<T>, "DOT"> extends true
  ? {
      type: "DotAccess";
      value: AST;
      children: ParseAccess<TailBy<T, 1>>;
    }
  : IsToken<Head<T>, "BRACKET_START"> extends true
  ? {
      type: "ArrayAccess";
      value: AST;
      index: ParseIndexAccess<T>["index"];
      children: ParseAccess<TailBy<T, 3>>;
    }
  : AST;

// type L2 = ParseDotAccess<Tokenize<".a">>;
type L1 = ParseIndexAccess<Tokenize<"[0]">>;
type L3 = ParseAccess<Tokenize<"a.b.c[0]">>;

type Interpret<Obj, AST> = AST extends {
  type: "Identifier";
  value: infer Ident;
}
  ? Obj[Ident]
  : AST extends {
      type: "DotAccess";
      value: infer Ident;
      children: infer Children;
    }
  ? Ident extends { type: "Identifier"; value: infer IdentName }
    ? Interpret<Obj[IdentName], Children>
    : Interpret<Obj, Children>
  : AST extends {
      type: "ArrayAccess";
      value: infer Ident;
      index: infer Index;
      children: infer Children;
    }
  ? Ident extends { type: "Identifier"; value: infer IdentName }
    ? Interpret<Obj[IdentName][Index], Children>
    : Interpret<Obj[Index], Children>
  : Obj;

const obj2 = {
  invoices: {
    data: [
      {
        id: 2,
        name: "nice",
        nest: {
          data: ["nested a", [{ a: { b: { c: "WOAAAHHH I reached here!" } } }]],
        },
      },
      { id: 3, name: "nice", nest: { data: "nested b" } },
    ],
  },
} as const;

type Toks = Tokenize<"invoices.data[0].nest.data[1][0].a.b.c">;
type AST = ParseAccess<Toks>;

type Demo = Interpret<typeof obj2, AST>;
