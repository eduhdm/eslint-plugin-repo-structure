import { DeclarationRule } from "../types/rule-config";

export default function validateName(
  nodeName: string,
  nodeConfig: DeclarationRule
) {
  if (nodeConfig.name == null) return;

  if (/^\/(.+)\/$/.test(nodeConfig.name)) {
    validateNamePattern(nodeName, nodeConfig);
    return;
  }

  if (nodeConfig.name !== nodeName)
    throw new Error(
      `Node name ${nodeName} is invalid. it should be ${nodeConfig.name}`
    );
}

function validateNamePattern(nodeName: string, nodeConfig: DeclarationRule) {
  const namePattern = nodeConfig["name"];
  if (namePattern == null) return;

  const cleanedPattern = namePattern.match(/^\/(.+)\/$/)?.[1];
  if (cleanedPattern == null) return;

  const regexp = new RegExp(cleanedPattern, "g");

  if (!regexp.test(nodeName)) {
    throw new Error(
      `Node name ${nodeName} is invalid. it should match ${namePattern}`
    );
  }
}
