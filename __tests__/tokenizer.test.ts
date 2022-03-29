import { Tokenize } from "../tokenizer";
import { Equal, Expect } from "./test-utils";

export type TestEmptyString = Tokenize<"">;
export type TestSingleIdent = Tokenize<"hello">;
export type TestLongIdent =
  Tokenize<"helooooooooooooooooooooooooooooooooooooooooooooooooooooo">;
export type TestDotAccess = Tokenize<"a.b">;
export type TestMultipleDotAccess = Tokenize<"a.b.c.d">;
export type TestArrayAccess = Tokenize<"a[]">;
export type TestArrayIndexAccess = Tokenize<"a[0]">;
export type TestArrayAccessDotAccess = Tokenize<"a[0].id">;
export type TestMultipleArrayAccess = Tokenize<"a[0][1][2][3]">;
export type TestWhereClause = Tokenize<"a[].$where(id:1)">;
export type TestWhereClauseDot = Tokenize<"a[].$where(id:1).id">;
export type TestMultiWhereClause =
  Tokenize<"a[].$where(id:1).users[].$where(id:2)">;

type Tests = [
  Expect<Equal<TestEmptyString, []>>,
  Expect<
    Equal<
      TestSingleIdent,
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
      TestLongIdent,
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
      TestDotAccess,
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
      TestMultipleDotAccess,
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
      TestArrayAccess,
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
      TestArrayIndexAccess,
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
      TestArrayAccessDotAccess,
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
      TestMultipleArrayAccess,
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
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 1;
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 2;
        },
        {
          type: "BRACKET_END";
        },
        {
          type: "BRACKET_START";
        },
        {
          type: "NUMBER";
          value: 3;
        },
        {
          type: "BRACKET_END";
        }
      ]
    >
  >,
  Expect<
    Equal<
      TestWhereClause,
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
      TestWhereClauseDot,
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
      TestMultiWhereClause,
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
