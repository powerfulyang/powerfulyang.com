import { isNull } from '@powerfulyang/utils';
import { trim } from 'ramda';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/Editor/inex';
import type { Asset } from '@/type/Asset';

export const generateToc = (content: string) => {
  const reg = /(#{1,4})\s(.+)\n/g;
  const ret = content.match(reg);
  return (
    ret?.map((x) => {
      const reg2 = /(#{1,4})\s(.+)\n/g;
      // exec 会修改RegExp 对象的lastIndex 属性 lastIndex 属性是成功匹配后下一次匹配的开始位置。
      const rex = reg2.exec(x);
      return {
        level: Number(rex?.[1].length) - 1,
        heading: rex?.[2]!,
      };
    }) || []
  );
};

export function extractMetaData(text: string = '') {
  const metaData: Record<string, string | string[] | Asset> = {};

  const metaRegExp = /^---[\r\n](((?!---).|[\r\n])*)[\r\n]---$/m;
  const rawMetaData = metaRegExp.exec(text);

  let keyValues;

  if (rawMetaData) {
    keyValues = rawMetaData[1].split('\n');

    keyValues.forEach((keyValue) => {
      const [key, value] = keyValue.split(':');
      if (key && value) {
        if (key === 'tags') {
          metaData[key] = value.split(',').map(trim);
        } else if (key === 'poster') {
          metaData[key] = { id: value } as unknown as Asset;
        } else {
          metaData[key] = value.trim();
        }
      }
    });
  }
  const content = text.replace(metaRegExp, '');
  return [metaData, content] as [MarkdownMetadata, string];
}

export const extractTitle = (content: string) => {
  const reg = /#\s(.+)[\r\n]/g;
  const title = reg.exec(content);
  if (isNull(title)) {
    throw new Error('Markdown Format Error!');
  }
  return title[1];
};
