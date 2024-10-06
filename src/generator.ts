import type { GeneratorOptions } from "@prisma/generator-helper";
import { generatorHandler } from "@prisma/generator-helper";
import path from "path";

import { GENERATOR_NAME } from "./constants";
import { generateTableEnumType } from "./helpers/generateEnumType";
import { generateFile } from "./helpers/generateFile";
import { generateImplicitManyToManyModels } from "./helpers/generateImplicitManyToManyModels";
import { generateModel } from "./helpers/generateModel";
import { convertToMultiSchemaModels } from "./helpers/multiSchemaHelpers";
import { sorted } from "./utils/sorted";
import { validateConfig } from "./utils/validateConfig";
import { writeFileSafely } from "./utils/writeFileSafely";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

generatorHandler({
  onManifest() {
    return {
      version,
      defaultOutput: "./generated",
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    // Parse the config
    const config = validateConfig({
      ...options.generator.config,
    });

    // Generate DMMF models for implicit many to many tables
    const implicitManyToManyModels = generateImplicitManyToManyModels(
      options.dmmf.datamodel.models
    );

    // Generate model types
    let models = sorted(
      [...options.dmmf.datamodel.models, ...implicitManyToManyModels],
      (a, b) => a.name.localeCompare(b.name)
    ).map((m) => generateModel(m));

    // Extend model table names with schema names if using multi-schemas
    if (options.generator.previewFeatures?.includes("multiSchema")) {
      models = convertToMultiSchemaModels(models, options.datamodel);
    }

    const tableInfo = generateTableEnumType(models);

    const writeLocation = path.join(
      options.generator.output?.value ?? "",
      config.fileName
    );
    return writeFileSafely(writeLocation, generateFile(tableInfo));
  },
});
