declare module '@mojs/core' {
  export default any;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.scss' {
  const content: { [className: string]: string; CDN_HOST: string };
  export default content;
}
