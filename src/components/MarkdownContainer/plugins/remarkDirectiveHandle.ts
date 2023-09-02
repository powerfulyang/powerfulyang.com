import { visit } from 'unist-util-visit';
import type { Root } from 'remark-gfm';

/**
 * @description ::: containerDirective
 * @description containerDirective 需要在前面加上 ::: 并且以 ::: 结尾，需要在单独一行使用
 * @description :: leafDirective
 * @description leafDirective 需要在单独一行使用
 * @description : textDirective, 由于导致影响太多，不能被使用
 * @description 单独使用会被 p 标签包裹
 * @example
 * containerDirective
 * :::youtube{#id}
 * :::
 * leafDirective
 * ::youtube{#id}
 */
export function remarkDirectiveHandle() {
  return (tree: Root) => {
    visit(tree, (node) => {
      const _node = node;
      const data = _node.data || (_node.data = {});

      if (node.type === 'textDirective') {
        _node.type = 'text';
        // @ts-ignore
        _node.value = `:${node.name}`;
      }

      if (node.type === 'leafDirective' || node.type === 'containerDirective') {
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
          };
        }
      }
    });
  };
}
