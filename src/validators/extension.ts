import { RuleError } from "#/errors/errors";
import { DeclarationRule } from "#/types/rule-config";

export default function validateExtension(
  nodeName: string,
  nodeConfig: DeclarationRule
) {
  const isFile = nodeName.includes(".");
  if (!isFile) return;
  if (nodeConfig.extension == null) return;

  if (typeof nodeConfig.extension === "string") {
    if (!nodeName.endsWith(nodeConfig.extension)) {
      throwExtensionInvalid(nodeName, nodeConfig.extension);
    }
  } else {
    if (!nodeConfig.extension.some((ext) => nodeName.endsWith(ext))) {
      throwExtensionInvalid(nodeName, nodeConfig.extension);
    }
  }
}

function throwExtensionInvalid(nodeName: string, extension: string | string[]) {
  throw new RuleError(
    `File name ${nodeName} should end with ${extension}`,
    `end with ${extension}`
  );
}
