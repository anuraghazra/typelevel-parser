import { Parser, ParserError } from "./parser";
import { Tokenize } from "./tokenizer";
import { GetByField, IsUnion, TuplifyUnion } from "./utils";

type PushError<Errors extends any[], AST> = AST extends ParserError<infer E>
  ? [...Errors, E]
  : [];

export type Interpret<
  Obj extends Record<any, any>,
  AST,
  Errors extends string[] = []
> = AST extends ParserError<infer Err>
  ? Err
  : AST extends {
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
    ? Interpret<Obj[IdentName], Children, PushError<Errors, Children>>
    : Interpret<Obj, Children, PushError<Errors, Children>>
  : AST extends {
      type: "ArrayAccess";
      value: infer Ident;
      index: infer Index;
      children: infer Children;
    }
  ? Ident extends { type: "Identifier"; value: infer IdentName }
    ? Interpret<Obj[IdentName][Index], Children, PushError<Errors, Children>>
    : Ident extends ParserError<string>
    ? Interpret<Obj[Index], Ident, PushError<Errors, Ident>>
    : Interpret<Obj[Index], Children, PushError<Errors, Ident>>
  : AST extends {
      type: "WhereClause";
      value: infer FilterBy;
    }
  ? Interpret<
      IsUnion<GetByField<Obj, FilterBy>> extends true
        ? TuplifyUnion<GetByField<Obj, FilterBy>>
        : GetByField<Obj, FilterBy>,
      {},
      PushError<Errors, FilterBy>
    >
  : Errors extends []
  ? Obj
  : Errors;

type Toks = Tokenize<"comments[].$where(name:anurag)">;
type AST = Parser<Toks>;

type Demo = Interpret<
  {
    comments: [
      { id: "uid1"; name: "anurag"; content: "this is a comments" },
      { id: "uid2"; name: "anurag"; content: "type level parser" },
      { id: "uid3"; name: "jhon"; content: "ts ftw" }
    ];
  },
  AST
>;
