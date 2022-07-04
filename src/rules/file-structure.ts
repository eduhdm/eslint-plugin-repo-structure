import { Rule as EslintRule } from "eslint";

import * as fs from "fs";
import { validatePath } from "#/validators/path";
import { ConfigJson } from "#/types/rule-config";

function isIgnoredFile(filePath: string, config: ConfigJson) {
  if (config.ignorePatterns == null) return false;

  return config.ignorePatterns.some((pattern) =>
    new RegExp(pattern).test(filePath)
  );
}

export function fileStructureNode(filePath: string, config: ConfigJson) {
  if (isIgnoredFile(filePath, config)) return;

  validatePath(filePath, config["root"], config);
}

export default function fileStructureRule(
  context: EslintRule.RuleContext
): EslintRule.RuleListener {
  return {
    Program: function (node) {
      const configPath = `${context.getCwd()}/${
        context.settings["repo-structure/config-path"]
      }`;

      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const fileAbsolutePath = context.getPhysicalFilename();
      const filePath = fileAbsolutePath.replace(
        `${context.getCwd()}/`,
        "root/"
      );

      try {
        fileStructureNode(filePath, config);
      } catch (error) {
        context.report({
          node,
          message: error.message,
        });
      }
    },
  };
}
