import { expect, test } from "vitest";

import { generateModel } from "./generateModel";

test("it returns the correct table and type name when dbName is undefined", () => {
  const model = generateModel({
    name: "User",
    fields: [],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    dbName: null,
  });

  expect(model.tableName).toEqual("User");
  expect(model.typeName).toEqual("User");
});

test("it returns the correct table and type name when dbName is defined", () => {
  const model = generateModel({
    name: "User",
    fields: [],
    primaryKey: null,
    uniqueFields: [],
    uniqueIndexes: [],
    dbName: "users",
  });

  expect(model.tableName).toEqual("users");
  expect(model.typeName).toEqual("User");
});
