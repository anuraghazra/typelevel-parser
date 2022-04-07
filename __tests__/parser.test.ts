import { Parser, ParserError } from "../parser";
import { Tokenize } from "../tokenizer";
import { Equal, Expect } from "./test-utils";
import {
  TestEmptyString,
  TestSingleIdent,
  TestLongIdent,
  TestDotAccess,
  TestMultipleDotAccess,
  TestArrayAccess,
  TestArrayIndexAccess,
  TestArrayAccessDotAccess,
  TestMultipleArrayAccess,
  TestWhereClause,
  TestWhereClauseDot,
  TestMultiWhereClause,
} from "./tokenizer.test";

export type TestEmptyStringAST = Parser<TestEmptyString>;
export type TestSingleIdentAST = Parser<TestSingleIdent>;
export type TestLongIdentAST = Parser<TestLongIdent>;
export type TestDotAccessAST = Parser<TestDotAccess>;
export type TestMultipleDotAccessAST = Parser<TestMultipleDotAccess>;
export type TestArrayAccessAST = Parser<TestArrayAccess>;
export type TestArrayIndexAccessAST = Parser<TestArrayIndexAccess>;
export type TestArrayAccessDotAccessAST = Parser<TestArrayAccessDotAccess>;
export type TestMultipleArrayAccessAST = Parser<TestMultipleArrayAccess>;
export type TestWhereClauseAST = Parser<TestWhereClause>;
export type TestWhereClauseDotAST = Parser<TestWhereClauseDot>;
export type TestMultiWhereClauseAST = Parser<TestMultiWhereClause>;

// Sad paths

export type TestInvalidDot1 = Parser<Tokenize<"a.">>;
export type TestInvalidDot2 = Parser<Tokenize<".">>;
export type TestInvalidDot3 = Parser<Tokenize<"..">>;
export type TestInvalidArray1 = Parser<Tokenize<"a[">>;
export type TestInvalidArray2 = Parser<Tokenize<"a[0">>;
export type TestInvalidArray3 = Parser<Tokenize<"a0]">>;
export type TestInvalidArray4 = Parser<Tokenize<"a[0]]">>;
export type TestInvalidArray5 = Parser<Tokenize<"a[a]">>;
export type TestInvalidWhere1 = Parser<Tokenize<"a.$where">>;
export type TestInvalidWhere2 = Parser<Tokenize<"a.$where(">>;
export type TestInvalidWhere3 = Parser<Tokenize<"a.$where()">>;
export type TestInvalidWhere4 = Parser<Tokenize<"a.$where(1)">>;
export type TestNestedErrors1 = Parser<Tokenize<"a[].a[.]">>;
export type TestNestedErrors2 = Parser<Tokenize<"a.b[].]">>;
export type TestNestedErrors3 = Parser<Tokenize<"a.b.c.d..">>;
export type TestNestedErrors4 = Parser<Tokenize<"a[0][1].a.[]">>;

type HappyPaths = [
  Expect<Equal<TestEmptyStringAST, {}>>,
  Expect<
    Equal<
      TestSingleIdentAST,
      {
        type: "Identifier";
        value: "hello";
      }
    >
  >,
  Expect<
    Equal<
      TestLongIdentAST,
      {
        type: "Identifier";
        value: "helooooooooooooooooooooooooooooooooooooooooooooooooooooo";
      }
    >
  >,
  Expect<
    Equal<
      TestDotAccessAST,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children: {
          type: "Identifier";
          value: "b";
        };
      }
    >
  >,
  Expect<
    Equal<
      TestMultipleDotAccessAST,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children: {
          type: "DotAccess";
          value: {
            type: "Identifier";
            value: "b";
          };
          children: {
            type: "DotAccess";
            value: {
              type: "Identifier";
              value: "c";
            };
            children: {
              type: "Identifier";
              value: "d";
            };
          };
        };
      }
    >
  >,
  Expect<
    Equal<
      TestArrayAccessAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: never;
        children: {};
      }
    >
  >,
  Expect<
    Equal<
      TestArrayIndexAccessAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: 0;
        children: {};
      }
    >
  >,
  Expect<
    Equal<
      TestArrayAccessDotAccessAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: 0;
        children: {
          type: "DotAccess";
          value: {};
          children: {
            type: "Identifier";
            value: "id";
          };
        };
      }
    >
  >,
  Expect<
    Equal<
      TestMultipleArrayAccessAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: 0;
        children: {
          type: "ArrayAccess";
          value: {};
          index: 1;
          children: {
            type: "ArrayAccess";
            value: {};
            index: 2;
            children: {
              type: "ArrayAccess";
              value: {};
              index: 3;
              children: {};
            };
          };
        };
      }
    >
  >,
  Expect<
    Equal<
      TestWhereClauseAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: never;
        children: {
          type: "WhereClause";
          value: {
            id: 1;
          };
          eat: 4;
        };
      }
    >
  >,
  Expect<
    Equal<
      TestWhereClauseDotAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: never;
        children: {
          type: "DotAccess";
          value: {
            type: "WhereClause";
            value: {
              id: 1;
            };
            eat: 4;
          };
          children: {
            type: "Identifier";
            value: "id";
          };
        };
      }
    >
  >,
  Expect<
    Equal<
      TestMultiWhereClauseAST,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: never;
        children: {
          type: "DotAccess";
          value: {
            type: "WhereClause";
            value: {
              id: 1;
            };
            eat: 4;
          };
          children: {
            type: "ArrayAccess";
            value: {
              type: "Identifier";
              value: "users";
            };
            index: never;
            children: {
              type: "WhereClause";
              value: {
                id: 2;
              };
              eat: 4;
            };
          };
        };
      }
    >
  >
];

