import { Tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { Interpret } from "./interpreter";

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
type AST = Parser<Toks>;

type Demo = Interpret<typeof obj2, AST>;
