import { exec as execCb } from "child_process";
import fs from "fs/promises";
import { promisify } from "util";
import { afterEach, beforeEach, expect, test } from "vitest";

const exec = promisify(execCb);

beforeEach(async () => {
  await fs.rename("./prisma", "./prisma-old").catch(() => {});
});

afterEach(async () => {
  await fs
    .rm("./prisma", {
      force: true,
      recursive: true,
    })
    .catch(() => {});
  await fs.rename("./prisma-old", "./prisma").catch(() => {});
});

test(
  "End to end test",
  async () => {
    // Initialize prisma:
    await exec("yarn prisma init --datasource-provider sqlite");

    // Set up a schema
    await fs.writeFile(
      "./prisma/schema.prisma",
      `datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
    }

    generator tableNames {
        provider  = "node ./dist/bin.js"
    }
    
    model User {
        id          String @id
        posts       Post[]
    }
    
    model Post {
        id          Int @id
        title       String
        content     String
        users       User[]

        @@map("posts")
    }`
    );

    // Run Prisma commands without fail
    await exec("yarn prisma generate");

    const generatedSource = await fs.readFile("./prisma/generated/tables.ts", {
      encoding: "utf-8",
    });

    expect(generatedSource).toContain("export const Tables = {");
    expect(generatedSource).toContain('Post: "posts"');
    expect(generatedSource).toContain('User: "User"');
    expect(generatedSource).toContain('PostToUser: "_PostToUser"');
    expect(generatedSource).toContain("export type Table");
  },
  { timeout: 20000 }
);

test(
  "End to end test - multi-schema support",
  async () => {
    // Initialize prisma:
    await exec("yarn prisma init --datasource-provider postgresql");

    // Set up a schema
    await fs.writeFile(
      "./prisma/schema.prisma",
      `generator tableNames {
        provider  = "node ./dist/bin.js"
        previewFeatures = ["multiSchema"]
    }
    
    datasource db {
        provider = "postgresql"
        schemas  = ["users", "posts"]
        url      = env("TEST_DATABASE_URL")
    }
    
    model PostInfo {
        id   Int    @id
        name String
    
        @@map("post_info")
        @@schema("posts")
    }
    
    model UserInfo {
        id   Int    @id
        name String

        @@schema("users")
    }`
    );

    await exec("yarn prisma generate");

    // Shouldn't have an empty import statement
    const typeFile = await fs.readFile("./prisma/generated/tables.ts", {
      encoding: "utf-8",
    });

    expect(typeFile).toContain("export const Tables = {");
    expect(typeFile).toContain('PostInfo: "posts.post_info"');
    expect(typeFile).toContain('UserInfo: "users.UserInfo"');
    expect(typeFile).toContain("export type Table");
  },
  { timeout: 20000 }
);
