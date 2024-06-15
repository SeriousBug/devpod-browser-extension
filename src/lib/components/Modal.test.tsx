import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";
import { expect, test } from "vitest";

test("not visible when isOpen is false", async () => {
  render(
    <Modal isOpen={false}>
      <p>Tomato</p>
    </Modal>,
  );

  expect(screen.queryByText("Tomato")).toBeNull();
});

test("visible when isOpen is true", async () => {
  render(
    <Modal isOpen={true}>
      <p>Tomato</p>
    </Modal>,
  );

  expect(screen.queryByText("Tomato")).toBeTruthy();
});
