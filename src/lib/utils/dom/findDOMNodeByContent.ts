export function findDOMNodeByContent(content: string) {
  for (const node of document.querySelectorAll("button")) {
    if (node.textContent?.includes(content)) {
      console.debug("Found node", node);
      return node;
    }
  }
}
