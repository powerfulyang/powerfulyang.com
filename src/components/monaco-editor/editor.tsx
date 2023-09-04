import MonacoEditor, { loader } from '@monaco-editor/react';
import 'monaco-editor-nginx';
import { isClient } from '@powerfulyang/utils';
import * as monaco from 'monaco-editor';
import * as onigasm from 'onigasm';
import { loadTheme } from 'monaco-volar';

const onigasmVersion = process.env.NEXT_PUBLIC_ONIGASM_VERSION;

const onigasmWasmUrl = `/_next/static/onigasm/${onigasmVersion}/onigasm.wasm`;

function loadOnigasm() {
  return onigasm.loadWASM(onigasmWasmUrl);
}

const prev = window.MonacoEnvironment!.getWorkerUrl!.bind(window.MonacoEnvironment!);
// MonacoEnvironment
window.MonacoEnvironment!.getWorkerUrl = (_, label) => {
  if (label === 'vue') {
    return 'vue-worker';
  }
  return prev(_, label);
};

// monaco-editor has fixed this issue at v0.35.0
// monaco.languages.register({
//   id: 'vs.editor.nullLanguage',
// });
// monaco.languages.setLanguageConfiguration('vs.editor.nullLanguage', {});

loader.config({
  monaco,
});

if (isClient) {
  await loadOnigasm();
  await loadTheme(monaco.editor);
}

export default MonacoEditor;
