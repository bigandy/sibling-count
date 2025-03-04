import "./sibling-count.js";
import { afterEach, describe, it, expect, vi } from "vitest";

describe("SiblingCount", () => {
  const consoleMock = vi
    .spyOn(console, "warn")
    .mockImplementation(() => undefined);

  afterEach(() => {
    document.body.innerHTML = "";
    consoleMock.mockReset();
  });

  const createSiblingCount = (innerHTML = "") => {
    const siblingCount = document.createElement("sibling-count");
    siblingCount.innerHTML =
      innerHTML !== ""
        ? innerHTML
        : `<ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
    `;
    document.body.appendChild(siblingCount);
    return siblingCount;
  };

  it("should be in the document", () => {
    const siblingCount = createSiblingCount();

    expect(siblingCount).toBeDefined();
  });

  it("the parent should have a --sibling-count matching the number of children", () => {
    const siblingCount = createSiblingCount();

    const list = siblingCount.querySelector("ul")!;
    const listItems = list.querySelectorAll("li");
    const siblingCountValue =
      getComputedStyle(list).getPropertyValue("--sibling-count");

    expect(siblingCountValue).toBe("3");
    expect(listItems.length).toBe(3);
  });

  it("for each of the children: should have a --sibling-index matching the 1-based index", () => {
    const siblingCount = createSiblingCount();

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
    const siblingCount = createSiblingCount();
    expect(siblingCount).toMatchSnapshot();
  });

  it("should not return a count if there are no children elements", () => {
    const siblingCount = createSiblingCount(`<p>This is cool?</p>`);

    const para = siblingCount.querySelector("p")!;
    const siblingCountValue =
      getComputedStyle(para).getPropertyValue("--sibling-count");
    expect(siblingCountValue).not.toBe("0");
    expect(siblingCountValue).toBe("");
  });

  it("should console.warn if there are no children elements", () => {
    createSiblingCount(`<p>This is cool?</p>`);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      "Sibling Count - No children found. Use one parent element and this component will show how many children elements are present.",
    );
  });

  it("should handle the situation where there are more than one top-level children of <sibling-count>", () => {
    createSiblingCount(
      `
      <ul><li></li></ul><ul><li></li></ul>
      <ul><li></li></ul><ul><li></li></ul>
      `,
    );

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      "Sibling Count - Only one parent element is allowed.",
    );
  });
});
