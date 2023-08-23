import { expose } from 'comlink';
import { html2jsx as _html2jsx } from '@/utils/html2jsx';

export interface PrettierWorker {
  html2jsx: typeof html2jsx;
}

const html2jsx = (code: string) => {
  return _html2jsx(code);
};

expose({
  html2jsx,
});
