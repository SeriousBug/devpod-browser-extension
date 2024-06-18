import { expect, test } from "vitest";
import { GitLab } from "./gitlab";
import gitlabRepoRoot from "./__testdata__/gitlab.repo-root.html?raw";
import gitlabPR from "./__testdata__/gitlab.pr.html?raw";
import gitlabFork from "./__testdata__/gitlab.fork.html?raw";

test("repository root", async () => {
  document.body.innerHTML = gitlabRepoRoot;
  const url = new URL("https://gitlab.com/gitlab-org/gitlab");
  expect(GitLab.supports(url)).toBe(true);
  expect(GitLab.getCloneUrl({ url, document })).toBe(
    "https://gitlab.com/gitlab-org/gitlab@master",
  );
});

test("PR from the same repository", async () => {
  document.body.innerHTML = gitlabPR;
  const url = new URL(
    "https://gitlab.com/gitlab-org/gitlab/-/merge_requests/149760",
  );
  expect(GitLab.supports(url)).toBe(true);
  expect(GitLab.getCloneUrl({ url, document })).toBe(
    "https://gitlab.com/gitlab-org/gitlab@450757-board-header-button-rearrangement",
  );
});

test("PR from a fork", async () => {
  document.body.innerHTML = gitlabFork;
  const url = new URL(
    "https://gitlab.com/inkscape/inkscape/-/merge_requests/6545",
  );
  expect(GitLab.supports(url)).toBe(true);
  expect(GitLab.getCloneUrl({ url, document })).toBe(
    "https://gitlab.com/doctormo/inkscape@fix-speed-issues-in-spray-can",
  );
});
