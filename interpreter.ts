export type Interpret<Obj, AST> = AST extends {
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
