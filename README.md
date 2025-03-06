# Sibling-count Web Component

A web component that allows you to prototype the sibling-count() and sibling-index() functions that are part of the [CSS-Values-5 spec](https://www.w3.org/TR/css-values-5/#tree-counting). This allows cool things such as https://nerdy.dev/cyclical-radio-group-with-trig-functions-and-grid but without the hard-work of hand-coding the css variables. Here's the [CSSWG ticket](https://github.com/w3c/csswg-drafts/issues/4559).

As of March 2025 this feature is being [prototyped in Chrome Canary](https://issues.chromium.org/issues/40282719) under the "Experimental Web Platform features" flag.

## Scripts

- `npm run dev` - runs the vite dev environment
- `npm run build` - builds the project with vite build
- `npm run local-release` - publishes the package to npm (needs One Time Password) after doing all the checks beforehand
- `npx changeset` - creates a changeset of the latest changes. You can choose if it is a patch, minor, or major change.
- `npm run test` - runs the tests with vitest in watch mode
- `npm run check-test` runs the tests

## To create a new release

1. run `npx changeset` this will create a description of the changes, and update the version (patch, minor, or major)
1. run `npm run local-release` this will run all the checks ahead of doing the release and if it passes, it will create the release on npm. You will need to provide the one-time-password during the process.

## Examples

1. https://codepen.io/bigandy/pen/OJovxRW
2. https://stackblitz.com/edit/vitejs-vite-grktabbm?file=src%2FApp.tsx&terminal=dev (with React)

## Notes

You can import with unpkg `https://unpkg.com/@bigandy/sibling-count@3.0.0` and then use in your HTML

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

<details open>
<summary>output html</summary>
which will yield the following HTML when the web-component JS is run:

```html
<ul>
  <li style="--sibling-index: 1; --sibling-count: 10;"></li>
  <li style="--sibling-index: 2; --sibling-count: 10;"></li>
  <li style="--sibling-index: 3; --sibling-count: 10;"></li>
  <li style="--sibling-index: 4; --sibling-count: 10;"></li>
  <li style="--sibling-index: 5; --sibling-count: 10;"></li>
  <li style="--sibling-index: 6; --sibling-count: 10;"></li>
  <li style="--sibling-index: 7; --sibling-count: 10;"></li>
  <li style="--sibling-index: 8; --sibling-count: 10;"></li>
  <li style="--sibling-index: 9; --sibling-count: 10;"></li>
  <li style="--sibling-index: 10; --sibling-count: 10;"></li>
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
      calc(
          var(--sibling-index, sibling-index()) *
            calc(360 / var(--sibling-count, sibling-count()) * 1deg)
        )
        100% 50%
    );
  }
}
```

</details>

Resulting in this:<br />
<img width="511" alt="Screenshot 2023-08-29 at 16 47 38" src="https://github.com/bigandy/sibling-count/assets/603328/0313dd70-d5c6-4db6-a01a-7892913adc1b">

## Do Not

If you pass a top-level element with no children, you'll also get a console.warn message. For example:

```html
<sibling-count>
  <p>This paragraph does not contain any children</p>
</sibling-count>
```

## Optional attributes

### keepTrackOfUpdates

Should you want the custom element to keep track of updates to the number of children you can use the `keep-track-of-updates` attribute.

### forceInlineStyle

Should you want to force the use of the inline styles even in a browser that supports sibling-count() and sibling-index() use the `force-inline-style` attribute.

## Misc Notes

I converted this package following this tutorial: https://www.totaltypescript.com/how-to-create-an-npm-package
