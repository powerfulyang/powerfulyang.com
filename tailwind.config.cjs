const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.tsx'],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        /* 表示这个元素的尺寸计算不依赖于它的子孙元素的尺寸 */
        '.contain-size': {
          contain: 'size',
        },
        /* 表示元素外部无法影响元素内部的布局，反之亦然 */
        '.contain-layout': {
          contain: 'layout',
        },
        /* 表示这个元素的子孙节点不会在它边缘外显示。如果一个元素在视窗外或因其他原因导致不可见，则同样保证它的子孙节点不会被显示。 */
        '.contain-paint': {
          contain: 'paint',
        },
        /* 等价于 contain: size layout paint */
        '.contain-strict': {
          contain: 'strict',
        },
        /* 等价于 contain: layout paint */
        '.contain-content': {
          contain: 'content',
        },
      });
    }),
  ],
};
