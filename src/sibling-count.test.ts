import "./sibling-count.js";
import { afterEach, describe, it, expect, vi } from "vitest";

import { getAllByRole, getByRole } from "@testing-library/dom";

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

  const checkList = (list: HTMLElement) => {
    const listItems = getAllByRole(list, "listitem");
    const listItemsLength = listItems.length;
    console.log(listItems);

    let index = 1;
    for (const listItem of listItems) {
      const siblingCountValue =
        getComputedStyle(listItem).getPropertyValue("--sibling-count");

      expect(Number(siblingCountValue)).toBe(listItemsLength);

      const siblingIndexValue =
        getComputedStyle(listItem).getPropertyValue("--sibling-index");
      expect(Number(siblingIndexValue)).toBe(index);
      index++;
    }
  };

  it("should be in the document", () => {
    const siblingCount = createSiblingCount();

    expect(siblingCount).toBeDefined();
  });

  it("for each of the children: should have a --sibling-index matching the 1-based index", () => {
    const siblingCount = createSiblingCount();

    const listItems = getAllByRole(siblingCount, "listitem");

    // Loop through list items, check their --sibling-index matches the index
    let index = 1;
    for (const listItem of listItems) {
      const siblingIndexValue =
        getComputedStyle(listItem).getPropertyValue("--sibling-index");
      expect(Number(siblingIndexValue)).toBe(index);
      index++;
    }
  });

  it("for each of the children: should have a --sibling-count matching the number of siblings that the element has", () => {
    const siblingCount = createSiblingCount();

    const list = siblingCount.querySelector("ul")!;
    const listItems = list.querySelectorAll("li");

    for (const listItem of listItems) {
      const siblingIndexValue =
        getComputedStyle(listItem).getPropertyValue("--sibling-count");

      expect(Number(siblingIndexValue)).toBe(listItems.length);
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
    const siblingCount = createSiblingCount(
      `
      <ul><li></li><li></li><li></li><li></li><li></li><li></li></ul>
      <ul><li></li><li></li><li></li><li></li><li></li><li></li></ul>
      `,
    );

    const lists = getAllByRole(siblingCount, "list");

    for (const list of lists) {
      checkList(list);
    }

    expect(siblingCount).toMatchSnapshot();
  });

  it("should update the styles when the slot changes if keep-track-of-updates attribute set", async () => {
    const el = document.createElement("sibling-count");
    el.setAttribute("keep-track-of-updates", "true");

    el.innerHTML = `<ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
    `;

    document.body.appendChild(el);

    // check the initial list
    const list = getByRole(el, "list");
    checkList(list);

    // Add another three list items
    list.innerHTML += `
      <li></li>
      <li></li> 
      <li></li>
    `;

    // This is to wait for the mutation observer to run
    await new Promise(process.nextTick);

    // Check the updated list
    const updatedList = getByRole(el, "list");
    checkList(updatedList);
  });
});
