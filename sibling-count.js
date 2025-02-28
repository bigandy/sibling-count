const initialIndex = "initial-index";
const keepTrackOfUpdates = "keep-track-of-updates";

class SiblingCount extends HTMLElement {
  static observedAttributes = [initialIndex, keepTrackOfUpdates];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
	<slot></slot>
	`;
    this.modernAttrSupport = CSS.supports("x: attr(x type(*))");

    this.startingIndex = 1;
    this.keepTrackOfUpdates = false;
    // future friendly means that the user wants attr() to be used instead of inline custom properties.
    this.futureFriendly = false;

    if (this.hasAttribute(initialIndex)) {
      this.startingIndex = Number(this.getAttribute(initialIndex));
    }

    if (this.hasAttribute(keepTrackOfUpdates)) {
      this.keepTrackOfUpdates =
        this.getAttribute(keepTrackOfUpdates) === "true";
    }
  }

  setAttributeOrStyle(element, name, value) {
    if (this.modernAttrSupport && this.futureFriendly) {
      element.setAttribute(`data-${name}`, value);
    } else {
      element.style.setProperty(`--${name}`, value);
    }
  }

  showerAttributesOntoElements() {
    const shadow = this.shadowRoot;
    const slot = shadow.querySelector("slot");

    const assignedNodes = slot
      .assignedNodes()
      // filter out text nodes
      .filter((node) => node.nodeType === 1);

    const parent = assignedNodes[0];

    const siblingCount = parent.childElementCount;
    this.setAttributeOrStyle(parent, "sibling-count", siblingCount);

    const siblings = [...parent.children];
    // Loop through all the children and add the custom property sibling-index to each.

    siblings.forEach((sibling, index) => {
      const siblingIndex = index + this.startingIndex;
      this.setAttributeOrStyle(sibling, "sibling-index", siblingIndex);
    });
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const slot = shadow.querySelector("slot");

    const filteredAssignedNodes = slot
      .assignedNodes()
      // filter out text nodes
      .filter((node) => node.nodeType === 1);

    // parent is the first filteredAssignedNodes.
    const [parent] = filteredAssignedNodes;

    this.showerAttributesOntoElements();

    if (this.keepTrackOfUpdates) {
      const observerCallback = (parentThis, mutations) => {
        mutations.forEach(() => parentThis.showerAttributesOntoElements());
      };

      // need to bind this so that the callback has access to it.
      const observer = new MutationObserver(observerCallback.bind(null, this));

      // configuration of the observer
      const config = { childList: true };

      observer.observe(parent, config);

      // disconnect the observer when the element is disconnected.
      this.addEventListener("element-disconnected", () => {
        observer.disconnect();
      });
    }
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event("element-disconnected"));
  }
}

customElements.define("sibling-count", SiblingCount);
