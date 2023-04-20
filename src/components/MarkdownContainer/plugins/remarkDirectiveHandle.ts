import { visit } from 'unist-util-visit';
import type { Root } from 'remark-gfm';

export function remarkDirectiveHandle() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        // eslint-disable-next-line no-param-reassign
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const { id } = attributes;

        if (node.name === 'youtube') {
          data.hName = 'iframe';
          data.hProperties = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src: `https://www.youtube.com/embed/${id}`,
            width: '100%',
            height: '450px',
            frameBorder: 0,
            allow: 'picture-in-picture',
            allowFullScreen: true,
          };
        }
        if (node.name === 'codepen') {
          data.hName = 'iframe';
          data.hProperties = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src: `https://codepen.io/${id}`,
            width: '100%',
            height: '450px',
            frameBorder: 0,
            allow: 'picture-in-picture',
            allowFullScreen: true,
          };
        }
        if (node.name === 'codesandbox') {
          data.hName = 'iframe';
          data.hProperties = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            src: `https://codesandbox.io/embed/${id}`,
            width: '100%',
            height: '450px',
            frameBorder: 0,
            allow: 'picture-in-picture',
            allowFullScreen: true,
          };
        }
      }
    });
  };
}
