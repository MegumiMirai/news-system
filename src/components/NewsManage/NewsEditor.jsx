import React, {useEffect, useState} from 'react'
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState('')

  useEffect(() => {
    let content = props.content
    if(content === undefined) return
    const contentBlock = htmlToDraft(content);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
    }
  }, [props.content])

  return (
      <Editor
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={(editorState) => setEditorState(editorState)}
          onBlur={() => {props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}}
      />
  );
}