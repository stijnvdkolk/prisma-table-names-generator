import { logger } from "@prisma/internals";
import z from "zod";

export const configValidator = z
  .object({
    // Output overrides
    fileName: z.string().optional().default("tables.ts"),
  })
  .strict();

export type Config = z.infer<typeof configValidator>;

export const validateConfig = (config: unknown) => {
  const parsed = configValidator.safeParse(config);
  if (!parsed.success) {
    logger.error("Invalid prisma-table-names-generator config");
    Object.entries(parsed.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        logger.error(`${key}: ${value.join(", ")}`);
      }
    );
    Object.values(parsed.error.flatten().formErrors).forEach((value) => {
      logger.error(`${value}`);
    });
    process.exit(1);
  }
  return parsed.data;
};
