const initialIndex = "initial-index";
const keepTrackOfUpdates = "keep-track-of-updates";

interface SiblingCount {
  modernAttrSupport: boolean;
  initialIndex: number;
  keepTrackOfUpdates: boolean;
  futureFriendly: boolean;
}

class SiblingCount extends HTMLElement {
  static observedAttributes = [initialIndex, keepTrackOfUpdates];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.innerHTML = `
	<slot></slot>
	`;
    this.modernAttrSupport = CSS?.supports("x: attr(x type(*))") ?? false;

    this.initialIndex = 1;
    this.keepTrackOfUpdates = false;

    // future friendly means that the user wants attr() to be used instead of inline custom properties. Not implented so far.
    this.futureFriendly = false;

    if (this.hasAttribute(initialIndex)) {
      this.initialIndex = Number(this.getAttribute(initialIndex));
    }

    if (this.hasAttribute(keepTrackOfUpdates)) {
      this.keepTrackOfUpdates =
        this.getAttribute(keepTrackOfUpdates) === "true";
    }
  }

  setAttributeOrStyle(element: HTMLElement, name: string, value: string) {
    if (this.modernAttrSupport && this.futureFriendly) {
      element.setAttribute(`data-${name}`, value);
    } else {
      element.style.setProperty(`--${name}`, value);
    }
  }

  showerAttributesOntoElements() {
    const shadow = this.shadowRoot;
    if (!shadow) {
      return;
    }
    const slot = shadow.querySelector("slot");

    const assignedNodes =
      slot
        ?.assignedNodes()
        // filter out text nodes
        .filter((node) => node.nodeType === 1) ?? [];

    if (assignedNodes.length > 1) {
      console.warn("Sibling Count - Only one parent element is allowed.");
      return;
    }

    const parent = assignedNodes[0] as HTMLElement;

    const siblingCount = parent.childElementCount;
    if (siblingCount === 0) {
      console.warn(
        "Sibling Count - No children found. Use one parent element and this component will show how many children elements are present.",
      );
      return;
    }

    const siblings = [...parent.children];
    // Loop through all the children and add the custom property sibling-index to each.

    siblings.forEach((sibling, index) => {
      const siblingIndex = String(index + this.initialIndex);
      this.setAttributeOrStyle(
        sibling as HTMLElement,
        "sibling-index",
        siblingIndex,
      );

      this.setAttributeOrStyle(
        sibling as HTMLElement,
        "sibling-count",
        String(siblingCount),
      );
    });
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    if (!shadow) {
      return;
    }
    const slot = shadow.querySelector("slot");

    const filteredAssignedNodes = slot
      ?.assignedNodes()
      // filter out text nodes
      .filter((node) => node.nodeType === 1);

    // parent is the first filteredAssignedNodes.
    const parent = filteredAssignedNodes?.[0];

    if (!parent) {
      return;
    }

    this.showerAttributesOntoElements();

    if (this.keepTrackOfUpdates) {
      const observerCallback = (
        parentThis: SiblingCount,
        mutations: MutationRecord[],
      ) => {
        mutations.forEach(() => parentThis.showerAttributesOntoElements());
      };

      // need to bind this so that the callback has access to it.
      const observer = new MutationObserver(observerCallback.bind(null, this));

      // configuration of the observer
      const config = { childList: true };

      observer.observe(parent, config);

      // disconnect the observer when the element is disconnected.
      this.addEventListener("disconnected", () => {
        observer.disconnect();
      });
    }
  }

  disconnectedCallback() {
    if (this.keepTrackOfUpdates) {
      this.dispatchEvent(new Event("element-disconnected"));
    }
  }
}

customElements.define("sibling-count", SiblingCount);
export default SiblingCount;
