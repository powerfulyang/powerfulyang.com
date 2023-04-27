import type { Node } from 'hast-util-raw/lib';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import rehypeSlug from 'rehype-slug';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import type { TOCItem } from '@/components/MarkdownContainer/TOC';
import remarkFrontmatter from 'remark-frontmatter';
import { remarkMetadata } from '@/components/MarkdownContainer/plugins/remarkMetadata';

const rehypeTOC = (callback: (v: TOCItem[]) => void) => {
  return (tree: Node) => {
    const tmp: TOCItem[] = [];
    visit(tree, 'element', (node) => {
      if (/^h(\d+)$/.test(node.tagName)) {
        const level = Number(node.tagName.slice(1));
        const id = node.properties?.id as string;
        const title = toString(node);
        tmp.push({
          level,
          id,
          title,
        });
      }
    });
    callback(tmp);
    return {
      type: 'root',
      children: [],
    };
  };
};

export const generateTOC = async (content: string) => {
  let toc: TOCItem[] = [];
  await remark()
    // .use(remarkGfm)
    // .use(remarkParse)
    // .use(remarkStringify)
    .use(remarkFrontmatter)
    .use(remarkMetadata)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeTOC, (v) => {
      toc = v;
    })
    .process(content);
  return toc;
};
