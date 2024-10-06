import ts from "typescript";

import isValidTSIdentifier from "../utils/isValidTSIdentifier";
import { generateStringLiteralUnion } from "./generateStringLiteralUnion";
import { generateTypedReferenceNode } from "./generateTypedReferenceNode";

export const generateTableEnumType = (
  values: {
    typeName: string;
    tableName?: string;
  }[]
) => {
  const type = generateStringLiteralUnion(values.map((v) => v.typeName));

  if (!type) return [];

  const objectDeclaration = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          "Tables",
          undefined,
          undefined,
          ts.factory.createAsExpression(
            ts.factory.createObjectLiteralExpression(
              values.map((v) => {
                const identifier = isValidTSIdentifier(v.typeName)
                  ? ts.factory.createIdentifier(v.typeName)
                  : ts.factory.createStringLiteral(v.typeName);

                return ts.factory.createPropertyAssignment(
                  identifier,
                  ts.factory.createStringLiteral(v.tableName ?? v.typeName)
                );
              }),
              true
            ),
            ts.factory.createTypeReferenceNode(
              ts.factory.createIdentifier("const"),
              undefined
            )
          )
        ),
      ],
      ts.NodeFlags.Const
    )
  );

  const typeDeclaration = generateTypedReferenceNode("Tables");

  return [objectDeclaration, typeDeclaration];
};
