import { FinalValidationError } from "#/errors/errors";
import { Rule, IdRule, ConfigJson } from "#/types/rule-config";
import validateCase from "./case";
import validateExtension from "./extension";
import validateName from "./name";

const isIdRule = (rule: Rule): rule is IdRule => rule.id != null;

const filterRulesByType = (
  nextPath: string,
  node: Rule,
  config: ConfigJson
) => {
  const configNode = isIdRule(node) ? config.rules[node.id] : node;

  const isFile = !nextPath.includes("/");
  const isFolderNode =
    configNode.children != null || configNode.type === "folder";
  const isFileNode = configNode.extension || configNode.type == "file";

  if (!isFileNode && !isFolderNode) return true;
  if (!isFile && isFolderNode) return true;
  if (isFile && isFileNode) return true;
  return false;
};

export function validatePath(filePath: string, rule: Rule, config: ConfigJson) {
  const configRule = isIdRule(rule) ? config.rules[rule.id] : rule;

  if (configRule == null) {
    return;
  }

  const isFile = !filePath.includes("/");
  const nodeNames = filePath.split("/");
  let currentNodeName = nodeNames[0];

  if (isFile) {
    currentNodeName = filePath.replace(/\.[a-z]+$/, "");

    validateExtension(nodeNames[0], configRule);
  }

  validateCase(currentNodeName, configRule);
  validateName(currentNodeName, configRule);

  const nextPath = filePath.replace(`${currentNodeName}/`, "");

  if (configRule.children != null) {
    validateRulesList(
      configRule.children.filter((node) =>
        filterRulesByType(nextPath, node, config)
      ),
      nextPath,
      config
    );
  }
}

function validateRulesList(
  nodesList: Rule[],
  filePath: string,
  config: ConfigJson
) {
  const isFile = !filePath.includes("/");
  const nodeType = isFile ? "File" : "Folder";
  const nodeName = filePath.split("/")[0];

  let errorMessage = `${nodeType} ${nodeName} is invalid: It should `;
  let countAddedMessages = 0;

  for (const childNode of nodesList) {
    try {
      validatePath(filePath, childNode, config);
      return;
    } catch (error) {
      if (error.type === "final") {
        throw new FinalValidationError(error.message);
      }

      if (!errorMessage.includes(error.ruleMessage)) {
        if (countAddedMessages === 0) {
          errorMessage += error.ruleMessage;
        } else {
          errorMessage += " or " + error.ruleMessage;
        }

        countAddedMessages++;
      }
    }
  }

  throw new FinalValidationError(errorMessage);
}
