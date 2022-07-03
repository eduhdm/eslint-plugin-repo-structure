import { FinalValidationError } from "#/errors/errors";
import { Rule, IdRule, ConfigJson } from "#/types/rule-config";
import validateCase from "./case";
import validateExtension from "./extension";
import validateName from "./name";

const isIdRule = (rule: Rule): rule is IdRule => rule.id != null;

export function validatePath(filePath: string, rule: Rule, config: ConfigJson) {
  const configRule = isIdRule(rule) ? config.rules[rule.id] : rule;

  if (configRule == null) {
    return;
  }

  const isFile = !filePath.includes("/");
  const nodeNames = filePath.split("/");
  let currentNodeName = nodeNames[0];

  const isFolderNode =
    configRule.children != null || configRule.type === "folder";
  const isFileNode = configRule.extension || configRule.type == "file";

  if (!isFile && isFileNode) return;
  if (isFile && isFolderNode) return;

  if (isFile) {
    currentNodeName = filePath.replace(/\.[a-z]+$/, "");

    validateExtension(nodeNames[0], configRule);
  }

  validateCase(currentNodeName, configRule);
  validateName(currentNodeName, configRule);

  const nextPath = filePath.replace(`${currentNodeName}/`, "");

  if (configRule.children != null) {
    validateRulesList(configRule.children, nextPath, config);
  }
}

function validateRulesList(
  nodesList: Rule[],
  filePath: string,
  config: ConfigJson
) {
  let errorMessage = "";
  for (const childNode of nodesList) {
    try {
      validatePath(filePath, childNode, config);
      return;
    } catch (error) {
      if (error.type === "final") {
        throw new FinalValidationError(error.message);
      }
      errorMessage += error.message;
    }
  }

  throw new FinalValidationError(errorMessage);
}
