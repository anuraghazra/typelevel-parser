import { Tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { Interpret } from "./interpreter";
import { ParseObj } from "./utils";

const obj2 = {
  comments: [
    {
      id: 1,
      content: "Content 1",
      user: { login: "anuraghazra" },
    },
    {
      id: 2,
      content: "Content 2",
      user: { login: "anuraghazra" },
    },
    {
      id: 3,
      content: "Content 3",
      user: { login: "jhondoe" },
    },
    {
      id: 4,
      content: "Content 4",
      user: { login: "jhondoe" },
    },
  ],
} as const;

type Toks = Tokenize<"a[].$where(id:1).$where(a:a)">;
type AST = Parser<Toks>;

type Demo = Interpret<typeof obj2, AST>;

function get<Obj, T extends string>(
  obj: Obj,
  path: T
): Interpret<Obj, Parser<Tokenize<T>>> {
  return {} as Interpret<Obj, Parser<Tokenize<T>>>;
}

const t = get({ a: { b: [{ c: { d: 1 } }] } }, "a.b[0]");
