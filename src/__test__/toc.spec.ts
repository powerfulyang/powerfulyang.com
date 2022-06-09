import { generateTOC } from '@/utils/toc';

describe('toc', () => {
  it('should generate toc', async () => {
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
