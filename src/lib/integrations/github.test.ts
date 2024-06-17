import { expect, test } from "vitest";
import { Github } from "./github";

import githubRepoRoot from "./__testdata__/github.repo-root.html?raw";
import githubPR from "./__testdata__/github.pr.html?raw";
import githubFork from "./__testdata__/github.fork.html?raw";

test("repository root", async () => {
  document.body.innerHTML = githubRepoRoot;
  const url = new URL("https://github.com/github/choosealicense.com");
  expect(Github.supports(url)).toBe(true);
  expect(Github.getCloneUrl({ url, document })).toBe(
    "https://github.com/github/choosealicense.com@gh-pages",
  );
});

test("PR from the same repository", async () => {
  document.body.innerHTML = githubPR;
  const url = new URL("https://github.com/github/choosealicense.com/pull/770");
  expect(Github.supports(url)).toBe(true);
  expect(Github.getCloneUrl({ url, document })).toBe(
    "https://github.com/github/choosealicense.com@mit-0",
  );
});

test("PR from a fork", async () => {
  document.body.innerHTML = githubFork;
  const url = new URL("https://github.com/github/choosealicense.com/pull/1175");
  expect(Github.supports(url)).toBe(true);
  expect(Github.getCloneUrl({ url, document })).toBe(
    "https://github.com/Smankusors/choosealicense.com@gh-pages",
  );
});
