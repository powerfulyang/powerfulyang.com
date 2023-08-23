import HTMLtoJSX from 'htmltojsx';
import { prettify } from '@/prettier';

export const html2jsx = async (
  value: string,
  { createClass = false, createFunction = true } = {},
) => {
  const converter = new HTMLtoJSX({
    createClass,
  });
  let _jsx = converter.convert(value);
  if (createFunction && !createClass) {
    _jsx = `export const Foo = () => {
      return (${_jsx});
    }`;
  }
  _jsx = await prettify('babel', _jsx);
  return _jsx;
};
