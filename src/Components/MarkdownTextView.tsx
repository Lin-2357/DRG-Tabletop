import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import 'katex/dist/katex.min.css'
import './MarkdownTextView.css'

function MarkdownTextView(props: { rawText?: string, disableCodeHighlighter?: boolean, disableCopy?: boolean }) {
    const overrideAction = (ev: ClipboardEvent) => {
        ev.preventDefault()
    }
    
    useEffect(() => {
        if (props.disableCopy) {
            const markdownViews = document.getElementsByClassName("markdown-view")
            for (let i = 0; i < markdownViews.length; i++) {
                let view = markdownViews.item(i) as HTMLDivElement
                view.removeEventListener('copy', overrideAction)
                view.addEventListener('copy', overrideAction)
            }
        }
    })
    
    return <ReactMarkdown children={props.rawText || 'No text to show.'} className="markdown-view" remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} 
    components={props.disableCodeHighlighter ? {} : {
        code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '') || ['language-swift', 'swift']
            return !inline && match ? (
                <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    // @ts-ignore
                    style={SYNTAX_THEME}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                />
            ) : (
                <span className='inline-code'>
                    <code className={className} {...props}>
                    {children}
                    </code>
                </span>
            )
        }
    }}
    />;
}

const SYNTAX_THEME = {
    "code[class*=\"language-\"]": {
      "color": "black",
      "maxWidth": "100%",
      "background": "none",
      "fontFamily": "Menlo, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      "fontSize": "95%",
      "textAlign": "left",
      "whiteSpace": "pre",
      "wordSpacing": "normal",
      "wordBreak": "normal",
      "wordWrap": "break-word",
      "lineHeight": "1.5",
      "MozTabSize": "4",
      "OTabSize": "4",
      "tabSize": "4",
      "WebkitHyphens": "none",
      "MozHyphens": "none",
      "msHyphens": "none",
      "hyphens": "none",
    },
    "pre[class*=\"language-\"]": {
      "borderRadius": "5px",
      "maxWidth": "100%",
      "color": "black",
      "background": "#f2f2f2",
      "fontFamily": "Menlo, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      "fontSize": "1em",
      "textAlign": "left",
      "whiteSpace": "pre",
      "wordSpacing": "normal",
      "wordBreak": "normal",
      "wordWrap": "break-word",
      "lineHeight": "1.5",
      "MozTabSize": "4",
      "OTabSize": "4",
      "tabSize": "4",
      "WebkitHyphens": "none",
      "MozHyphens": "none",
      "msHyphens": "none",
      "hyphens": "none",
      "padding": "0.8em 1em",
      "margin": ".5em 0",
      "overflow": "auto"
    },
    "pre[class*=\"language-\"]::-moz-selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "pre[class*=\"language-\"] ::-moz-selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "code[class*=\"language-\"]::-moz-selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "code[class*=\"language-\"] ::-moz-selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "pre[class*=\"language-\"]::selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "pre[class*=\"language-\"] ::selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "code[class*=\"language-\"]::selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    "code[class*=\"language-\"] ::selection": {
      "textShadow": "none",
      "background": "#b3d4fc"
    },
    ":not(pre) > code[class*=\"language-\"]": {
      "background": "#f5f2f0",
      "padding": ".1em",
      "borderRadius": ".3em",
      "whiteSpace": "normal"
    },
    "comment": {
      "color": "slategray"
    },
    "prolog": {
      "color": "slategray"
    },
    "doctype": {
      "color": "slategray"
    },
    "cdata": {
      "color": "slategray"
    },
    "punctuation": {
      "color": "#555"
    },
    "namespace": {
      "Opacity": ".7"
    },
    "property": {
      "color": "#905"
    },
    "tag": {
      "color": "#905"
    },
    "boolean": {
      "color": "#AD3DA4",
      "fontWeight": "600"
    },
    "number": {
      "color": "#272AD8"
    },
    "constant": {
      "color": "#905"
    },
    "symbol": {
      "color": "#905"
    },
    "deleted": {
      "color": "#905"
    },
    "selector": {
      "color": "#690"
    },
    "attr-name": {
      "color": "#690"
    },
    "string": {
      "color": "#D12F1B"
    },
    "char": {
      "color": "#690"
    },
    "builtin": {
      "color": "#804FB8"
    },
    "inserted": {
      "color": "#690"
    },
    "operator": {
      "color": "#202020",
    },
    "entity": {
      "color": "#9a6e3a",
      "cursor": "help"
    },
    "url": {
      "color": "#9a6e3a",
    },
    ".language-css .token.string": {
      "color": "#9a6e3a",
    },
    ".style .token.string": {
      "color": "#9a6e3a",
    },
    "atrule": { // Swift decorator
      "color": "#b5b"
    },
    "attr-value": {
      "color": "#07a"
    },
    "keyword": {
      "color": "#AD3DA4",
      "fontWeight": "600"
    },
    "function": {
      "color": "#3E8087"
    },
    "class-name": {
      "color": "#4B21B0"
    },
    "regex": {
      "color": "#e90"
    },
    "important": {
      "color": "#e90",
      "fontWeight": "bold"
    },
    "variable": {
      "color": "#e90"
    },
    "bold": {
      "fontWeight": "bold"
    },
    "italic": {
      "fontStyle": "italic"
    }
  };
 
export default MarkdownTextView;