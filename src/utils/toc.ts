export const generateToc = (content: string) => {
  const reg = /(#{1,4})\s(.+)\n/g;
  const ret = content.match(reg);
  return (
    ret?.map((x) => {
      const reg2 = /(#{1,4})\s(.+)\n/g;
      // exec 会修改RegExp 对象的lastIndex 属性 lastIndex 属性是成功匹配后下一次匹配的开始位置。
      const rex = reg2.exec(x);
      return {
        level: rex?.[1].length! - 1,
        heading: rex?.[2]!,
      };
    }) || []
  );
};
