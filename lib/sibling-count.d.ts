import { LitElement, type TemplateResult } from "lit";
export declare class SiblingCount extends LitElement {
    firstUpdated(): void;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "sibling-count": SiblingCount;
    }
}
