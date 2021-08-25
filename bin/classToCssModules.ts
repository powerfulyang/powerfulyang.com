import * as fs from 'fs';

export const classToCssModules = (fileSource: string) => {
  const reg = /className="(.*)"/g;

  const file = fs.readFileSync(fileSource);

  let fileContent = file.toString();

  const result = fileContent.match(reg);

  if (result) {
    result.forEach((item) => {
      const r = /className="(.+)"/;
      const res = r.exec(fileContent);
      if (res) {
        const classes = res[1].split(' ');
        const newClassName = `className={classNames(${classes
          .map((cls) => `styles['${cls}']`)
          .join(',')})}`;
        fileContent = fileContent.replace(item, newClassName);
      }
    });
    fs.writeFileSync(fileSource, fileContent);
  }
  return fileContent;
};
