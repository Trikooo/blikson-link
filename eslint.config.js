import antfu from "@antfu/eslint-config";

export default antfu({
  ignores: [
    "node_modules",
    "dist",
  ],
  stylistic: {
    quotes: "double",
    semi: true,
  },
  rules: {
    "node/prefer-global/process": "off",
    "no-console": ["warn", { allow: ["warn", "error", "info", "debug", "clear"] }],
    "no-restricted-properties": [
      "error",
      {
        object: "process",
        property: "env",
        message: "Do not use process.env directly. Use your env module instead.",
      },
    ],
  },
});
