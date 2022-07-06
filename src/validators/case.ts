import { RuleError } from "../errors/errors";
import { DeclarationRule } from "../types/rule-config";

const SNAKE_CASE_RE = /^(([a-z]|\d)+_)*([a-z]|\d)+$/;
const KEBAB_CASE_RE = /^(([a-z]|\d)+-)*([a-z]|\d)+$/;
const PASCAL_CASE_RE = /^(([A-Z]|\d){1}([a-z]|\d)*)*([A-Z]|\d){1}([a-z]|\d)*$/;
const CAMEL_CASE_RE = /^([a-z]|\d)+(([A-Z]|\d){1}([a-z]|\d)*)*$/;

export default function validateCase(
  nodeName: string,
  nodeConfig: DeclarationRule
) {
  const isFile = nodeName.includes(".");
  let name = nodeName;
  if (isFile) {
    name = nodeName.split(".")[0];
  }
  if (nodeConfig.case == null) return;

  switch (nodeConfig.case) {
    case "PascalCase":
      if (!PASCAL_CASE_RE.test(name))
        throwCaseInvalid(name, nodeConfig.case, isFile);
      break;
    case "camelCase":
      if (!CAMEL_CASE_RE.test(name))
        throwCaseInvalid(name, nodeConfig.case, isFile);
      break;
    case "snake_case":
      if (!SNAKE_CASE_RE.test(name))
        throwCaseInvalid(name, nodeConfig.case, isFile);
      break;
    case "kebab-case":
    case "dash-case":
      if (!KEBAB_CASE_RE.test(name))
        throwCaseInvalid(name, nodeConfig.case, isFile);
      break;
  }
}

function throwCaseInvalid(name: string, expectedCase: string, isFile: boolean) {
  const nodeType = isFile ? "File" : "Folder";

  throw new RuleError(
    `${nodeType} name error: Case is invalid: ${name}, it should have ${expectedCase}`,
    `match case:${expectedCase}`
  );
}
