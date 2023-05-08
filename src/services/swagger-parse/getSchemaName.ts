export const getSchemaName = (schema: string) => {
  let _schema = schema;

  if (_schema.startsWith('#')) {
    const _ = _schema.split('/').pop();
    if (_) {
      _schema = _;
    } else {
      throw new Error('schema is not valid');
    }
  } else {
    throw new Error('remote schema is not support');
  }

  return _schema;
};
