export function findDOMNodeByContent(selector: string, content: string) {
  for (const node of document.querySelectorAll(selector)) {
    if (node.textContent?.includes(content)) {
      console.debug("Found node", node);
      return node;
    }
  }
}
