import { expose } from 'comlink';
import { html2jsx } from '@/utils/html2jsx';
import { prettify } from '@/prettier/prettifyOnClient';

export interface PrettierWorker {
  html2jsx: typeof html2jsx;
  prettify: typeof prettify;
}

expose({
  html2jsx,
  prettify,
});
