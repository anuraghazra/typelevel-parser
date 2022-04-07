# What the hell is this?

This is my experiment to push the limits of TypeScript's type system by writing a "real" tokenizer/parser/interpreter entirely on type-level.

My goal was to write a DSL to query structured objects.

It's quite similar to how `lodash.get` syntax works but with a bit more flare, where you can do array index access, use `$where()` clauses & extract/filter the data from nested objects.

### Features

- Dot Access
- Array Access
- $where() clause
- Deeply nested access / chaining and all that jazz
- Support for proper syntax/parser errors

### Demo

Use [TSPlayground](https://tsplay.dev/N9EE3N)

Or clone this repo and open [demo.ts](./demo.ts) file to explore the wonders!


You can also open each of the modules separately to see how the [tokenizer](./tokenizer.ts), [parser](./parser.ts) and [interpreter](./interpreter.ts) works, I've added small demos on each time.

### Syntax

#### Dot Access

Dot access is the most basic way to access nested elements, similar to `lodash.get()`

```ts
type Demo1 = Run<typeof obj, "this.is.dot.access">;
```

#### Arrays

There are two ways to access arrays,

1. Index access: where you specify which index you want eg: `comments[0]`
2. Bulk access: where you don't specify the index and thus get the whole array as union. eg: `comments[]`

```ts
type Demo1 = Run<typeof obj, "comments[0]">;
type Demo2 = Run<typeof obj, "comments[]">;
```

#### Where clause

Using `$where()` clause you can filter out elements from array by their properties.

$where() can accept multiple comma separated value too.

```ts
type Demo1 = Run<typeof obj, "users[].$where(id:3,age:20)">;
```

### But WHY?

Because it's fun! I love to experiment with type level code and explore ways to push the limits of the type system. I just love esoteric programming.

### Should I use this in production?

!YES

### Why even write a tokenizer/parser to do this when you can also do the same with template literal types? 

Like how Haz [did here](https://twitter.com/diegohaz/status/1309489079378219009)

Because I wanted to: 
- Support proper syntax errors.
- Additional complex syntaxes like $where() clause.
- Also it's fun.