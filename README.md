## Repo Structure - Eslint Plugin

A plugin that allows you to define rules for the folder and file structure of your repository,
as well as naming constraints that must be followed.

### Installation

```bsh
$ yarn add -D eslint-plugin-repo-structure
```

or

```bsh
$ npm i --dev eslint-plugin-repo-structure
```

### Getting started

1. Define the log level that you want and the repo structure config path, Example:

```jsonc
{
  "plugins": ["repo-structure"],
  "rules": {
    "repo-structure/file-structure": "warn", // warn | error
  }
  "settings": {
    "repo-structure/config-path": ".repo-structurerc"
  }
}
```

2. Create a JSON file with the folder and file structure that should be followed. For each module, you can also define rules for naming patterns,
   case and extensions that are allowed.

   You can also define patterns for files or folders that should be excluded from validation.

   Example:

```jsonc
{
  "ignorePatterns": ["path/to/ignore-module/**.js", "**/.*Models.js"],
  "root": {
    "children": [
      {
        "name": "src",
        "children": [
          {
            "name": "controllers",
            "children": [
              {
                "case": "PascalCase",
                "name": "/^.*Controller$/",
                "extension": ".ts"
              }
            ]
          },
          // you can also reference rules ids created inside rules object
          { "id": "services-folder" }
          // ...
        ]
      },
      {
        "name": "tests",
        "children": [
          {
            "type": "file",
            "name": "/^.*\\.test$/",
            "extension": ".ts"
          }
        ]
      }
    ]
  },
  "rules": {
    "services-folder": {
      "name": "services",
      "children": [
        {
          "case": "PascalCase",
          "name": "/^.*Service$/",
          "extension": ".ts"
        }
      ]
    }
  }
}
```

3. Rules

   Here is the list of attributes that can be created inside a rule module:

| rule      | type               | example                                                                    | description                                                                                  |
| --------- | ------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| name      | string             | "components" or "/\*.Controllers$/"                                        | It's a fixed name or a regex pattern (must start and end with /)                             |
| case      | string             | "PascalCase" or "camelCase" or "snake_case" or "kebab-case" or "dash-case" |                                                                                              |
| type      | string             | "folder" or "file"                                                         | Indicates if the rule must apply only for files or folders (when empty will apply for both)  |
| extension | string or string[] | ".ts" or [".ts", ".js", ".tsx"]                                            | Specify that a file must have one of the given extensions                                    |
| children  | Rule[] or IdRule[] |                                                                            | This attribute is used to define folders and the rules that their children nodes must follow |

When defining a list of rules for a folder children, an error or warning is raised if a given file or folder does
not satisfy any of the constraint of a rule.

### Using it with multiple extensions

it is possible to run eslint on files with various extensions. To do so, you
must pass an --ext option with the desired extensions list.

```bsh
$ npm eslint . --ext .js,.ts,.tsx,.png,.css
```
