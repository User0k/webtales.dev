---
title: The Dynamic Duo of :is() and :has() Pseudo-Classes
description: Dive into capabilities of the new CSS pseudo-selectors. Examples included.
date: 2023-05-23
tags: [css, pseudo-classes, :has, :is, :where]
---

Before we start, I need to mention that both `:is()` and `:has()` are functional pseudo-classes. This means that they _permit selection based on information that lies outside of the document tree_, and it\`s sometimes easier to get specific elements using them (you can even avoid some Javascript code using `:has()` in certain cases).

## Forgiving Selector List

I have to mention that, in my opinion, the articles on these pseudo-classes give too much attention to this. According to the [specification](https://drafts.csswg.org/selectors-4/#typedef-forgiving-selector-list), _the general behavior of a selector list is that if any selector in the list fails to parse, the entire selector list becomes invalid_. This behavior is known as being unforgiving. But if you use `:is()` or `:where()`, [the incorrect or unsupported selector will be ignored, and the others will be used](https://developer.mozilla.org/en-US/docs/Web/CSS/:is). Okay, let\`s check out this statement:

```html
<article>
  <h2>Title</h2>
  <span>A word</span>
  <button>click me</button>
  A weird experiment
</article>
```

```css {1,5}
article :not(btton, h2) {
  color: blue;
}

article :not(h2, :nonsense) {
  color: green;
}
```

I made two mistakes in both CSS cases. What color do you expect the elements within the `article` to be? When speaking about an unforgiving list selector, you should expect the color to be default (black). But `span` and `button` colors are blue. So the second case has made the entire selector list invalid, while the first one can still use the correct `h2`. Let\`s fix the second:

```css {5}
article :not(btton, h2) {
  color: blue;
}

article :not(:is(h2, :nonsense)) {
  color: green;
}
```

Now `span` and `button` colors are green because both of the selector lists can be written as `article :not( h2)`. But the second overrides the first one.
<note-warning>
While everything says that invalid selectors may break the entire selector list, I have not found any specific example of an invalid regular selector that will break CSS. The behavior may vary depending on the browser implementation, but I bet that yours will succeed in ignoring the invalid selector and applying the rest of the CSS rule. The opposite is true for invalid pseudo-classes and pseudo-elements (which start with `:`).
</note-warning>

## The :is() pseudo-class itself

The main purpose of using `:is()` is to group multiple selectors together, allowing you to apply styles to elements that match any of the selectors within the group. It really helps to write complex selectors easily.
<br>
I use several custom tags for this blog. Each starts with `note-`. Assume I want to show a left border when a user hovers over this. I can do it this way:

```css
note-danger,
note-success,
note-warning,
note-info {
  position: relative;
}

note-danger:hover::after,
note-success:hover::after,
note-info:hover::after,
note-warning:hover::after {
  content: '';
  position: absolute;
  border-left: 2px solid;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
}
```

Or I can also combine it with `:is()` which looks more compact:

```css {8}
note-danger,
note-success,
note-warning,
note-info {
  position: relative;
}

:is(note-danger, note-success, note-info, note-warning):hover::after {
  content: '';
  position: absolute;
  border-left: 2px solid;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
}
```

Let\`s take another situation. What about styling every possible title that lies inside the `article` or `section`? If you use `:is()` it will be very easy:

```css
:is(article, section) :is(h1, h2, h3, h4, h5, h6) {
  color: red;
}
```

<note-danger>
Please pay attention to the fact that the line `:is(article section) :is(h1, h2, h3, h4, h5, h6)` looks pretty similar. But unlike the desired behavior, it will select any title in a section only if it is inside an article.
Also, you can\’t select pseudo-elements like `::before` or `::after` using functional pseudo-classes. So be careful.
</note-danger>

## Differences between :is() and :where()

These two behave in a very similar way. The only difference is that `:where()` always has 0 specificity, while `:is()` counts the specificity of the overall selector (the most specific argument). Here is an example:

```html
<article>
  <h2>Title</h2>
  <span>A word</span>
  <p>Guess the color above</p>
</article>
```

```css
:is(h2, span) {
  color: blue;
}

:where(h2, span) {
  color: green;
}

h2 {
  color: red;
}
```

The `:is()` pseudo-class colors the `h2` and the `span` elements. Then the `:where()` wants to do the same but has less specificity. So it does not affect them. Than the `h2` selector recolors the `h2` element because it has the same specificity as `h2` on the first line. But if you try to modify CSS this way, you may get a slightly unexpected behavior:

```css {1,5}
:is(h2, .selector) {
  color: blue;
}

:where(h2, #id) {
  color: green;
}

h2 {
  color: red;
}
```

The title is blue. But why? Although `.selector` does not exist in the HTML, but `:is()` pseudo-class [still counts the highest specificity](#differences-between-is-and-where). So it counts as if the title has a valid class (which has a higher specificity than just a type selector), while `:where()` still has 0 specificity.
<br>
**`:where()` can be useful if you want to apply style declarations that are easy to override. Prefer `:is()` in all other cases.**

## His Majesty :has() relational pseudo-class

The most interesting thing is that, unlike `:is()`, `:has()` [can represent some logic](https://drafts.csswg.org/selectors-4/#relational): it selects an element if it contains another element that matches a given selector. You can think about it this way: **if** a parent element (or a sibling) **has** this child element, **apply** that styles. This tool is especially useful when you don\`t have any control over the HTML.

<note-info>
This is the only way to select an element based on its child or a sibling using CSS.
Unlike `:is()` or `:where()`, the rule will be applied to the selector **before** `:has()`.
</note-info>

Now let\`s take some examples:

## Styling a child based on a child sibling

```html
<div class="card">
  <span>Black text</span>
  Some text in the first card.
  <button>Click me</button>
