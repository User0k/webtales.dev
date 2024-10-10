---
title: Snippets Creation in VSCode
description: Improve your coding efficiency in Visual Studio Code by creating custom snippets with a step-by-step guide.
date: 2022-09-04
tags: [vscode, snippets]
image: cover.jpg
photoBy: Mika Baumeister
---

Code snippets are blocks of template code that help to insert commonly used code segments by entering the snippet name and pressing the `Tab` key.
You may already be familiar with some of them: if you enter `!` inside an HTML file and press `Tab`, it will generate a basic HTML template, while `log` will produce `console.log()` in `.js` files. Additionally, some extensions provide more snippets beyond the built-in ones. For instance, the `ES7+ React/Redux/React-Native snippets` extension offers numerous snippets specifically for React and Redux.
Sometimes it's more effective to [create your own](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets) with default placeholders or tabstops for cursor locations.

## First steps

To create a new snippet in VSCode, select **File** > **Preferences** > **Configure Snippets** or use the shortcut **Ctrl** + **Shift** + **P** (**Cmd** + **Shift** + **P** for Mac) and choose **Snippets: Configure Snippets**. Then you should select the language for the snippet, or the **New Global Snippets file**. All files are written in JSON format.

<note-warning>
If you wish to create a snippet for JavaScript, you can choose the JavaScript language. However, this snippet won't be accessible in other languages like TypeScript, Python, or CSS. It's also important to note that it won't function with certain dialects, like JSX. On the other hand, if you create a global snippet, it will be available across all languages unless the `scope` property inside the snippet is not provided.
</note-warning>

I will use the **Global Snippets** file for this article. However, rather than manually populating this file, it's much simpler to use an extremely useful [Snippet Generator](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode). You need to specify the snippet's name, its prefix (alias that will trigger the snippet), and the expression for the snippet. Once you've done that, you can simply copy-paste the snippet.

## Timeout snippet

Let's start with something simple: I think you use setTimeout a lot. Why not create a snippet for that? The basic syntax for setTimeout is: `setTimeout(() => {}, 1000)`. When you execute your snippet, where do you want the cursor to appear? These positions are referred to as **tabstops** and are defined as `{$1}`, `{$2}`, and so forth. This means that after you apply a snippet, your cursor will move to the first tabstop, and when you press `Tab`, it will jump to the second, and so on. You can specify the final location as `${0}` or `;`. If you want the tabstop to have a default value, you can set it like `${1:value}`.

Back to the timeout snippet. If you want the first tabstop to be at 1000 milliseconds and the second to be within the body of timeout, your snippet expression will look like: `setTimeout(() => {${2}}, ${1:1000});`. The [Snippet Generator](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode) will create this for you:

```json
"Set timeout": {
  "prefix": "timeout",
  "body": [
    "setTimeout(() => {${2}}, ${1:1000});"
  ],
  "description": "Set timeout"
}
```

`setInterval` follows a very similar syntax, and instead of creating a separate snippet, you can include a selection within the existing one. To create a selection, enclose comma-separated options with `|`. For the current snippet, it would look like `${1|setTimeout,setInterval|}`. The complete snippet will have the following format:

```json
"Set timeout or interval": {
  "prefix": "timeout",
  "body": [
    "${1|setTimeout,setInterval|}(() => {${3}}, ${2:1000});"
  ],
  "description": "Set timeout or interval",
},
```

Now you can create `setTimeout` or `setInterval` without using a mouse, even if you type its alias a bit incorrectly.

![Example of usage timeout snippet](./timeout-snippet.gif Allows you to choose the correct function)

## useState snippet

If you work with React, you likely use the `useState` hook frequently. So it's time to create a snippet for it. Of course, you can define it as `const [${1:state}, ${2:setState}}] = useState(${3:initialValue});` but it would be better to have a tabstop at both `state` and `setState` with automatic capitalization after `set` prefix. This can be accomplished through [placeholder transformation](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_grammar). The proper expression to achieve this behavior would be: `const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});`. This should work perfectly, but you may want to make it available only if you use React. In this case, add `"scope": "javascriptreact,typescriptreact"` to your snippet. This specifies to VSCode that this snippet will be available only inside `.jsx` and `.tsx` files, not `.js` or `.ts`. The full version of the snippet:

