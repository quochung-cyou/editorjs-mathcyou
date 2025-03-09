import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import { InlineMathTool, MathBlockTool, parseEditorOutput, getStyles } from 'editorjs-mathcyou';
import 'katex/dist/katex.min.css';
import './App.css';

// Default content with math formulas (inline and block)
const defaultContent = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'paragraph',
      data: {
        text: 'Example: The sum formula is \\sum_{i=0}^n i = \\frac{n(n+1)}{2}. Try select some text and press inline-math button'
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Example below is math block'
      }
    },
    {
      type: 'mathBlock',
      data: {
        text: '\\(\\int_0^\\infty e^{-x} dx = 1\\)'
      }
    }
  ],
  version: '2.22.2'
};

const App: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject custom math tool CSS into the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = getStyles();
    document.head.appendChild(styleElement);

    if (editorHolderRef.current) {
      editorRef.current = new EditorJS({
        holder: editorHolderRef.current,
        data: defaultContent,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          inlineMath: {
            class: InlineMathTool,
          },
          mathBlock: {
            class: MathBlockTool,
          },
        },
        onReady: () => {
          console.log('Editor.js is ready');
        },
      });
    }

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
      }
    };
  }, []);

  // Save and parse the editor content
  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        const parsedData = parseEditorOutput(savedData.blocks);
        console.log('Parsed Data:', parsedData);
      } catch (error) {
        console.error('Error saving content:', error);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Editor.js with MathCyou Demo</h1>
      </header>
      <main className="app-main">
        <div className="editor-container">
          <div ref={editorHolderRef} id="editorjs" className="editorjs-box" />
        </div>
        <div className="controls">
          <button onClick={handleSave} className="save-button">
            Save Content
          </button>
          <p className="note">
            Note: The default content includes math formulas that will not render until you click "Save Content".
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
