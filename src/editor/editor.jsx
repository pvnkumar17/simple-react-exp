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
import { userInfoSucess } from '../actions/meAction';
import { cloneDeep, find } from 'lodash';

const theme = {
    // Theme styling goes here
    // ...
    MemoryMapTheme
}

function MyCustomAutoFocusPlugin({ initialEditorData }) {
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
function onError(error) {
    console.error(error);
}

const Editor = ({ initialEditorData, initialTreeData, sendEditorData }) => {
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
    const [isLinkEditMode, setIsLinkEditMode] = useState(false);
    const [editorReactState, setEditorReactState] = useState("");
    let debounceTimer = null;

    const onChange = (editorState) => {
        const editorStateJSON = JSON.stringify(editorState.toJSON());
        setEditorReactState(editorStateJSON);
    }

    useEffect(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        if (initialEditorData._id) {
            const userData = cloneDeep(initialTreeData);
            userData.data = userData?.data?.map(item => {
                item.flatNodes.map(flatNode => {
                    if (flatNode._id === initialEditorData._id) {
                        flatNode.data.text = editorReactState
                    }
                    return flatNode;
                })
                return item;
            });
            sendEditorData(userData);
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

function mapStateToProps(state, ownProps) {
    return {
        initialEditorData: state.meDetails.editorData,
        initialTreeData: state.meDetails.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        sendEditorData: (data) => dispatch(userInfoSucess(data))

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)