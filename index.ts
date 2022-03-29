import { Tokenize } from "./tokenizer";
import { Parser } from "./parser";
import { Interpret } from "./interpreter";
import { PathAutocomplete } from "./autocomplete";

const obj2 = {
  comments: [
    {
      id: 1,
      uid: "ah",
      content: "Content 1",
    },
    {
      id: 2,
      uid: "ah",
      content: "Content 2",
    },
    {
      id: 3,
      uid: "jd",
      content: "Content 3",
    },
    {
      id: 4,
      uid: "jd",
      content: "Content 4",
    },
  ],
} as const;

type Toks = Tokenize<"comments[].$where(uid:ah)">;
type AST = Parser<Toks>;

type Demo = Interpret<typeof obj2, AST>;

type PathDemo = PathAutocomplete<typeof obj2>;

function get<Obj, T>(
  obj: Obj,
  path: T | PathAutocomplete<Obj>
): Interpret<Obj, Parser<Tokenize<T & string>>> {
  return {} as Interpret<Obj, Parser<Tokenize<T & string>>>;
}

type Test1 = Tokenize<"commentsssssssssssssssss.invoices.data.users.nice.work.here.fa">;
type Test2 = Tokenize<"comments.invoices.anurag.hazra.abcdefghijklm.a">;
type ASTLimit = Parser<Test1>;

const t = get(
  {
    commentsssssssssssssssss: {
      nest: {
        child: {
          nest: {
            child: {
              nest: {
                child: {
                  nest: {
                    child: {
                      nest: {
                        child: {
                          nest: {
                            child: {
                              nest: {
                                child: {
                                  nest: {
                                    child: {
                                      nest: {
                                        child: {
                                          nest: {
                                            child: [1, 2, 3],
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  } as const,
  "commentsssssssssssssssss.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child[]"
);
