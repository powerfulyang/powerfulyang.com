import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

loader.config({
  monaco,
});

export default MonacoEditor;
