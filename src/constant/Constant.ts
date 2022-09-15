import variables from '@/styles/variables.module.scss';

export const ProjectName = '< #萝卜の小窝# >';

export const MarkdownImageFromAssetManageAltConstant = 'source protected';

const CDN_HOST = variables.CDN_HOST.substring(1, variables.CDN_HOST.length - 1);

export const generateCdnStaticUrl = (path: string) => `${CDN_HOST}${path}`;
