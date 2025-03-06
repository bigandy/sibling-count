const keepTrackOfUpdates = "keep-track-of-updates";
const futureFriendly = "future-friendly";

interface SiblingCount {
  supportsSiblingCount: boolean;
  keepTrackOfUpdates: boolean;
  futureFriendly: boolean;
}

class SiblingCount extends HTMLElement {
  static observedAttributes = [keepTrackOfUpdates, futureFriendly];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.innerHTML = `
	<slot></slot>
	`;
    this.supportsSiblingCount =
      CSS?.supports("z-index: sibling-count()") ?? false;

    this.keepTrackOfUpdates = false;

    // future friendly means that the user wants to check for presence of the sibling-count() function.
    this.futureFriendly = false;

    if (this.hasAttribute(futureFriendly)) {
      this.futureFriendly =
        this.getAttribute(futureFriendly) === "true" ||
        this.getAttribute(futureFriendly) === "";
    }

    if (this.hasAttribute(keepTrackOfUpdates)) {
      this.keepTrackOfUpdates =
        this.getAttribute(keepTrackOfUpdates) === "true";
    }
  }

  setAttributeOrStyle(element: HTMLElement, name: string, value: string) {
    element.style.setProperty(`--${name}`, value);
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

    for (const node of assignedNodes) {
      const parent = node as HTMLElement;

      const siblingCount = parent.childElementCount;
      if (siblingCount === 0) {
        console.warn(
          "Sibling Count - No children found. Use one parent element and this component will show how many children elements are present.",
        );
        return;
      }

      const siblings = [...parent.children];
      // Loop through all the children and add the custom property sibling-index to each.

      let index = 1;
      for (const sibling of siblings) {
        const siblingIndex = String(index);
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

        index++;
      }
    }
  }

  connectedCallback() {
    if (this.supportsSiblingCount && this.futureFriendly) {
      console.warn("Sibling Count - This browser supports sibling-count().");
      return;
    }

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
// export default SiblingCount;
