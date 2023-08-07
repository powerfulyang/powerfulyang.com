import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// monaco-editor has fixed this issue at v0.35.0
// monaco.languages.register({
//   id: 'vs.editor.nullLanguage',
// });
// monaco.languages.setLanguageConfiguration('vs.editor.nullLanguage', {});

loader.config({
  monaco,
});

export default MonacoEditor;
