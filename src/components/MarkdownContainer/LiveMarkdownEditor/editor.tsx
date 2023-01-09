import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
// @ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker';

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  },
};

loader.config({
  monaco,
});

export default MonacoEditor;
