import { expect, test } from "vitest";
import { Github } from "./github";
import { EIntegrationParseError } from "./error";

import githubRepoRoot from "./__testdata__/github.repo-root.html?raw";
import githubPR from "./__testdata__/github.pr.html?raw";

test("repository root", async () => {
  document.body.innerHTML = githubRepoRoot;
  const url = "https://github.com/github/choosealicense.com";
  expect(Github.supports(url)).toBe(true);
  expect(Github.getRepo({ url, document })).toBe("github/choosealicense.com");
  expect(() => Github.getBranch({ url, document })).toThrowError(
    EIntegrationParseError,
  );
});

test("PR from the same repository", async () => {
  document.body.innerHTML = githubPR;
  const url = "https://github.com/github/choosealicense.com/pull/770";
  expect(Github.supports(url)).toBe(true);
  expect(Github.getRepo({ url, document })).toBe("github/choosealicense.com");
  expect(Github.getBranch({ url, document })).toBe("mit-0");
});
