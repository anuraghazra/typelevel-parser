import { PathAutocomplete } from "./autocomplete";
import { Interpret } from "./interpreter";
import { Parser } from "./parser";
import { Tokenize } from "./tokenizer";

type Run<Obj, T extends PathAutocomplete<Obj>> = Interpret<
  Obj,
  Parser<Tokenize<T & string>>
>;

const obj = {
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
} as const;

// It's soooo big I can't even show the whole thing.

type Demo = Run<
  typeof obj,
  "commentsssssssssssssssss.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child.nest.child[]"
>;
