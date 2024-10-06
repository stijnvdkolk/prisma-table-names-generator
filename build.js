const esbuild = require("esbuild");

console.time("⭐ Built Prisma Table Names generator");
esbuild.build({
  entryPoints: ["src/bin.ts"],
  bundle: true,
  outfile: "dist/bin.js",
  platform: "node",
  packages: "external",
});
console.timeLog("⭐ Built Prisma Table Names generator");
