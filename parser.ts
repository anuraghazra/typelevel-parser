import { Interpret } from "./interpreter";
import { Token, Tokenize, TokenTypes } from "./tokenizer";
import { Head, Head2, ParseObj, TailBy } from "./utils";

declare const ErrorBrand: unique symbol;
export type ParserError<T extends string> = T & { __brand: typeof ErrorBrand };
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

type IsToken<
  Tok extends { type: keyof TokenTypes },
  TokenType extends keyof TokenTypes
> = Tok["type"] extends TokenType ? true : false;

type HasErrors<Value extends unknown, Else> = Value extends ParserError<string>
  ? Value
  : Else;

type GetValueIfNoParserError<T, K> = [Exclude<T, K>] extends [never]
  ? T
  : Exclude<T, K>;

type ParseIndexAccess<T extends any[]> = [
  Eat<T[0], "BRACKET_START">,
  ...(Eat<T[1], "NUMBER"> extends { type: "NUMBER" }
    ? [Eat<T[1], "NUMBER">, Eat<T[2], "BRACKET_END">]
    : [Eat<T[1], "BRACKET_END">])
] extends [infer P1, infer P2, ...infer Rest]
  ? GetValueIfNoParserError<
      HasErrors<
        P1 | P2 | Rest[0],
        P2 extends { type: "NUMBER"; value: infer Index }
          ? { type: "ArrayAccess"; index: Index; eat: 3 }
          : { type: "ArrayAccess"; index: never; eat: 3 }
      >,
      { type: "ArrayAccess" }
    >
  : never;

type ParseWhereClause<T extends any[]> = [
  Eat<T[0], "WHERE">,
  Eat<T[1], "PAREN_START">,
  Eat<T[2], "IDENT">,
  Eat<T[3], "PAREN_END">
] extends [infer P1, infer P2, infer P3, infer P4]
  ? GetValueIfNoParserError<
      HasErrors<
        P1 | P2 | P3 | P4,
        P3 extends { type: "IDENT"; name: infer Name }
          ? { type: "WhereClause"; value: ParseObj<Name & string>; eat: 4 }
          : { type: "WhereClause"; value: {}; eat: 4 }
      >,
      { type: "WhereClause" }
    >
  : never;

export type Parser<
  T extends Token[],
  AST = {},
  Cursor extends Token = Head<T>,
  LookAhead extends Token = Head2<T>
> = IsToken<Cursor, "WHERE"> extends true
  ? Parser<TailBy<T, 4>, ParseWhereClause<T>>
  : IsToken<Cursor, "IDENT"> extends true
  ? Parser<TailBy<T, 1>, AST & { type: "Identifier"; value: Cursor["name"] }>
  : IsToken<Cursor, "DOT"> extends true
  ? [LookAhead] extends [never]
    ? ParserError<`Unexpected end of input, expected IDENT`>
    : LookAhead extends { type: "IDENT" | "WHERE" }
    ? {
        type: "DotAccess";
        value: AST;
        children: Parser<TailBy<T, 1>>;
      }
    : ParserError<`Expected token of type IDENT, got ${LookAhead["type"]}`>
  : IsToken<Cursor, "BRACKET_START"> extends true
  ? ParseIndexAccess<T> extends ParserError<string>
    ? {
        type: "ArrayAccess";
        value: ParseIndexAccess<T>;
        index: ParseIndexAccess<T>["index"];
        children: Parser<TailBy<T, 3>>;
      }
    : {
        type: "ArrayAccess";
        value: AST;
        index: ParseIndexAccess<T>["index"];
        children: Parser<TailBy<T, 3>>;
      }
  : IsToken<Cursor, "BRACKET_END"> extends true
  ? ParserError<"Unexpected token BRACKET_END">
  : IsToken<Cursor, "NUMBER"> extends true
  ? ParserError<"Unexpected token NUMBER">
  : AST;

// type L3 = Parser<Tokenize<"invoices..data[0.nest">>;
// type D = ParseIndexAccess<Tokenize<"0]">>;
// type K = Interpret<{ a: { b: [0] } }, L3>;

// TODO Throw error on where syntax
type Toks = Tokenize<"b[0].i[0].id">;
type AST = Parser<Toks>;
type K = Interpret<
  {
    b: [
      { id: 1; i: [{ id: "i11" }, { id: "i12" }] },
      { id: 2; i: [{ id: "i21" }, { id: "i22" }] }
    ];
  },
  AST
>;

// OLDER ATTEMPTS

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
