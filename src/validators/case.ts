import { DeclarationRule } from "../types/rule-config";

const SNAKE_CASE_RE = /^([a-z]+_)*[a-z]+$/;
const KEBAB_CASE_RE = /^([a-z]+-)*[a-z]+$/;
const PASCAL_CASE_RE = /^([A-Z]{1}[a-z]*)*[A-Z]{1}[a-z]*$/;
const CAMEL_CASE_RE = /^[a-z]+([A-Z]{1}[a-z]*)*$/;

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
      if (!PASCAL_CASE_RE.test(name)) throwCaseInvalid(name, nodeConfig.case);
      break;
    case "camelCase":
      if (!CAMEL_CASE_RE.test(name)) throwCaseInvalid(name, nodeConfig.case);
      break;
    case "snake_case":
      if (!SNAKE_CASE_RE.test(name)) throwCaseInvalid(name, nodeConfig.case);
      break;
    case "kebab-case":
    case "dash-case":
      if (!KEBAB_CASE_RE.test(name)) throwCaseInvalid(name, nodeConfig.case);
      break;
  }
}

function throwCaseInvalid(name: string, expectedCase: string) {
  throw Error(`Case is invalid: ${name}, it should have ${expectedCase}`);
}
