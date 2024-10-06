import type { DMMF } from "@prisma/generator-helper";

export const generateModel = (model: DMMF.Model) => {
  return {
    typeName: model.name,
    tableName: model.dbName ?? model.name,
  };
};
