var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
let SiblingCount = class SiblingCount extends LitElement {
    firstUpdated() {
        const slot = this.renderRoot.querySelector("slot");
        const parent = slot?.assignedNodes()[1];
        if (!parent) {
            return;
        }
        const siblingCount = parent.childElementCount;
        parent.style.setProperty("--sibling-count", siblingCount.toString());
        const siblings = parent.children;
        // Loop through all the children and add the custom property sibling-index to each.
        [...siblings].forEach((sibling, index) => {
            sibling.style.setProperty("--sibling-index", (index + 1).toString());
        });
    }
    render() {
        return html `<slot></slot>`;
    }
};
SiblingCount = __decorate([
    customElement("sibling-count")
], SiblingCount);
export { SiblingCount };
