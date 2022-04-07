import { PathAutocomplete } from "./autocomplete";
import { Interpret } from "./interpreter";
import { Parser } from "./parser";
import { Tokenize } from "./tokenizer";

type Run<Obj, T extends PathAutocomplete<Obj>> = Interpret<
  Obj,
  Parser<Tokenize<T & string>>
>;

const obj = {
  comments: [
    {
      id: 1,
      content: "Hello world",
      user: { name: "Anurag Hazra", login: "anuraghazra" },
    },
    {
      id: 2,
      content: "This is comment",
      user: { name: "Anurag Hazra", login: "anuraghazra" },
    },
    {
      id: 3,
      content: "TypeScript is awesome!",
      user: { name: "John Doe", login: "johndoe" },
    },
  ],
  nested: {
    elements: {
      work: {
        too: { data: [1, 2, 3] },
      },
    },
  },
  mixed: [
    {
      data: [
        ["nested array 1", "nested array 2"],
        ["nested array 3", "nested array 4"],
      ],
    },
  ],
} as const;

type Demo1 = Run<typeof obj, "comments[0]">;
type Demo2 = Run<typeof obj, "comments[]">;
type Demo3 = Run<typeof obj, "comments[].$where(id:3)">;
type Demo4 = Run<typeof obj, "comments[].user">;
type Demo5 = Run<typeof obj, "comments[].user.name">;
type Demo6 = Run<typeof obj, "comments[].user.login">;
type Demo7 = Run<typeof obj, "nested.elements.work.too.data[]">;
type Demo8 = Run<typeof obj, "mixed[0].data[0][1]">;
type Demo9 = Run<typeof obj, "mixed[0].data[].[1]">;

// Demo of syntax errors
type DemoInvalidDot1 = Run<typeof obj, "a.">;
type DemoInvalidDot2 = Run<typeof obj, ".">;
type DemoInvalidDot3 = Run<typeof obj, "..">;
type DemoInvalidArray1 = Run<typeof obj, "a[">;
type DemoInvalidArray4 = Run<typeof obj, "a[0]]">;
type DemoInvalidWhere1 = Run<typeof obj, "a.$where">;
type DemoNestedErrors2 = Run<typeof obj, "a.b[].]">;
type DemoNestedErrors3 = Run<typeof obj, "a.b.c.d..">;
