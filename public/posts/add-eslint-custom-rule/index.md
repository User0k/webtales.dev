---
title: Add Your Own Custom Rules to ESLint 9
description: Create custom ESLint rules to enhance code quality and enforce project-specific standards
date: 2024-09-27
tags: [ESLint, linting, AST, code-quality]
image: randy-fath.jpg
photoBy: Randy Fath
---

While ESLint is a fantastic tool that has a large [collection of rules](https://eslint.org/docs/latest/rules/), you might also be thinking about creating your own custom rule and configuring it.
However, before proceeding, it's wise to check if ESLint already has a rule for you. Really. Many people think that they need to create a custom rule or plugin for their team before exploring the existing ones. While creating a custom rule isn't as complicated as it may seem, it may be more profitable to utilize existing, well-tested rules.

## Initializing a properly structured project

Alright, let's say you haven't discovered a suitable rule or simply want to practice with rule creation. If you're using ESLint 9, you must follow the specific name convention and file structure in your plugin. Yes, you [have to create a plugin](https://github.com/eslint/eslint/commit/4940cc5c4903a691fe51d409137dd573c4c7706e) in order to implement your own custom rule.

<note-success>
Notice that if you're using ESLint 8 or earlier, you may try to use a `--rulesdir` flag to direct ESLint to your custom rule located in a specific directory. This allows you to skip creating a plugin if you don't need it and [jump into the rule creation](#starting-to-create-your-own-rule).
<br/>
For example, your script for the `src` directory could look like this: `"lint": "eslint --rulesdir src rules-folder/your-custom-rule.js"`
</note-success>

Create a new directory inside the existing project or create a new one. This directory should include a `package.json` file. Use `npm init` for simplicity.
Next, initialize ESLint by running `npm init @eslint/config`, or follow the [original ESLint guide](https://eslint.org/docs/latest/use/getting-started).
After that, create a new `index.js` file, which will act as the entry point for your plugin (by default, `package.json` file contains the field `"main": "index.js"`, indicating this entry point location). Then, create a new `rules` directory (you can name it whatever you want) and add another `index.js` file there. This file will re-export all the rules from the plugin. Now in the `rules` directory, create a file per rule. Feeling overwhelmed? The most challenging part is behind you. Your folder structure should look like this:

```bash
eslint.config.js
index.js
package.json
/rules
  - index.js
  - rule-name1.js
  - rule-name2.js
```

## Starting to create your own rule

It's time to consider creating your own rule. I would like to create a rule that restricts any imports from a specific folder. Why? This can violate encapsulation or dependency management.

The rule object [consists of two things](https://eslint.org/docs/latest/extend/custom-rules#rule-structure): an optional `meta` object and a `create` method where we will write all the logic. Add this line `/** @type {import('eslint').Rule.RuleModule} */` at the beginning of the file with your rule. This will facilitate the definition of the rule object. While the `meta` object is optional, it is recommended to include it. I will fill these properties:

- `type: problem | suggestion | layout` indicates the type of rule. A `"problem"` in my case.
- `docs:` contains a `description` of the rule and a `url` to the documentation. If provided, it will create a clickable link to the documentation; for me, it will be `null`.
- `fixable: code | whitespace`. You must include this if you want ESLint to automatically fix the rule. As it will remove the specific line of code in my case, I will use `code`.
- `schema:` is necessary to fill if a rule has any options (we will back to it closer to the end of the article). For now, leave it as an empty array.
- `messages:` is a [strongly recommended](https://eslint.org/docs/latest/extend/custom-rules#messageids) object that follows the pattern `"messageId": "message"` that allows you to provide descriptive and user-friendly messages for different types of violations that the rule may catch.

<ul className="list-circle-margin">
  <li>
    `type: problem | suggestion | layout` indicates the type of rule. A `"problem"` in my case.
  </li>
  <li>
    `docs:` contains a `description` of the rule and a `url` to the documentation. If provided, it will create a clickable link to the documentation; for me, it will be `null`.
  </li>
  <li>
    `fixable: code | whitespace`. You must include this if you want ESLint to automatically fix the rule. As it will remove the specific line of code in my case, I will use `code`.
  </li>
  <li>
    `schema:` is necessary to fill if a rule has any options (we will back to it closer to the end of the article). For now, leave it as an empty array.
  </li>
  <li>
    `messages:` is a [strongly recommended](https://eslint.org/docs/latest/extend/custom-rules#messageids) object that follows the pattern `"messageId": "message"` that allows you to provide descriptive and user-friendly messages for different types of violations that the rule may catch.
  </li>
</ul>

```js
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Import from this folder is restricted',
      url: null,
    },
    fixable: 'code',
    schema: [],
    messages: { 'restricted-folder': 'Cannot import from restricted folder' },
  },

  create(context) {
    //
  },
};
```

The `create` method takes only one argument: context. Context is an object that provides information about the file and returns a _visitor_ object, where the keys are [AST selectors](https://eslint.org/docs/latest/extend/selectors#what-is-a-selector) and the values are a function applied to the selected nodes.

In this section, we need to determine if the code contains an import declaration and if this statement includes import from `'./restricted-folder'`. If it does, ESLint should generate an error.
_But if this is your first encounter with AST, you might be wondering how to deal with this and which selectors to use_. Don't worry! You do not need to know any of the existing selectors or AST nodes. Visit [AST Explorer](https://astexplorer.net/) and select [espree](https://eslint.org/blog/2014/12/espree-esprima/) as a parser from the top menu, and paste your regular JavaScript code into the left side of the AST Explorer. For this <span id="example">example</span>, I will use React.

```jsx
import { useState } from 'react';
import RestrictedComponent from './restricted-folder';
import './counter.css';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <RestrictedComponent />
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

![An example of a component that imports from the restricted folder](./espree.gif 'Espree parser')
![If you select import declaration, this code will be highlighted inside AST Explorer](./import-declaration.gif 'The highlighted code in AST Explorer')

`ImportDeclaration` receives a node that holds most of the details about the import declaration. If you explore the `source`, you will notice that its value includes `"./restricted-folder"`. Once the appropriate selector is identified, the rule should invoke an error using the [`context.report`](https://eslint.org/docs/latest/extend/custom-rules#reporting-problems) method. This method accepts an object as an argument that must contain a `node` associated with the problem (import declaration in this case) and a [`messageId`](https://eslint.org/docs/latest/extend/custom-rules#messageids), where you should provide a correct key from the `messages` object mentioned in `meta` [above](#starting-to-create-your-own-rule).

<note-danger>
Since we are using only one error message in the rule, we can use a `message` placeholder and avoid filling `messages` in `meta`. But you must follow a single approach.
</note-danger>

At this point, your `create` method should look like this:

```js
create(context) {
  return {
    ImportDeclaration(node) {
      const source = node.source.value;
      if (source.includes("/restricted-folder")) {
        context.report({
          node,
          messageId: "restricted-folder",
        });
      }
    },
  };
},
```

## Packaging the rule into a plugin and connect it to ESLint

ESLint is unaware of your rule, so it’s time to establish the connection. Start by re-exporting your rule from the `rules/index.js` file as an object, where key is the name of the rule. You can add multiply rules following this pattern. All rules from this folder will be part of a single plugin.

```js
module.exports = {
  'no-import-from-folder': require('./no-import-from-folder'),
  // more rules
};
```

The next step is a [plugin configuration](https://eslint.org/docs/latest/use/configure/plugins#configure-a-local-plugin). You should do it in the entry point of your custom rule project (usually `index.js`). Your plugin is an object that contains two objects:

- `plugins:` where a key is the name of your plugin, which has a `rules` property with a rules object. **Do not use the `eslint-plugin` prefix for the naming! ESLint will do this for you.**
- `rules:` This section has keys representing rules in the format `[plugin-name]/[rule-name]`, and the values indicate the severity settings that determine how ESLint deals with rule violations during linting by default (`error`, `warn`, or `off`). You can overwrite the severity later. **Please pay close attention to the naming: if you use an incorrect plugin name or a name that doesn't match the one defined in the `rules/index.js` file, the rule will not work for you.**

It may be easier to look at the example:

```js
const allRules = require('./rules');

module.exports = {
  plugins: {
    user0k: {
      rules: allRules,
    },
  },
  rules: {
    'user0k/no-import-from-folder': 'error',
  },
};
```

You do not need to publish your plugin to `NPM` (but you already can). Instead, you can load it locally. You can add your plugin as a devDependency in `package.json` of the project where you intend to use it. Use the following format: `"eslint-plugin-[name-of-yourplugin]": "file:[location of your plugin]"`. Here's an example:

```json {5}
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "eslint": "^9.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-user0k": "file:../eslint-custom-rules",
  }
```

Now install all dependencies: `npm i`. This will _install_ your plugin into `node_modules`. Congratulations! Your plugin is ready to use, but you still need to connect it inside `eslint.config.js`. Connect it as all other plugins:

```js {5,13}
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-custom-react';
import pluginUser0k from 'eslint-plugin-user0k';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact,
  pluginUser0k,
];
```

**You may need to restart your IDE to make the plugin work.**
Now, if I add some more errors, such as mapping without a key, to the [example](#example) above, ESLint will report common errors along with errors from your custom rule.

![ESLint errors "missing key prop" and "cannot import from folder"](./eslint-errors.gif ESLint errors)

## Applying fixes automatically

This might be sufficient for your needs, but if you want ESLint to automatically apply fixes, you must specify the `fix` function [within `context.report()`](#starting-to-create-your-own-rule). I would like the fix to automatically remove the import and the whitespace after it. To find the precise location of the specified import, refer to [AST explorer](https://astexplorer.net/) again. The `ImportDeclaration` has a `range` tuple that indicates the location of the import. All that's left to do is apply this range and a character after it to the [`fixer.removeRange()` method](https://eslint.org/docs/latest/extend/custom-rules#applying-fixes):

```js {9-12}
create(context) {
  return {
    ImportDeclaration(node) {
      const source = node.source.value;
      if (source.includes("/restricted-folder")) {
        context.report({
          node,
          messageId: "restricted-folder",
          fix: (fixer) => {
            const [start, end] = node.range;
            return fixer.removeRange([start, end + 1]);
          },
        });
      }
    },
  };
},
```

You may need to restart your IDE again, and now, if you run ESLint with `--fix` flag or click `Quick Fix` over your problem, it will be automatically removed.

![Demonstration of ESLint quick fix](./quick-fix-animation.gif 'Quick Fix')

## Adding options to your rule

You may already be wondering how to provide options to your rule. Wouldn't it be great to specify a path or even an array of paths to be restricted in your rule instead of hardcoding them each time? The good news is that you can do this inside your [schema](#starting-to-create-your-own-rule).
You need to include a `oneOf` property inside it to validate various schemas available ([more options for JSON Schema V4](https://datatracker.ietf.org/doc/html/draft-zyp-json-schema-04#section-3.5)). At this stage, your `schema` should look like this:

```js
schema: [
  {
    oneOf: [
      { type: "string" }, // Accept a single string
      {
        type: "array", // or an array of strings
        items: {
          type: "string",
        },
      },
    ],
  },
],
```

You can now access the options inside `create(context)` in the following way: `const options = context.options[0]`. Next, you'll need to modify the logic within the `context`: if the options is a string, convert it into an array, then iterate through the array and report an error on each match with a restricted folder. I also replaced `includes` by `startsWith` for cases where the paths have similar names:

```js {2,3,8,9, 13-15}
create(context) {
  const options = context.options[0];
  const folderNames = Array.isArray(options) ? options : [options];

  return {
    ImportDeclaration(node) {
      const source = node.source.value;
      folderNames.forEach((folderName) => {
        if (source.startsWith(folderName)) {
          context.report({
            node,
            messageId: "restricted-folder",
            data: {
              folder: folderName,
            },
            fix: (fixer) => {
              const [start, end] = node.range;
              return fixer.removeRange([start, end + 1]);
            },
          });
        }
      });
    },
  };
},
```

Currently, the `messages` property inside `meta` is hardcoded, which means it may report the same errors across different folders. Not good. However, it can get access to `data` variables in the `context`. Using it this way `messages: { "restricted-folder": "Do not import from '{{folder}}'" }` allows you to generate messages based on the value of a certain variable in the `context`.

## Options usage inside the rule

Here’s an example of how to configure the `eslint.config.js ` file to restrict imports from one or more folders:

```js
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact,
  pluginUser0k,
  {
    rules: {
      'react/jsx-key': 'warn',
      // 'user0k/no-import-from-folder': ['error', './restricted-folder'], // restricts a single folder
      'user0k/no-import-from-folder': [
        'error',
        ['./restricted-folder', './another-restricted-folder'],
      ], // restricts all folders from the array
    },
  },
];
```

You can now set up the rule to restrict imports from various folders in any of your projects.

![ESLint successfully reports restriction from different folders](./eslint-paths-errors.gif 'Restriction from different folders')

P.S. You can also use the [ESLint generator](https://github.com/eslint/generator-eslint?tab=readme-ov-file) to create templates for your rule, but it won't assist you with handling the AST tree or organizing the file structure properly. Therefore, I find it to be somewhat ineffective. Additionally, this article does not cover many other ESLint features, such as [testing](https://eslint.org/docs/latest/extend/custom-rules#rule-unit-tests) or applying [processors](https://eslint.org/docs/latest/extend/custom-processors). But by following this guide, you can easily create your own rules.
