import { Rule as EslintRule } from "eslint";
import yaml from "js-yaml";
import * as fs from "fs";

import { validatePath } from "#/validators/path";
import { ConfigJson } from "#/types/rule-config";
import path from "path";

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

function readConfigFile(configPath: string) {
  let config = null;

  try {
    config = yaml.load(fs.readFileSync(configPath, "utf8"));
  } catch (error) {}

  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (error) {}

  return config;
}

export function getNormalizedPath(filePath: string, cwd: string, sep: string) {
  const rootNormalized = filePath.replace(`${cwd}${sep}`, `root${sep}`);
  const separatorNormalized = rootNormalized.split(sep).join("/");
  return separatorNormalized;
}

export default function fileStructureRule(
  context: EslintRule.RuleContext
): EslintRule.RuleListener {
  return {
    Program: function (node) {
      const configPath = `${context.getCwd()}/${
        context.settings["repo-structure/config-path"]
      }`;

      const filePath = getNormalizedPath(
        context.getPhysicalFilename(),
        context.getCwd(),
        path.sep
      );

      const config = readConfigFile(configPath);
      if (config == null) {
        throw new Error(
          "eslint-plugin-repo-structure: Invalid config file, please check if the syntax is correct on your .json or .yaml file."
        );
      }

      try {
        fileStructureNode(filePath, config as ConfigJson);
      } catch (error) {
        context.report({
          node,
          message: error.message,
        });
      }
    },
  };
}
