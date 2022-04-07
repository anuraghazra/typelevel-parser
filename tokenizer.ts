import { Head, Head2, Join, NumberMap, Split, Tail } from "./utils";

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
  $where: { type: TokenTypes["WHERE"] };
  ".": { type: TokenTypes["DOT"] };
};
export type Token = { type: keyof TokenTypes; [x: string]: any };

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

type SwitchToken<T> = T extends keyof TokenMap ? TokenMap[T] : T;

type TokenizeInternal<
  Tokens extends string[],
  Acc extends string[] = [],
  Curr = Head<Tokens>,
  Res extends any[] = []
> = Curr extends []
  ? Acc extends []
    ? Res
    : [...Res, ExtractIdentifier<Acc>]
  : Curr extends keyof TokenMap
  ? Acc["length"] extends 0
    ? // if accumulator is empty then we can just go as single tokens
      TokenizeInternal<
        Tail<Tokens>,
        [],
        Head<Tail<Tokens>>,
        [...Res, SwitchToken<Curr>]
      >
    : // else extract the identifier
      TokenizeInternal<
        Tail<Tokens>,
        [],
        Head<Tail<Tokens>>,
        [...Res, ExtractIdentifier<Acc>, SwitchToken<Curr>]
      >
  : TokenizeInternal<
      Tail<Tokens>,
      [...Acc, Extract<Curr, string>],
      Head<Tail<Tokens>>,
      Res
    >;

export type Tokenize<T extends string> = TokenizeInternal<Split<T, "">>;

type Demo1 = Tokenize<"hello.world.this.is.typescript[].$where(is:awesome)">;
type Demo2 = Tokenize<"comments[].$where(id:3)">;
