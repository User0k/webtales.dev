---
title: Tree Shaking in JavaScript
description: Wondering what tree shaking is and how it actually works?
date: 2023-09-24
tags: [javascript, bundler, Webpack, pure-functions, fundamentals]
---

When developing an application, performance is a crucial factor that everyone on the team considers. It\`s important to be sure that when numerous dependencies are added, only the individual functions that are actually used will be included in the bundle. Otherwise, its size will grow dramatically.

Dead (or unused) JavaScript code elimination in order to optimize the final bundle is commonly known as **tree-shaking**. This term, popularized by bundlers like [Webpack](https://webpack.js.org/) and [Rollup](https://rollupjs.org/), is named after the analogy of shaking a tree. Imagine your application as a tree, where libraries and source code are branches and functions, objects, and other smaller components are leaves. Some of the leaves may be dead (indicated by being yellowed or browned). If you shake the tree, you will help it get rid of those leaves.

## Webpack dead-code elimination

You can start your project with the [official Webpack guide](https://webpack.js.org/guides/getting-started/) or use any branch of [my starter configuration](https://github.com/User0k/webpack5-boilerplate/). Now let\`s add two functions to examine how Webpack eliminates dead code: create a new `utils.js` file and add the following code inside it:

```js
export function sum(a, b) {
  return a + b;
}

export function sub(a, b) {
  return a - b;
}
```

And import them in your `index.js` file (or other entry point): `import { sum, sub } from './utils';`
<br>
In your `webpack.config.js` file set minimization to `false` to see what will be included in the final bundle with this option:

```js {4}
module.exports = {
  ...
  optimization: {
    minimize: false,
  },
}
```

Now if you run `npm run build` and inspect your `dist/main.js` file, you will see that the functions above were not included in the bundle, although they were imported. What happens if you try to use **one** of the imported functions? Let\`s figure it out. Add this to your `index.js` file:

`console.log(sum(2, 3));`

And run `npm run build` again. You will see that **both** functions were included in the bundle.

```js
// CONCATENATED MODULE: ./src/utils.js
function sum(a, b) {
  return a + b;
}
function sub(a, b) {
  return a - b;
} // CONCATENATED MODULE: ./src/index.js
```

Note that Webpack has added some comments to the bundle. Comments are associated with Webpack\`s module concatenation optimization feature, which aids in further optimizing the bundle. The `// CONCATENATED MODULE:` comment indicates that the code following it has been concatenated with other modules into a single scope. On the other hand, the `/* harmony default export */` comment is relevant to the ES2015 module syntax.

<note-warning>
Remember that Webpack depends on a valid ES6 (2015) syntax with `import` and `export` keywords. This ES6 module syntax allows modules to be static, [which simplifies](https://exploringjs.com/es6/ch_modules.html#_benefit-dead-code-elimination-during-bundling) the process for Webpack to analyze the code\`s dependency tree and determine which modules should be included in the bundle. Before ES6, CommonJS modules were used with the `require()` syntax. These modules were dynamic and could be imported based on conditions within the code. Therefore, it was impossible to determine which modules should be included in the bundle and effectively apply tree shaking using CommonJS.
</note-warning>

## Eliminating unused functions

Now it\`s time to finally drop the unused functions from the bundle. Activate minimization in your `webpack.config.js` file again:

```js {4}
module.exports = {
  ...
  optimization: {
    minimize: true,
  },
}
```

And run `npm run build`. If you examine your `dist/main.js` file, you will not see any of the two functions written above. But suddenly `console.log(5)` has appeared. What is this? Webpack is so smart that it has dropped both functions and included just the execution of the used one. Moreover, it can remove specific properties from the object that were never used.

## Breaking the tree shaking

Create a new file `user.js` and export any object with a few fields from it:

```js
export const user = {
  name: 'John',
  surname: 'Doe',
  age: 30,
};
```

If you add `console.log(user.name)` to your `index.js` file and run `npm run build`, you will see that just `John` was included in the bundle. But the funny thing is that if you destructure the `name` property like this:

```js
import { user } from './user';
const { name } = user;
console.log(name);
```

And run `npm run build` again, you may observe that the entire object is included in the bundle. This serves as an example that demonstrates that Webpack is not a silver bullet, and sometimes it can be challenging to determine if other properties of the object are used elsewhere in the code. As a result, it includes the entire object in the bundle to ensure that all properties are available if required.

Now let\`s consider the addition of [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill). Assume that you need a polyfill that returns the last element in an array. Create a new `polyfills.js` file and add the following code to it:

```js
Array.prototype.lastElement = function () {
  return this[this.length - 1];
};
```

Include the execution of your polyfill in your `index.js` file, such as `console.log([1,2,3].lastElement())`), and run `npm run build`. The polyfill has not been included in the bundle. You can confirm this by running `index.html`, which will result in an error. To fix it, you simply need to manually import the polyfill to show Webpack that it is used:

```js
import './polyfill';
console.log([1, 2, 3].lastElement());
```

<note-info>
In some cases, you can assist Webpack in identifying that your code [does not have any side effects](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free) and can be safely tree shaken or that your function is pure.  However, don\`t use it without a proper necessity. You should be cautious when using it, as it may result in unintended consequences if your code does indeed have side effects. For example, you may accidentally forget to mark your `.css` files as having side effects.
</note-info>

## Playing with Vite

Vite offers a slightly different approach to tree shaking. First, install the dependencies: `npm create vite@latest` and follow the provided instructions. Next, delete any unused code and move `utils.js`, `user.js` and `polyfill.js` files from the previous project to the current one. By default, Vite applies minification to the bundle. To disable this, create a configuration file `vite.config.js` in the root folder and paste the following code into it:

```js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
  },
});
```

Now, import everything from the three newly added files into the `main.js`:

```js
import { sum, sub } from './utils';
import { user } from './user';
import { lastElement } from './polyfill';

console.log(sum(2, 3));
console.log(user.name);
console.log([1, 2, 3].lastElement());
```

Run `npm run build` and inspect the `dist` folder. When comparing it with Webpack, you will immediately notice several differences:

1. Vite does not generate any additional comments.
2. The `sum` function is included itself, not just its execution.
3. The sub function is not included in the bundle.
4. The `user` object is fully included in the bundle.

The behavior of the polyfill is similar to Webpack: you need to manually import it to inform the bundler that it is being used. You can try to check if anything changes if you minify the bundle. Let\`s modify `vite.config.js` file for this purpose:

```js {3}
export default defineConfig({
  build: {
    minify: true,
  },
});
```

Nothing has changed. Vite just minimized the bundle to decrease its size. Unlike Webpack, it does not have the final tree shaking phase during the minification process.

## Why should I even know about this?

<ul className="list-circle-margin">
  <li>
    It\`s good to remember that you should use ES6 syntax to reduce the bundle size and to be sure that your compiler does not transform it into CommonJS modules.
  </li>
  <li>
    Different bundlers may have slightly different tree shaking algorithms which, can lead to unexpected outcomes for the production build.
  </li>
  <li>
    Some libraries or large modules may not have been properly tree shaken. You may want to monitor your bundle with some tools to avoid this. The most popular are [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) and [Rollup Plugin Visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer).
  </li>
</ul>
