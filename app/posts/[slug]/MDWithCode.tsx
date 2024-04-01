import MDToJSX from 'markdown-to-jsx';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import './code.css';

export default async function Markdown({ content }: { content: string }) {
  hljs.registerLanguage('javascript', javascript);

  return (
    <MDToJSX
      options={{
        overrides: {
          code: {
            component: ({ children, className }) => {
              const lang = className.replace('lang-', '');
              const highlightedCode = hljs.highlight(lang, children).value;
              return (
                <code
                  className={`lang-${lang}`}
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              );
            },
          },
        },
      }}
    >
      {content}
    </MDToJSX>
  );
}
