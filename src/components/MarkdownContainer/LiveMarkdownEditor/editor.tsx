import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorkerUrl() {
    return '/_next/static/editor.worker.js';
  },
};

loader.config({
  monaco,
});

export default MonacoEditor;
