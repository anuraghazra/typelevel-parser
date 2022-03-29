import { Tokenize } from "../tokenizer";
import { Equal, Expect } from "./test-utils";

type EmptyString = Tokenize<"">;
type SingleIdent = Tokenize<"hello">;
type LongIdent =
  Tokenize<"helooooooooooooooooooooooooooooooooooooooooooooooooooooo">;
type DotAccess = Tokenize<"a.b">;
type MultipleDotAccess = Tokenize<"a.b.c.d">;
type ArrayAccess = Tokenize<"a[]">;
type ArrayIndexAccess = Tokenize<"a[0]">;
type ArrayAccessDotAccess = Tokenize<"a[0].id">;
type MultipleArrayAccess = Tokenize<"a[][][][0]">;
type WhereClause = Tokenize<"a[].$where(id:1)">;
type WhereClauseDot = Tokenize<"a[].$where(id:1).id">;
type MultiWhereClause = Tokenize<"a[].$where(id:1).users[].$where(id:2)">;

type Tests = [
  Expect<Equal<EmptyString, []>>,
  Expect<
    Equal<
      SingleIdent,
      [
        {
          type: "IDENT";
          name: "hello";
        }
      ]
    >
  >,
  Expect<
    Equal<
      LongIdent,
      [
        {
          type: "IDENT";
          name: "helooooooooooooooooooooooooooooooooooooooooooooooooooooo";
        }
      ]
    >
  >,
  Expect<
    Equal<
      DotAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "b";
        }
      ]
    >
  >,
  Expect<
    Equal<
      MultipleDotAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "b";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "c";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "d";
        }
      ]
    >
  >,
  Expect<
    Equal<
      ArrayAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        }
      ]
    >
  >,
  Expect<
    Equal<
      ArrayIndexAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 0;
        },
        {
          type: "BRACKET_END";
        }
      ]
    >
  >,
  Expect<
    Equal<
      ArrayAccessDotAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 0;
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "id";
        }
      ]
    >
  >,
  Expect<
    Equal<
      MultipleArrayAccess,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 0;
        },
        {
          type: "BRACKET_END";
        }
      ]
    >
  >,
  Expect<
    Equal<
      WhereClause,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "DOT";
        },
        {
          type: "WHERE";
        },
        {
          type: "PAREN_START";
        },
        {
          type: "IDENT";
          name: "id:1";
        },
        {
          type: "PAREN_END";
        }
      ]
    >
  >,
  Expect<
    Equal<
      WhereClauseDot,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "DOT";
        },
        {
          type: "WHERE";
        },
        {
          type: "PAREN_START";
        },
        {
          type: "IDENT";
          name: "id:1";
        },
        {
          type: "PAREN_END";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "id";
        }
      ]
    >
  >,
  Expect<
    Equal<
      MultiWhereClause,
      [
        {
          type: "IDENT";
          name: "a";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "DOT";
        },
        {
          type: "WHERE";
        },
        {
          type: "PAREN_START";
        },
        {
          type: "IDENT";
          name: "id:1";
        },
        {
          type: "PAREN_END";
        },
        {
          type: "DOT";
        },
        {
          type: "IDENT";
          name: "users";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "DOT";
        },
        {
          type: "WHERE";
        },
        {
          type: "PAREN_START";
        },
        {
          type: "IDENT";
          name: "id:2";
        },
        {
          type: "PAREN_END";
        }
      ]
    >
  >
];
