import { Interpret } from "./interpreter";
import { Parser } from "./parser";
import { Tokenize } from "./tokenizer";

type Run<T extends string> = Interpret<{}, Parser<Tokenize<T>>>

type Demo1 = Run<'a.'>;
//   ^? "Unexpected end of input, expected IDENT"
type Demo2 = Run<'a.b['>;
//   ^? "Unexpected end of input, Expected token of type BRACKET_END"
type Demo3 = Run<'a.b]'>;
//   ^? "Unexpected token BRACKET_END"
type Demo4 = Run<'a.b[0'>;
//   ^? "Unexpected end of input, Expected token of type BRACKET_END"
type Demo5 = Run<'a.b[0]]'>;
//   ^? "Unexpected token BRACKET_END"
type Demo6 = Run<'a.b[0].'>;
//   ^? "Unexpected end of input, expected IDENT"
type Demo7 = Run<'a.b[0].['>;
//   ^? "Expected token of type IDENT, got BRACKET_START"
type Demo8 = Run<'a.b[0].]'>;
//   ^? "Expected token of type IDENT, got BRACKET_END"
type Demo9 = Run<'a.b[0]..'>;
//   ^? "Expected token of type IDENT, got DOT"
