import { Tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { Interpret } from "./interpreter";
import { PathAutocomplete } from "./autocomplete";

const obj2 = {
  comments: [
    {
      id: 1,
      content: "Content 1",
      user: { login: "ah" },
    },
    {
      id: 2,
      content: "Content 2",
      user: { login: "ah" },
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
  user: {
    a: {
      b: 1,
    },
  },
} as const;

type Toks = Tokenize<"comments[].$where(id:1)">;
type AST = Parser<Toks>;
type Demo = Interpret<typeof obj2, AST>;

type PathDemo = PathAutocomplete<typeof obj2>;

function get<Obj, T>(
  obj: Obj,
  path: T | PathAutocomplete<Obj>
): Interpret<Obj, Parser<Tokenize<T & string>>> {
  return {} as Interpret<Obj, Parser<Tokenize<T & string>>>;
}

const t = get(obj2, "comments[].$where(id:1)");
