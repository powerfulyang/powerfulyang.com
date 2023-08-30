import HTMLtoJSX from 'htmltojsx';
import { prettify } from '@/prettier';

export const html2jsx = async (
  value: string,
  { createClass = false, createFunction = true } = {},
) => {
  const converter = new HTMLtoJSX({
    createClass,
  });
  let jsx = converter.convert(value);
  if (createFunction && !createClass) {
    jsx = `export const Foo = () => {
      return (${jsx});
    }`;
  }
  jsx = await prettify('babel', jsx);
  return jsx;
};
