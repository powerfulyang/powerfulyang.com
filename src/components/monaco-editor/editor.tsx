import MonacoEditor, { loader } from '@monaco-editor/react';
import 'monaco-editor-nginx';
import { isClient } from '@powerfulyang/utils';
import { editor, languages } from 'monaco-editor';
import * as monaco from 'monaco-editor';
import * as onigasm from 'onigasm';
import { loadTheme } from 'monaco-volar';
import type { LanguageService } from '@vue/language-service';
import * as volar from '@volar/monaco';
import vueWorkerURL from 'monaco-volar/vue.worker';

const onigasmVersion = process.env.NEXT_PUBLIC_ONIGASM_VERSION;

const onigasmWasmUrl = `/_next/static/onigasm/${onigasmVersion}/onigasm.wasm`;

function loadOnigasm() {
  return onigasm.loadWASM(onigasmWasmUrl);
}

const prev = window.MonacoEnvironment!.getWorkerUrl!.bind(window.MonacoEnvironment!);
// MonacoEnvironment
window.MonacoEnvironment!.getWorkerUrl = (_, label) => {
  if (label === 'vue') {
    return vueWorkerURL;
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
  setupMonacoEnv();
  await loadOnigasm();
  await loadTheme(monaco.editor);
}

export default MonacoEditor;

function setupMonacoEnv(takeoverMode = false) {
  let initialized = false;

  languages.register({ id: 'vue', extensions: ['.vue'] });
  languages.onLanguage('vue', setup);

  if (takeoverMode) {
    languages.onLanguage('javascript', setup);
    languages.onLanguage('typescript', setup);
    languages.onLanguage('javascriptreact', setup);
    languages.onLanguage('typescriptreact', setup);
    languages.onLanguage('json', setup);
  }

  async function setup() {
    if (initialized) {
      return;
    }
    initialized = true;

    const worker = editor.createWebWorker<LanguageService>({
      moduleId: 'vs/language/vue/vueWorker',
      label: 'vue',
      createData: {},
    });
    const languageId = takeoverMode
      ? ['vue', 'javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'json']
      : ['vue'];
    const getSyncUris = () => editor.getModels().map((model) => model.uri);
    volar.editor.activateMarkers(worker, languageId, 'vue', getSyncUris, editor);
    volar.editor.activateAutoInsertion(worker, languageId, getSyncUris, editor);
    await volar.languages.registerProvides(worker, languageId, getSyncUris, languages);
  }
}
