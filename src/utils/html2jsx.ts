import HTMLtoJSX from 'htmltojsx';

export const html2jsx = (value: string, { createClass = false, createFunction = false }) => {
  const converter = new HTMLtoJSX({
    createClass,
  });
  let _jsx = converter.convert(value);
  if (createFunction) {
    _jsx = `export const Foo = () => {
      return (${_jsx});
    }`;
  }
  return _jsx;
};
