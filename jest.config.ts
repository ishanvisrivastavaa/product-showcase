import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.types.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/test-utils/**",
    "!src/app/**",
    // Pure SVG icon wrappers: no logic, nothing to assert beyond "renders an svg".
    "!src/components/ui/icons.tsx",
    // Static config objects, not logic.
    "!src/config/**",
    "!src/constants/**",
    // Barrel files: re-exports only, no logic of their own.
    "!src/**/index.ts",
    "!src/providers/index.tsx",
  ],
};

export default createJestConfig(config);
