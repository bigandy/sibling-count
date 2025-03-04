import "./sibling-count.js";
import { afterEach, beforeEach, describe, it, expect } from "vitest";

describe("SiblingCount", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  beforeEach(() => {
    const siblingCount = document.createElement("sibling-count");
    siblingCount.innerHTML = `<ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
    `;
    document.body.appendChild(siblingCount);
  });

  it("should be in the document", () => {
    const siblingCount = document.querySelector("sibling-count");

    expect(siblingCount).toBeDefined();
  });

  it("the parent should have a --sibling-count matching the number of children", () => {
    const siblingCount = document.querySelector("sibling-count")!;

    const list = siblingCount.querySelector("ul")!;
    const listItems = list.querySelectorAll("li");
    const siblingCountValue =
      getComputedStyle(list).getPropertyValue("--sibling-count");

    expect(siblingCountValue).toBe("3");
    expect(listItems.length).toBe(3);
  });

  it("for each of the children: should have a --sibling-index matching the index + 1", () => {
    const siblingCount = document.querySelector("sibling-count")!;

    const list = siblingCount.querySelector("ul")!;
    const listItems = list.querySelectorAll("li");

    // Loop through list items, check their
    let index = 1;
    for (const listItem of listItems) {
      const siblingIndexValue =
        getComputedStyle(listItem).getPropertyValue("--sibling-index");
      expect(siblingIndexValue).toBe(String(index));
      index++;
    }
  });

  it("should match the snapshot", () => {
    const siblingCount = document.querySelector("sibling-count")!;
    expect(siblingCount).toMatchSnapshot();
  });
});
