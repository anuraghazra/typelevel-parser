import { ParserError } from "./parser";

type PushError<Errors extends any[], AST> = AST extends ParserError<infer E>
  ? [...Errors, E]
  : [];

export type Interpret<
  Obj,
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
  : Errors extends []
  ? Obj
  : Errors;
