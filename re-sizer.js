export class ReSizer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<div class="parent">
	<slot></slot>
	<div class="size-val"></div>
	</div>`;

    const styles = document.createElement("style");
    styles.innerHTML = `
  .parent {
    border: 1px dotted;
	padding: 1em;
	overflow: hidden;
  	
	position: relative;
  }
  
  .horizontal {
  	resize: horizontal;
  }
  
  .vertical {
  	resize: vertical;
  }
  
  .both {
  	resize: both;
  }
  
  .size-val {
  	position: absolute; 
	bottom: 0;
	left: 0;
	background: white;
	width: 100%;
	padding: 1em;
  }
`;
    this.shadowRoot.appendChild(styles);
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const container = shadow.querySelector(".parent");

    const debug = this.hasAttribute("debug")
      ? this.getAttribute("debug") !== "false"
      : false;

    const isHorizontal = this.hasAttribute("horizontal");
    const isVertical = this.hasAttribute("vertical");
    const isBoth = (isHorizontal && isVertical) || this.hasAttribute("both");

    if (isHorizontal) {
      container.classList.add("horizontal");
    }
    if (isVertical) {
      container.classList.add("vertical");
    }
    if (isBoth) {
      container.classList.add("both");
    }

    if (debug) {
      let containerWidth = 600; // = default width
      let containerHeight = 400; // = default width
      const sizeVal = shadow.querySelector(".size-val");

      // Observe container and keep track of its width.
      const cardObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          containerWidth = entry.contentRect.width.toFixed(0);
          containerHeight = entry.contentRect.height.toFixed(0);
          let text = ``;
          if (isHorizontal) {
            text += `Width: ${containerWidth}px`;
          }
          if (isBoth) {
            text += " ";
          }
          if (isVertical) {
            text += `Height: ${containerHeight}px`;
          }
          sizeVal.innerText = text;
        });
      });
      cardObserver.observe(container);
    }
  }
}

customElements.define("re-sizer", ReSizer);
