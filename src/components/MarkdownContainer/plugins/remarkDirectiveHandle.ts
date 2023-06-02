import { visit } from 'unist-util-visit';
import type { Root } from 'remark-gfm';

/**
 * @description ::: containerDirective
 * @description containerDirective 需要在前面加上 ::: 并且以 ::: 结尾，需要在单独一行使用
 * @description :: leafDirective
 * @description leafDirective 需要在单独一行使用
 * @description : textDirective
 * @description 单独使用会被 p 标签包裹
 * @example
 * :::
 * This is a container directive
 * ::This is a leaf directive
 * :This is a text directive
 * youtube: `:youtube{#rg80JMm-E1I}`
 * codepen: `:codepen{#rNvWbQq}`
 * codesandbox: `:codesandbox{#codesandbox-embed}`
 * :::
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
