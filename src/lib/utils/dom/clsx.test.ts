import { test, expect } from "vitest";
import { clsx } from "./clsx";

test("combines classes", () => {
  expect(clsx("avocado", "tomato")).toBe("avocado tomato");
});

test("filters out falsy values", () => {
  expect(
    clsx("avocado", undefined, "tomato", null, "chickpea", false, "potato"),
  ).toBe("avocado tomato chickpea potato");
});

test("flattens nested arrays", () => {
  expect(clsx("avocado", ["tomato", "chickpea"], "potato")).toBe(
    "avocado tomato chickpea potato",
  );
});
