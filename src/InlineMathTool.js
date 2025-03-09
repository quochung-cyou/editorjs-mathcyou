export default class InlineMathTool {
    static get isInline() {
      return true;
    }
  
    static get title() {
      return 'Inline Math';
    }
  
    static get shortcut() {
      return 'CMD+SHIFT+M';
    }
  
    constructor({ api }) {
      this.api = api;
      this.button = null;
      this._state = false;
      this.tag = 'SPAN';
      this.class = 'inline-math';
      this.texAttribute = 'data-tex';
      this.inlineMathNode = null;
      this.tex = '';
      
      // Check if katex is available globally
      this.katex = typeof katex !== 'undefined' ? katex : null;
  
      // If katex is not available globally, try to require it
      if (!this.katex) {
        try {
          this.katex = require('katex');
        } catch (e) {
          console.warn('KaTeX is not available. Inline Math Tool will not render LaTeX properly.');
        }
      }
    }
  
    get state() {
      return this._state;
    }
  
    set state(state) {
      this._state = state;
      this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }
  
    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.classList.add(this.api.styles.inlineToolButton);
      this.button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.1873 4.14049C11.2229 3.41714 9.84236 4.0695 9.78883 5.27389L9.71211 7H12C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9H9.62322L9.22988 17.8501C9.0996 20.7815 5.63681 22.261 3.42857 20.3287L3.34151 20.2526C2.92587 19.8889 2.88375 19.2571 3.24743 18.8415C3.61112 18.4259 4.24288 18.3837 4.65852 18.7474L4.74558 18.8236C5.69197 19.6517 7.17602 19.0176 7.23186 17.7613L7.62125 9H6C5.44772 9 5 8.55228 5 8C5 7.44772 5.44772 7 6 7H7.71014L7.7908 5.18509C7.9157 2.37483 11.1369 0.852675 13.3873 2.54049L13.6 2.69999C14.0418 3.03136 14.1314 3.65817 13.8 4.09999C13.4686 4.54182 12.8418 4.63136 12.4 4.29999L12.1873 4.14049Z" fill="currentColor"/>
          <path d="M13.082 13.0462C13.3348 12.9071 13.6525 13.0103 13.7754 13.2714L14.5879 14.9979L11.2928 18.2929C10.9023 18.6834 10.9023 19.3166 11.2928 19.7071C11.6834 20.0977 12.3165 20.0977 12.707 19.7071L15.493 16.9212L16.2729 18.5786C16.9676 20.0548 18.8673 20.4808 20.1259 19.4425L20.6363 19.0214C21.0623 18.6699 21.1228 18.0397 20.7713 17.6136C20.4198 17.1876 19.7896 17.1272 19.3636 17.4787L18.8531 17.8998C18.6014 18.1074 18.2215 18.0222 18.0825 17.727L16.996 15.4182L19.707 12.7071C20.0976 12.3166 20.0976 11.6834 19.707 11.2929C19.3165 10.9024 18.6834 10.9024 18.2928 11.2929L16.0909 13.4948L15.585 12.4198C14.9708 11.1144 13.3822 10.5985 12.1182 11.2937L11.518 11.6238C11.0341 11.89 10.8576 12.498 11.1237 12.982C11.3899 13.4659 11.998 13.6424 12.4819 13.3762L13.082 13.0462Z" fill="currentColor"/>
        </svg>
      `;
      return this.button;
    }
  
    surround(range) {
      if (this.state) {
        this.unwrap(range);
        return;
      }
      this.wrap(range);
    }
  
    wrap(range) {
      const selectedText = range.extractContents();
      const tex = this.getTextContent(selectedText);
  
      const inlineMathNode = document.createElement(this.tag);
      inlineMathNode.classList.add(this.class);
      inlineMathNode.setAttribute(this.texAttribute, tex);
      inlineMathNode.contentEditable = 'false';
      inlineMathNode.innerHTML = this.renderKatexToString(tex);
  
      range.insertNode(inlineMathNode);
      this.state = true;
      this.inlineMathNode = inlineMathNode;
      this.tex = tex;
    }
  
    unwrap(range) {
      if (this.inlineMathNode) {
        this.inlineMathNode.remove();
        const textNode = document.createTextNode(this.tex);
        range.insertNode(textNode);
      } else {
        const mark = this.api.selection.findParentTag(this.tag, this.class);
        const tex = mark.getAttribute(this.texAttribute);
        
        mark.remove();
        
        const textNode = document.createTextNode(tex);
        range.insertNode(textNode);
      }
  
      this.state = false;
    }
  
    checkState() {
      const mark = this.api.selection.findParentTag(this.tag, this.class);
      this.state = !!mark;
  
      if (this.state) {
        this.inlineMathNode = mark;
        this.tex = mark.getAttribute(this.texAttribute);
      }
    }
  
    getTextContent(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      let result = '';
      for (let i = 0; i < node.childNodes.length; i++) {
        result += this.getTextContent(node.childNodes[i]);
      }
      
      return result;
    }
  
    renderActions() {
      this.inlineMathTextInput = document.createElement('input');
      this.inlineMathTextInput.type = 'text';
      this.inlineMathTextInput.classList.add('cdx-input');
      this.inlineMathTextInput.placeholder = 'Enter LaTeX expression (e.g., \\alpha + \\beta)';
      this.inlineMathTextInput.value = this.tex;
      this.inlineMathTextInput.style.display = 'none';
      
      this.inlineMathTextInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.tex = e.target.value;
          this.inlineMathNode.innerHTML = this.renderKatexToString(this.tex);
          this.inlineMathNode.setAttribute(this.texAttribute, this.tex);
          this.api.inlineToolbar.close();
        }
      });
      
      return this.inlineMathTextInput;
    }
  
    showActions() {
      this.inlineMathTextInput.style.display = 'block';
      this.inlineMathTextInput.value = this.tex;
      this.inlineMathTextInput.focus();
    }
  
    hideActions() {
      this.inlineMathTextInput.style.display = 'none';
    }
  
    renderKatexToString(tex) {
      if (!this.katex) {
        return `<span style="color: orange; font-style: italic;">${tex}</span>`;
      }
      
      try {
        return this.katex.renderToString(tex, { 
          displayMode: false,
          throwOnError: false
        });
      } catch (error) {
        return `<span style="color: red;">${error.message}</span>`;
      }
    }
  }