import { Head, Join, NumberMap, Split, Tail } from "./utils";

type Identifier<T> = {
  type: "IDENT";
  name: T;
} & {};

export type TokenTypes = {
  PAREN_START: "PAREN_START";
  PAREN_END: "PAREN_END";
  BRACKET_START: "BRACKET_START";
  BRACKET_END: "BRACKET_END";
  DOLLAR_CLAUSE: "DOLLAR_CLAUSE";
  DOT: "DOT";
  IDENT: "IDENT";
  NUMBER: "NUMBER";
  WHERE: "WHERE";
};

export type TokenMap = {
  "(": { type: TokenTypes["PAREN_START"] };
  ")": { type: TokenTypes["PAREN_END"] };
  "[": { type: TokenTypes["BRACKET_START"] };
  "]": { type: TokenTypes["BRACKET_END"] };
  "$where": { type: TokenTypes["WHERE"] };
  ".": { type: TokenTypes["DOT"] };
};

type ExtractIdentifier<
  Acc extends string[],
  Tok = Join<Acc, "">
> = Tok extends keyof TokenMap
  ? SwitchToken<Tok>
  : Tok extends keyof NumberMap
  ? { type: "NUMBER"; value: NumberMap[Tok] }
  : Acc extends []
  ? never
  : Identifier<Tok>;

type E = ExtractIdentifier<['where']>

type SwitchToken<T> = T extends keyof TokenMap ? TokenMap[T] : T;

type TokenizeInternal<
  Tokens extends string[],
  Acc extends string[] = [],
  Curr = Head<Tokens>
> = Curr extends []
  ? Acc extends []
    ? []
    : [ExtractIdentifier<Acc>]
  : Curr extends keyof TokenMap
  ? Acc["length"] extends 0
    ? // if accumulator is empty then we can just go as single tokens
      [SwitchToken<Curr>, ...TokenizeInternal<Tail<Tokens>>]
    : // else extract the identifier
      [
        ExtractIdentifier<Acc>,
        SwitchToken<Curr>,
        ...TokenizeInternal<Tail<Tokens>>
      ]
  : [...TokenizeInternal<Tail<Tokens>, [...Acc, Extract<Curr, string>]>];

export type Tokenize<T extends string> = TokenizeInternal<Split<T, "">>;

type Demo1 = Tokenize<"invoices.$where(1)">;
type Demo2 = Tokenize<"invoices.data[].$where(id:2)">;
// type Demo3 = Tokenize<"comments[].$where(id:abcdefghijklm)">;