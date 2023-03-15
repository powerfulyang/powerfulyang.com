import type { Element, Node } from 'hast-util-raw/lib';
import { visit } from 'unist-util-visit';

export default function rehypeRaw() {
  return (tree: Node) => {
    visit(tree, 'raw', (node) => {
      if (node.type === 'raw') {
        const brRegex = /<br\s*\/?>/g;
        if (brRegex.test(node.value)) {
          // convert raw to element
          const el = node as unknown as Element;
          el.children = [];
          el.tagName = 'br';
          el.properties = {};
          el.type = 'element';
        }
      }
    });
  };
}
