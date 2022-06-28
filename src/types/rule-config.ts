export interface ConfigJson {
  ignorePatterns: string[];
  root: Rule;
  rules: Record<string, DeclarationRule>;
}

export type Rule = DeclarationRule | IdRule;

export interface DeclarationRule {
  id: never;
  name?: string;
  extension?: string | string[];
  case?: "PascalCase" | "camelCase" | "snake_case" | "kebab-case" | "dash-case";
  children?: Rule[];
  type?: "file" | "folder";
}

export interface IdRule {
  id: string;
}
