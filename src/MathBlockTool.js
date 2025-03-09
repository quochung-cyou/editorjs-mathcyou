export default class MathBlockTool {
    static get toolbox() {
      return {
        title: 'Math Block',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H20M8 8V16M16 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      };
    }
  
    constructor({ data, api, config }) {
      this.api = api;
      this.data = {
        formula: data.formula || '\\sum_{i=0}^n i = \\frac{n(n+1)}{2}'
      };
      this.config = config || {};
      this.wrapper = undefined;
      this.preview = undefined;
      this.input = undefined;
      
      // Check if katex is available globally
      this.katex = typeof katex !== 'undefined' ? katex : null;
  
      // If katex is not available globally, try to require it
      if (!this.katex) {
        try {
          this.katex = require('katex');
        } catch (e) {
          console.warn('KaTeX is not available. Math Block Tool will not render LaTeX properly.');
        }
      }
    }
  
    render() {
      this.wrapper = document.createElement('div');
      this.wrapper.classList.add('math-block-wrapper');
      
      this.preview = document.createElement('div');
      this.preview.classList.add('math-block-preview');
      
      this.input = document.createElement('textarea');
      this.input.classList.add('math-block-input');
      this.input.placeholder = 'Enter LaTeX code here';
      this.input.value = this.data.formula;
      
      this.input.addEventListener('input', () => {
        this.updatePreview();
      });
      
      this.updatePreview();
      
      this.wrapper.appendChild(this.preview);
      this.wrapper.appendChild(this.input);
      
      return this.wrapper;
    }
  
    updatePreview() {
      if (!this.katex) {
        this.preview.innerHTML = `<div style="padding: 10px; background: #fffde7; color: #ff9800; text-align: center; border-radius: 4px;">
          <p>KaTeX is not available. Please include KaTeX in your project to render math properly.</p>
          <pre style="text-align: left; padding: 8px; margin: 8px 0; background: #fff8e1; border-radius: 4px;">${this.input.value}</pre>
        </div>`;
        return;
      }
      
      try {
        this.katex.render(this.input.value, this.preview, {
          displayMode: true,
          throwOnError: false
        });
      } catch (error) {
        this.preview.innerHTML = `<span style="color: red;">${error.message}</span>`;
      }
    }
  
    save() {
      return {
        formula: this.input.value
      };
    }
  
    static get sanitize() {
      return {
        formula: false // Allow LaTeX input
      };
    }
  }