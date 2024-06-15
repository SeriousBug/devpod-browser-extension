import { expect, test } from "vitest";
import { safeStringify } from "./safeStringify";

test("regular objects are stringified", () => {
  const obj = { a: 1, b: 2 };
  expect(safeStringify(obj)).toMatchInlineSnapshot(`"{"a":1,"b":2}"`);
});

test("circular references are handled", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = { a: 1, b: 2 };
  obj.c = obj;
  expect(safeStringify(obj)).toMatchInlineSnapshot(`"[object Object]"`);
});
