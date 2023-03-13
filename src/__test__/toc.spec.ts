import { generateTOC } from '@/utils/toc';

describe('TOC', () => {
  it('should generate TOC', async () => {
    const content = `# 1`;
    const result = await generateTOC(content);
    expect(result).toStrictEqual([
      {
        level: 1,
        id: '1',
        title: '1',
      },
    ]);
  });
});
