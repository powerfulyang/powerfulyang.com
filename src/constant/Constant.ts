import variables from '@/styles/variables.module.scss';

export const ProjectName = '< #萝卜の小窝# >';

export const MarkdownImageFromAssetManageAltConstant = 'source protected';

export const CDN_ORIGIN = JSON.parse(variables.CDN_ORIGIN) as string;

export const generateCdnStaticUrl = (path: string) => `${CDN_ORIGIN}${path}`;

export const management = 'https://admin.powerfulyang.com';
export const loginUrl = `${management}/user/login`;