</div>
<div class="card">
  <span>Red text</span>
  And in the second.
  <button disabled>Click me</button>
</div>
<div class="card">The last card text.</div>
```

```css
.card {
  width: 300px;
  height: 100px;
  margin: 20px auto;
}
```

Here we have some cards where some of them have a `button` and a `span` while others don\`t (imagine that instead of 3, you have much more cards). A `button` inside the card can be disabled. Based on this information, you should change the `span` in the card to indicate which button is disabled. It could be tough enough if `:has()` didn\'t exist.
Now you can think about the task this way: _«select the card that **has** a button attribute `disabled`, and then select the `span` in that card»_. Let\`s change the color of the `span` in the task to red:

```css {1-3}
.card:has(button[disabled]) span {
  color: red;
}
```

## Negation with :has()

Another useful thing is to use the negation of having a certain selector. Let\`s take the previous example and select the `span` in the card whose button is NOT disabled (does `not have` a `disabled` attribute), colorize it, and add quotes around it:

```css
.card:not(:has(button[disabled])) span {
  color: blue;

  &::before {
    content: '«';
  }

  &::after {
    content: '»';
  }
}
```

<note-warning>
Please, pay attention to the order of selectors. Doing this
<br>
`.card:has(:not(button[disabled])) span` will select all of the `span`s in a card.
</note-warning>

## Manipulate the form if it has any errors

Let\`s create a simple form that has three input fields: email, username, and password. This displays a validation error if any input is invalid:

```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />
  <span class="error">Should be a valid email</span>
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" minlength="3" required />
  <span class="error">Should have at least 3 characters</span>
  <label for="password">Password (at least 6 characters):</label>
  <input type="password" id="password" name="password" minlength="6" required />
  <span class="error">Should have at least 3 characters</span>
  <button type="submit">Submit</button>
</form>
```

```css
form {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
}

label,
.error {
  font-size: 12px;
}

.error {
  display: none;
  color: red;
}

input:invalid + .error {
  display: block;
}
```

Works as expected. Now, if one of the inputs is invalid, I want to display a red border around it.
And the opposite: if the whole form is valid, I change the button color to green. Add this to the rest of the CSS. It works without using Javascript at all!

```css {1-7}
form:has(input:invalid) {
  border: 2px solid red;
}

form:not(:has(input:invalid)) button {
  background-color: green;
}
```

## Count elements

What if I get some amount of cards, images, etc in a row? There can be plenty of them. I may want to display only some of them.
Let\`s show a maximum of 4 and a button to show more cards, which should be displayed only if we have 5 or more.

```html
<div class="container">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <button>>></button>
</div>
```

```css {24, 28}
.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  max-width: 1200px;
  margin: 20px auto;
}

button {
  display: none;
  height: fit-content;
  position: absolute;
  right: -70px;
  bottom: -16px;
}

.card {
  border: 2px solid green;
  width: 100px;
  height: 100px;
}

.container:has(:nth-child(n + 5)) :nth-child(n + 5):not(button) {
  display: none;
}

.container:has(:nth-child(n + 6)) button {
  display: block;
}
```

Look at the highlighted lines: the first will hide all elements _after the first 4 elements_ inside the container except the `button`, whereas the second will show the `button` if there are 5 or more cards in the container. If you struggle with `:nth-child()`, read [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child) or the [specification](https://drafts.csswg.org/selectors-4/#nth-child-pseudo).

## Changing the theme color

One of the widest use cases of `:has()` is to change the color theme based on the selected option.
The idea here is to have two color variables in a theme, and **if** the **html or body has** a specific checked option, update both.

```html
<header>
  <h1>Logo</h1>
  <select name="theme" id="themeSwitcher">
    <option value="default">default</option>
    <option value="dark">dark</option>
    <option value="barbie">barbie</option>
  </select>
</header>
<article>A magnificent :has() helps to change the theme</article>
```

```css {1-14}
body:has(option[value='default']:checked) {
  --main-color: #f5f5f5;
  --secondary-color: #2e2c2c;
}

body:has(option[value='dark']:checked) {
  --main-color: #2e2c2c;
  --secondary-color: #f5f5f5;
}

body:has(option[value='barbie']:checked) {
  --main-color: #f6ebff;
  --secondary-color: #e400b2;
}

body {
  margin: 0;
  background-color: var(--main-color);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  background-color: var(--secondary-color);
}

h1 {
  color: var(--main-color);
  font-size: 24px;
}

select {
  background-color: var(--main-color);
  color: var(--secondary-color);
}

article {
  margin: 80px auto;
  padding: 50px;
  max-width: 600px;
  text-align: center;
  border: 3px dotted var(--secondary-color);
  color: var(--secondary-color);
}
```

Now you can easily add more themes by adding more options to the `select` element and a pair of lines in CSS.

There are much more use cases for this wonderful pseudo-class: I just described a few. If you need more examples, let me know to add it here.

More to mention:

<note-info>
- You can chain selectors: `selector1:has(selector2, selector3):has(selector4)`. This means that if selector1 has selector2 OR selector3 AND selector2 OR selector3 has selector4, it will be applied to selector1.
- The `:has()` pseudo-class cannot be nested.
- Pseudo-elements are not valid selectors within `:has()` because many of them exist conditionally.
</note-info>
