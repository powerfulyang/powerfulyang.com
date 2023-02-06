import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorkerUrl() {
    return '/_next/static/editor.worker.js';
  },
};

monaco.languages.register({
  id: 'vs.editor.nullLanguage',
});
monaco.languages.setLanguageConfiguration('vs.editor.nullLanguage', {});

loader.config({
  monaco,
});

export default MonacoEditor;
