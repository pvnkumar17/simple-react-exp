import {$getRoot, $getSelection, EditorState, $createParagraphNode, $createTextNode} from 'lexical';
import {useEffect, useState} from 'react';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import MemoryMapNodes from '../nodes/MemoryMapNodes';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import MemoryMapTheme from '../themes/MemoryMapTheme';
import AutoEmbedPlugin from '../plugins/AutoEmbedPlugin';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import ImagesPlugin from '../plugins/ImagesPlugin';
import YouTubePlugin from '../plugins/YouTubePlugin';
import "./editor.css";

const theme = {
  // Theme styling goes here
  // ...
  MemoryMapTheme
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Analytics'));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        `Memory mapped files provide a mechanism for a process to access files by directly incorporating file data into the process address space. The use of mapped files can significantly reduce I/O data movement since the file data does not have to be copied into process data buffers, as is done by the read and write subroutines. When more than one process maps the same file,` +
          `its contents are shared among them, providing a low-overhead mechanism by which processes can synchronize and communicate.`,
      ),
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode('The playground is a demo environment built with '),
      $createTextNode('@lexical/react').toggleFormat('code'),
      $createTextNode('.'),
      $createTextNode(' Try typing in '),
      $createTextNode('some text').toggleFormat('bold'),
      $createTextNode(' with '),
      $createTextNode('different').toggleFormat('italic'),
      $createTextNode(' formats.'),
    );
    root.append(paragraph);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode(
        'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
      ),
    );
    root.append(paragraph2);
  }
}

export function Editor() {
  const initialConfig = {
    editorState: prepopulatedRichText,
    namespace: 'MyEditor',
    nodes: [...MemoryMapNodes],
    theme: MemoryMapTheme,
    onError,
  };
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <div className="editor-shell">
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
          <AutoFocusPlugin />
          <AutoEmbedPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input"/>}
            placeholder={<div className="editor-placeholder">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <ImagesPlugin />
          <YouTubePlugin />
          <MyCustomAutoFocusPlugin />
        </div>
      </div>  
    </LexicalComposer>
  );
}