import { LitElement, html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sibling-count")
export class SiblingCount extends LitElement {
  firstUpdated() {
    const slot = this.renderRoot.querySelector("slot");

    const parent = slot?.assignedNodes()[1] as HTMLElement;

    if (!parent) {
      return;
    }

    const siblingCount = parent.childElementCount;
    parent.style.setProperty("--sibling-count", siblingCount.toString());

    const siblings = parent.children;
    // Loop through all the children and add the custom property sibling-index to each.
    [...siblings].forEach((sibling, index) => {
      (sibling as HTMLElement).style.setProperty(
        "--sibling-index",
        (index + 1).toString()
      );
    });
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sibling-count": SiblingCount;
  }
}
