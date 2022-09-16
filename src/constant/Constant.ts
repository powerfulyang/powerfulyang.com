import variables from '@/styles/variables.module.scss';

export const ProjectName = '< #萝卜の小窝# >';

export const MarkdownImageFromAssetManageAltConstant = 'source protected';

export const CDN_ORIGIN = variables.CDN_ORIGIN.substring(1, variables.CDN_ORIGIN.length - 1);

export const generateCdnStaticUrl = (path: string) => `${CDN_ORIGIN}${path}`;
