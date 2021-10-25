import path from 'path';
import { classToCssModules } from '../../bin/classToCssModules';

describe('bin', () => {
  it('pages/admin to css module', () => {
    const fileSource = path.join(__dirname, '../../pages/admin/index.tsx');
    const newContent = classToCssModules(fileSource);
    expect(newContent).toBeDefined();
  });
});
