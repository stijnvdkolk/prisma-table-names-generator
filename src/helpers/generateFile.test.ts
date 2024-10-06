import { expect, test } from "vitest";

import { generateFile } from "./generateFile";

test("generates a file!", () => {
  const resultwithLeader = generateFile([]);
  expect(resultwithLeader).toBe("");
});
