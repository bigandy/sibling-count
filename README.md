# Sibling-count Web Component

A web component that allows you to put --sibling-count on the parent item, as well as --sibling-index on each child item. This allows cool things such as https://nerdy.dev/cyclical-radio-group-with-trig-functions-and-grid but without the hard-work of hand-coding the css variables. Here's the [CSSWG ticket](https://github.com/w3c/csswg-drafts/issues/4559).

## Scripts

- `npm run dev` - runs the vite dev environment
- `npm run build` - builds the project with vite build
- `npm run local-release` - publishes the package to npm (needs One Time Password) after doing all the checks beforehand
- `npx changeset` - creates a changeset of the latest changes. You can choose if it is a patch, minor, or major change.
- `npm run test` - runs the tests with vitest
- `npm run test:watch` runs the tests in watch mode

## To create a new release

1. run `npx changeset` this will create a description of the changes, and update the version (patch, minor, or major)
1. run `npm run local-release` this will run all the checks ahead of doing the release and if it passes, it will create the release on npm. You will need to provide the one-time-password during the process.

## Examples

1. https://codepen.io/bigandy/pen/OJovxRW
2. https://stackblitz.com/edit/vitejs-vite-grktabbm?file=src%2FApp.tsx&terminal=dev (with React)

## Notes

You can import with unpkg `https://unpkg.com/@bigandy/sibling-count@1.3.1` and then use in your HTML

<details open>
<summary>input html</summary>

```html
<sibling-count>
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</sibling-count>
```

</details>

<details>
<summary>output html</summary>
which will yield the following HTML when the web-component JS is run:

```html
<ul style="--sibling-count: 10;">
  <li style="--sibling-index: 1;"></li>
  <li style="--sibling-index: 2;"></li>
  <li style="--sibling-index: 3;"></li>
  <li style="--sibling-index: 4;"></li>
  <li style="--sibling-index: 5;"></li>
  <li style="--sibling-index: 6;"></li>
  <li style="--sibling-index: 7;"></li>
  <li style="--sibling-index: 8;"></li>
  <li style="--sibling-index: 9;"></li>
  <li style="--sibling-index: 10;"></li>
</ul>
```

</details>

and use the following CSS

<details open>
<summary>css</summary>

```css
ul {
  list-style: none;
  padding-left: 0;
  transform: rotate(-90deg);
  width: 500px;
  aspect-ratio: 1;

  li {
    height: 3em;

    background: hsl(
      calc(var(--sibling-index) * calc(360 / var(--sibling-count) * 1deg)) 100%
        50%
    );
  }
}
```

</details>

Resulting in this:<br />
<img width="511" alt="Screenshot 2023-08-29 at 16 47 38" src="https://github.com/bigandy/sibling-count/assets/603328/0313dd70-d5c6-4db6-a01a-7892913adc1b">

## Do not

If you provide more than one one top-level child, you'll get a console.warn message telling you not to. For example

```html
<sibling-count>
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</sibling-count>
```

If you pass a top-level element with no children, you'll also get a console.warn message. For example:

```html
<sibling-count>
  <p>This paragraph does not contain any children</p>
</sibling-count>
```

## Optional Props

### keepTrackOfUpdates

Should you want the custom element to keep track of updates to the number of children you can use the `keepTrackOfUpdates` attribute.

### initialIndex

Should you want the count to start at a number that is not 1 then you can use the `initialIndex` attribute

## Misc Notes

I converted this package following this tutorial: https://www.totaltypescript.com/how-to-create-an-npm-package
