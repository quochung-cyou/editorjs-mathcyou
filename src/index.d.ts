import { BlockTool, BlockToolData, InlineTool } from "@editorjs/editorjs";

declare module 'editorjs-mathcyou' {
  export class InlineMathTool implements InlineTool {
    static get isInline(): boolean;
    static get title(): string;
    static get shortcut(): string;
    constructor(config: { api: any });
    render(): HTMLElement;
    surround(range: Range): void;
    checkState(): void;
    get state(): boolean;
    set state(state: boolean);
    renderActions(): HTMLElement;
    showActions(): void;
    hideActions(): void;
  }

  export class MathBlockTool implements BlockTool {
    static get toolbox(): { title: string; icon: string };
    constructor(config: { data: any; api: any; config?: any });
    render(): HTMLElement;
    save(block: HTMLElement): BlockToolData;
    static get sanitize(): { formula: boolean };
  }

  export function parseEditorOutput(blocks: any[]): Array<{
    type: string;
    elements?: Array<{ type: string; value: string }>;
    formula?: string;
  }>;

  export function renderInlineMath(
    html: string,
    katexInstance: any
  ): string;

  export function getStyles(): string;

  const _default: {
    InlineMathTool: typeof InlineMathTool;
    MathBlockTool: typeof MathBlockTool;
    parseEditorOutput: typeof parseEditorOutput;
    renderInlineMath: typeof renderInlineMath;
    getStyles: typeof getStyles;
  };

  export default _default;
}