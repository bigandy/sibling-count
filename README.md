# Sibling-count Web Component

A web component that allows you to put --sibling-count on the parent item, as well as --sibling-index on each child item. This allows cool things such as https://nerdy.dev/cyclical-radio-group-with-trig-functions-and-grid but without the hard-work of hand-coding the css variables.

## Scripts

- `npm run dev` - runs the vite dev environment
- `npm run build` - builds the project with vite build
- `npm run npm:publish` - publishes the package to npm (needs One Time Password)

## Examples

1. https://codepen.io/bigandy/pen/OJovxRW

## Notes

You can import with unpkg `https://unpkg.com/@bigandy/sibling-count@latest` and then use in your HTML

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

  & li {
    height: 3em;
    background: hsl(
      calc(var(--sibling-index) * calc(360 / var(--sibling-count) * 1deg)) 100% 50%
    );
  }
}
```

</details>

Resulting in this:<br />
<img width="511" alt="Screenshot 2023-08-29 at 16 47 38" src="https://github.com/bigandy/sibling-count/assets/603328/0313dd70-d5c6-4db6-a01a-7892913adc1b">