```json {7}
"React use state": {
  "prefix": "ustate",
  "body": [
    "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});"
  ],
  "description": "Use state snippet",
  "scope": "javascriptreact,typescriptreact"
},
```

## More complex snippet using Axios methods

Traditionally, snippets have been viewed as a way to generate one or two lines of code. Let's combine the knowledge above and create a more complex snippet with [Axios](https://axios-http.com/) usage. I want to create a function that will make one of these Axios requests: `get | post | put | delete` and handle it using `then()`, `catch()`.
I want to select a method first, then I want to name a function, next provide a correct argument, and only after that I want to provide an url. The expression for the snippet inside [Snippet Generator](https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode) will look like:

```js
function ${2:fn}(${3:arg}) {
  return axios
    .${1|get,post,put,delete|}(${4:url})
    .then((resp) => console.log(resp?.data))
    .catch((err) => console.error(err));
}
```

You may probably underestimate this tool when writing some simple snippets, but when you create more complex snippets, it may be painful to write the correct body manually. Just look what it generated:

```json
"Axios function": {
  "prefix": "fnax",
  "body": [
    "function ${2:fn}(${3:arg}) {",
    "  return axios",
    "    .${1|get,post,put,delete|}(${4:url})",
    "    .then((resp) => console.log(resp?.data))",
    "    .catch((err) => console.error(err));",
    "}"
  ],
  "description": "Function that returns Axios request"
},
```

![Snippet of a function that returns Axios request demonstration](./axios-function-snippet.gif Snippet helps to easily select Axios method and handle it)

## Markdown snippet using variables

Authors who create posts often use [Front Matter](https://jekyllrb.com/docs/front-matter/) at the beginning of their posts. In other words, this is the information about the current post enclosed with `---`. See example below:

```yaml
---
title: My first post
date: 2020-01-01
category: tech
---
```

VSCode enables the use of [built-in variables](https://code.visualstudio.com/docs/editor/userdefinedsnippets) within snippets. For the post date, you can use `${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}`. This set of variables will automatically create the correct date when you start writing your post. If you name your markdown file the same as your title, you can use the `${TM_FILENAME_BASE}` variable. However, since I have a different file structure and get the title from the folder name, I take the `${TM_DIRECTORY}` variable instead. The snippet expression will look like:

```yaml
---
title: ${TM_DIRECTORY}
description: ${1:description}
date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}
tags: [${2|javascript,typescript,css,redux,react,next|}]
image: ${3}
---

```

However, there's a minor issue with this approach: the title will be formatted as `c:\projects\...\post-name`. Fortunately, you can use a regular expression to [transform the variable](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variable-transforms). The expression `${TM_DIRECTORY/.*[\\\\](.*)$/$1/}` will eliminate everything before the backslashes. Unfortunately, it's hard to manipulate the variable transformation. The final snippet will look like:

```json {5}
"Add Front Matter inside post": {
  "prefix": "mdpost",
  "body": [
    "---",
    "title: ${TM_DIRECTORY/.*[\\\\](.*)$/$1/}",
    "description: ${1:descr}",
    "date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
    "tags: [${2|javascript,typescript,css,redux,react,next|}]",
    "image: ${3}",
    "---",
    ""
  ],
  "description": "Add Front Matter inside post"
}
```

You can also [set up keybindings](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_assign-keybindings-to-snippets) to use a shortcut instead of entering the snippet alias, although I believe not many people actually take advantage of this feature. Nonetheless, it is an option.

Make sure to dedicate some time to create more of your own snippets; while many are aware of them, few actually create their own. Spending an evening on this can save you time in the future. I hope this article will help you with that!
