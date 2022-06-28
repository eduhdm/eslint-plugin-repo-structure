import { DeclarationRule } from "../types/rule-config";

export default function validateExtension(
  nodeName: string,
  nodeConfig: DeclarationRule
) {
  const isFile = nodeName.includes(".");
  if (!isFile) return;
  if (nodeConfig.extension == null) return;

  if (typeof nodeConfig.extension === "string") {
    if (!nodeName.endsWith(nodeConfig.extension)) {
      throw new Error(
        `File name ${nodeName} should end with ${nodeConfig.extension}`
      );
    }
  } else {
    if (nodeConfig.extension.some((ext) => nodeName.endsWith(ext))) {
      throw new Error(
        `File name ${nodeName} should end with ${nodeConfig.extension}`
      );
    }
  }
}
