/**
 * Parses Editor.js output to handle inline math
 * 
 * @param {Array} blocks - Blocks from Editor.js output
 * @returns {Array} - Parsed blocks with structured content
 */
export const parseEditorOutput = (blocks) => {
    return blocks.map(block => {
      if (block.type === 'paragraph') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = block.data.text;
        
        const elements = [];
        let currentTextNode = '';
        
        for (let i = 0; i < tempDiv.childNodes.length; i++) {
          const node = tempDiv.childNodes[i];
          
          if (node.nodeType === Node.TEXT_NODE) {
            currentTextNode += node.textContent;
          } else if (node.classList && node.classList.contains('inline-math')) {
            if (currentTextNode.trim()) {
              elements.push({ type: 'text', value: currentTextNode });
              currentTextNode = '';
            }
            
            elements.push({ 
              type: 'math', 
              value: node.getAttribute('data-tex') 
            });
          } else {
            if (currentTextNode.trim()) {
              elements.push({ type: 'text', value: currentTextNode });
              currentTextNode = '';
            }
            
            const tempContainer = document.createElement('div');
            tempContainer.appendChild(node.cloneNode(true));
            elements.push({ type: 'html', value: tempContainer.innerHTML });
          }
        }
        
        if (currentTextNode.trim()) {
          elements.push({ type: 'text', value: currentTextNode });
        }
        
        if (elements.length === 0) {
          elements.push({ type: 'text', value: '' });
        }
        
        return {
          type: 'paragraph',
          elements: elements
        };
      } else if (block.type === 'mathBlock') {
        return {
          type: 'mathBlock',
          formula: block.data.formula
        };
      } else {
        return block;
      }
    });
  };
  
  /**
   * Renders inline math elements in HTML
   * 
   * @param {string} html - HTML content with inline math elements
   * @param {Object} katexInstance - KaTeX instance to use for rendering
   * @returns {string} - HTML with rendered inline math
   */
  export const renderInlineMath = (html, katexInstance) => {
    if (!katexInstance) {
      console.warn('KaTeX is not available for rendering inline math');
      return html;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const mathElements = tempDiv.querySelectorAll('.inline-math');
    
    mathElements.forEach(element => {
      const tex = element.getAttribute('data-tex');
      try {
        element.innerHTML = katexInstance.renderToString(tex, { 
          displayMode: false,
          throwOnError: false
        });
      } catch (error) {
        element.innerHTML = `<span style="color: red;">${error.message}</span>`;
      }
    });
    
    return tempDiv.innerHTML;
  };
  
  /**
   * Custom styles for math components
   * @returns {string} - CSS styles as a string
   */
  export const getStyles = () => {
    return `
      .math-block-wrapper {
        margin: 15px 0;
        padding: 10px;
        background-color: #f8f8f8;
        border-radius: 5px;
      }
      
      .math-block-preview {
        display: flex;
        justify-content: center;
        padding: 15px 0;
        overflow-x: auto;
      }
      
      .math-block-input {
        width: 100%;
        padding: 8px;
        font-family: monospace;
        border: 1px solid #ddd;
        border-radius: 3px;
        min-height: 60px;
      }
      
      .inline-math {
        display: inline-block;
        cursor: pointer;
        padding: 0 2px;
        background-color: rgba(74, 144, 226, 0.1);
        border-radius: 3px;
      }
    `;
  };