/* eslint-disable no-bitwise */
import type { editor } from 'monaco-editor';
import { KeyCode, KeyMod, Range } from 'monaco-editor';

export enum MarkdownTags {
  /**
   * 加粗
   */
  Bold = '**',
  /**
   * 斜体
   */
  Italic = '_',
  /**
   * 删除线
   */
  StrikeThrough = '~~',
  /**
   * 行内代码
   */
  InlineCode = '`',
  /**
   * 代码块
   */
  CodeBlock = '```',
  /**
   * 引用
   */
  Blockquote = '> ',
  /**
   * 无序列表
   */
  UnorderedList = '+ ',
  /**
   * 有序列表
   */
  OrderedList = '1. ',
  /**
   * 表格
   */
  Table = '\n| th | th |\n| --- | --- |\n| td | td |\n\n',
}

interface CommandConfig {
  startTag: MarkdownTags;
  endTag: MarkdownTags;
  keybindings: number[];
  id: string;
  label: string;
}

// 配置并添加粗体、斜体和删除线快捷键
export const commands: CommandConfig[] = [
  {
    startTag: MarkdownTags.Bold,
    endTag: MarkdownTags.Bold,
    id: 'bold',
    label: 'bold',
    keybindings: [KeyMod.CtrlCmd | KeyCode.KeyB],
  },
  {
    startTag: MarkdownTags.Italic,
    endTag: MarkdownTags.Italic,
    id: 'italic',
    label: 'italic',
    keybindings: [KeyMod.CtrlCmd | KeyCode.KeyI],
  },
  {
    startTag: MarkdownTags.StrikeThrough,
    endTag: MarkdownTags.StrikeThrough,
    id: 'strikeThrough',
    label: 'strikeThrough',
    keybindings: [KeyMod.CtrlCmd | KeyCode.KeyS],
  },
  {
    startTag: MarkdownTags.InlineCode,
    endTag: MarkdownTags.InlineCode,
    id: 'inlineCode',
    label: 'inlineCode',
    keybindings: [KeyMod.CtrlCmd | KeyCode.Backquote],
  },
  {
    startTag: MarkdownTags.CodeBlock,
    endTag: MarkdownTags.CodeBlock,
    id: 'codeBlock',
    label: 'codeBlock',
    keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backquote],
  },
];

type TagCommand = {
  startTag: MarkdownTags;
  endTag?: MarkdownTags | '';
};

export function createMarkdownTagCommand({ startTag, endTag = startTag }: TagCommand) {
  return (editorInstance: editor.ICodeEditor) => {
    // 只有部分 tag 是处理选中的文本的
    if (
      [
        MarkdownTags.Bold,
        MarkdownTags.Italic,
        MarkdownTags.InlineCode,
        MarkdownTags.StrikeThrough,
        MarkdownTags.Table,
      ].includes(startTag)
    ) {
      const selection = editorInstance.getSelection();
      if (selection) {
        const selectedText = editorInstance.getModel()?.getValueInRange(selection)!;

        // 如果已经有了 startTag 和 endTag，那么就取消掉
        if (
          selectedText.startsWith(startTag) &&
          selectedText.endsWith(endTag) &&
          selectedText.length > startTag.length + endTag.length
        ) {
          const formattedText = selectedText.slice(startTag.length, -endTag.length);
          const operation = { range: selection, text: formattedText };
          editorInstance.executeEdits('', [operation]);
          editorInstance.pushUndoStop();
        } else {
          const formattedText = `${startTag}${selectedText}${endTag}`;
          const operation = { range: selection, text: formattedText };
          editorInstance.executeEdits('', [operation]);
          editorInstance.pushUndoStop();
        }
      }
    }
    // Blockquote 和 List 是处理当前行的
    if (
      [MarkdownTags.Blockquote, MarkdownTags.UnorderedList, MarkdownTags.OrderedList].includes(
        startTag,
      )
    ) {
      // 在行首插入
      // 获取当前的光标位置
      const position = editorInstance.getPosition()!;

      // 创建一个代表行首的范围
      const startOfLine = new Range(position.lineNumber, 1, position.lineNumber, 1);

      // 创建一个操作
      const operation = { range: startOfLine, text: startTag, forceMoveMarkers: true };

      // 执行操作
      editorInstance.executeEdits('', [operation]);
      editorInstance.pushUndoStop();
    }
    // MarkdownTags.CodeBlock, 代码块是处理多行的
    if (startTag === MarkdownTags.CodeBlock) {
      const selection = editorInstance.getSelection();
      if (selection) {
        const selectedText = editorInstance.getModel()?.getValueInRange(selection)!;

        // 如果已经有了 startTag 和 endTag，那么就取消掉
        if (
          selectedText.trim().startsWith(startTag) &&
          selectedText.trim().endsWith(endTag) &&
          selectedText.length > startTag.length + endTag.length
        ) {
          const formattedText = selectedText.trim().slice(startTag.length + 1, -endTag.length - 1);
          const operation = { range: selection, text: formattedText };
          editorInstance.executeEdits('', [operation]);
          editorInstance.pushUndoStop();
        } else {
          const formattedText = `\n${startTag}\n${selectedText}\n${endTag}\n`;
          const operation = { range: selection, text: formattedText };
          editorInstance.executeEdits('', [operation]);
          editorInstance.pushUndoStop();
        }
      }
    }
  };
}

export const runTagCommand = (editorInstance: editor.ICodeEditor, command: TagCommand) => {
  createMarkdownTagCommand({
    startTag: command.startTag,
    endTag: command.endTag,
  })(editorInstance);
  editorInstance.focus();
};
