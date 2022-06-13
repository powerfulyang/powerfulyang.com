import type { User } from '@/type/User';
import type { Asset } from '@/type/Asset';
import type { TOCItem } from '@/components/MarkdownContainer/Toc';

type PathViewCount = {
  pathViewCount: number;
};

export interface Post extends PathViewCount {
  id: number;
  title: string;
  content: string;
  createBy: User;
  tags: string[];
  createAt: string;
  updateAt: string;
  poster: Asset;
  toc: TOCItem[];
}