type SadPaths = [
  Expect<
    Equal<
      TestInvalidDot1,
      ParserError<"Unexpected end of input, expected IDENT">
    >
  >,
  Expect<
    Equal<
      TestInvalidDot2,
      ParserError<"Unexpected end of input, expected IDENT">
    >
  >,
  Expect<
    Equal<TestInvalidDot3, ParserError<"Expected token of type IDENT, got DOT">>
  >,
  Expect<
    Equal<
      TestInvalidArray1,
      {
        type: "ArrayAccess";
        value: ParserError<"Unexpected end of input, Expected token of type BRACKET_END">;
        index: unknown;
        children: {};
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidArray2,
      {
        type: "ArrayAccess";
        value: ParserError<"Unexpected end of input, Expected token of type BRACKET_END">;
        index: unknown;
        children: {};
      }
    >
  >,
  Expect<Equal<TestInvalidArray3, ParserError<"Unexpected token BRACKET_END">>>,
  Expect<
    Equal<
      TestInvalidArray4,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: 0;
        children: ParserError<"Unexpected token BRACKET_END">;
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidArray5,
      {
        type: "ArrayAccess";
        value: ParserError<"Expected token of type BRACKET_END, got IDENT">;
        index: unknown;
        children: {};
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidWhere1,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children:
          | ParserError<"Unexpected end of input, Expected token of type PAREN_START">
          | ParserError<"Unexpected end of input, Expected token of type IDENT">
          | ParserError<"Unexpected end of input, Expected token of type PAREN_END">;
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidWhere2,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children:
          | ParserError<"Unexpected end of input, Expected token of type IDENT">
          | ParserError<"Unexpected end of input, Expected token of type PAREN_END">;
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidWhere3,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children:
          | ParserError<"Expected token of type IDENT, got PAREN_END">
          | ParserError<"Unexpected end of input, Expected token of type PAREN_END">;
      }
    >
  >,
  Expect<
    Equal<
      TestInvalidWhere4,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children: ParserError<"Expected token of type IDENT, got NUMBER">;
      }
    >
  >,
  Expect<
    Equal<
      TestNestedErrors1,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: never;
        children: {
          type: "ArrayAccess";
          value: ParserError<"Expected token of type BRACKET_END, got DOT">;
          index: unknown;
          children: {};
        };
      }
    >
  >,
  Expect<
    Equal<
      TestNestedErrors2,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children: {
          type: "ArrayAccess";
          value: {
            type: "Identifier";
            value: "b";
          };
          index: never;
          children: ParserError<"Unexpected token BRACKET_END">;
        };
      }
    >
  >,
  Expect<
    Equal<
      TestNestedErrors3,
      {
        type: "DotAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        children: {
          type: "DotAccess";
          value: {
            type: "Identifier";
            value: "b";
          };
          children: {
            type: "DotAccess";
            value: {
              type: "Identifier";
              value: "c";
            };
            children: ParserError<"Expected token of type IDENT, got DOT">;
          };
        };
      }
    >
  >,
  Expect<
    Equal<
      TestNestedErrors4,
      {
        type: "ArrayAccess";
        value: {
          type: "Identifier";
          value: "a";
        };
        index: 0;
        children: {
          type: "ArrayAccess";
          value: {};
          index: 1;
          children: {
            type: "DotAccess";
            value: {};
            children: ParserError<"Expected token of type IDENT, got BRACKET_START">;
          };
        };
      }
    >
  >
];
