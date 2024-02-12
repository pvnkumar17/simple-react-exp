import { $getRoot, $getSelection, EditorState, $createParagraphNode, $createTextNode, CLEAR_HISTORY_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import MemoryMapNodes from '../nodes/MemoryMapNodes';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import MemoryMapTheme from '../themes/MemoryMapTheme';
import AutoEmbedPlugin from '../plugins/AutoEmbedPlugin';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import ImagesPlugin from '../plugins/ImagesPlugin';
import YouTubePlugin from '../plugins/YouTubePlugin';
import "./editor.css";
import { connect } from 'react-redux';
import { setUserEditorData } from '../services/meService';

const theme = {
  // Theme styling goes here
  // ...
  MemoryMapTheme
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
// function onChange(editorState: EditorState) {
//   editorState.read(() => {
//     // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();

//     console.log(root, selection);
//   });
//   setUserEditorData()
// }

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin({ initialEditorData }: { initialEditorData: any }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  useEffect(() => {
    setInitialEditor();
  }, [initialEditorData]);

  const setInitialEditor = () => {
    if (editor && initialEditorData.data?.text) {
      const newData = editor.parseEditorState(initialEditorData.data?.text);
      editor.setEditorState(newData);
    }
  };

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

// function prepopulatedRichText(initialEditorData:any) {
//   const root = $getRoot();
//   if (root.getFirstChild() === null) {
//     const heading = $createHeadingNode('h1');
//     heading.append($createTextNode(initialEditorData.title));
//     root.append(heading);
//     const quote = $createQuoteNode();
//     quote.append(
//       $createTextNode(
//         `Memory mapped files provide a mechanism for a process to access files by directly incorporating file data into the process address space. The use of mapped files can significantly reduce I/O data movement since the file data does not have to be copied into process data buffers, as is done by the read and write subroutines. When more than one process maps the same file,` +
//           `its contents are shared among them, providing a low-overhead mechanism by which processes can synchronize and communicate.`,
//       ),
//     );
//     root.append(quote);
//     const paragraph = $createParagraphNode();
//     paragraph.append(
//       $createTextNode('The playground is a demo environment built with '),
//       $createTextNode('@lexical/react').toggleFormat('code'),
//       $createTextNode('.'),
//       $createTextNode(' Try typing in '),
//       $createTextNode('some text').toggleFormat('bold'),
//       $createTextNode(' with '),
//       $createTextNode('different').toggleFormat('italic'),
//       $createTextNode(' formats.'),
//     );
//     root.append(paragraph);
//     const paragraph2 = $createParagraphNode();
//     paragraph2.append(
//       $createTextNode(
//         'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
//       ),
//     );
//     root.append(paragraph2);
//   }
// }

const Editor = ({ initialEditorData }: { initialEditorData: any }) => {
  const editorText = initialEditorData.data?.text || "{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"heading\",\"version\":1,\"tag\":\"h1\"}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";
  function prepopulatedRichText() {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const heading = $createHeadingNode('h1');
      heading.append($createTextNode(initialEditorData));
      root.append(heading);
    }
  }
  const initialConfig = {
    editorState: editorText,
    namespace: 'MyEditor',
    nodes: [...MemoryMapNodes],
    theme: MemoryMapTheme,
    onError,
  };
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [editorReactState, setEditorReactState] = useState("");
  let debounceTimer: any = null;

  const onChange = (editorState: EditorState) => {
    const editorStateJSON = JSON.stringify(editorState.toJSON());
    setEditorReactState(editorStateJSON);
  }

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    if (initialEditorData._id) {
      debounceTimer = setTimeout(() => {
        setUserEditorData(initialEditorData._id, editorReactState);
        //console.log(event.target.value); // You can handle the changes here
      }, 5000);
    }
  }, [editorReactState]);


  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <div className="editor-shell">
          <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
          <AutoFocusPlugin />
          <AutoEmbedPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <ImagesPlugin />
          <YouTubePlugin />
          <MyCustomAutoFocusPlugin initialEditorData={initialEditorData} />
        </div>
      </div>
    </LexicalComposer>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    initialEditorData: state.meDetails.editorData
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    //sendEditorData: (data:any) => dispatch(editorInfoUpdate(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)