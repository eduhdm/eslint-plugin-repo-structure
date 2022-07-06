import { RuleError } from "../errors/errors";
import { DeclarationRule } from "../types/rule-config";

export default function validateName(
  nodeName: string,
  nodeConfig: DeclarationRule
) {
  if (nodeConfig.name == null) return;

  const isFile = nodeName.includes(".");
  const nodeType = isFile ? "File" : "Folder";

  if (/^\/(.+)\/$/.test(nodeConfig.name)) {
    validateNamePattern(nodeName, nodeConfig, nodeType);
    return;
  }

  if (nodeConfig.name !== nodeName)
    throw new RuleError(
      `${nodeType} name ${nodeName} is invalid. it should be ${nodeConfig.name}`,
      `have name:${nodeConfig.name}`
    );
}

function validateNamePattern(
  nodeName: string,
  nodeConfig: DeclarationRule,
  nodeType: string
) {
  const namePattern = nodeConfig["name"];
  if (namePattern == null) return;

  const cleanedPattern = namePattern.match(/^\/(.+)\/$/)?.[1];
  if (cleanedPattern == null) return;

  const regexp = new RegExp(cleanedPattern, "g");

  if (!regexp.test(nodeName)) {
    throw new RuleError(
      `${nodeType} name ${nodeName} is invalid. it should match ${namePattern}`,
      `match name pattern:${namePattern}`
    );
  }
}
