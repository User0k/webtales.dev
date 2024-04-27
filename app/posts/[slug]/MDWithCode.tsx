import MDToJSX from 'markdown-to-jsx';
import getHighlightedLinesInLang from '@/utils/getHighlightedLinesInLang';
import { getHighlighter } from 'shiki';

export default async function Markdown({ content }: { content: string }) {
  const reversedLangs = getHighlightedLinesInLang(content).reverse();
  const highlighter = await getHighlighter({
    themes: ['material-theme-ocean'],
    langs: reversedLangs.map((lang) => lang.lang),
  });

  return (
    <MDToJSX
      options={{
        overrides: {
          code: {
            component: async ({ children }) => {
              if (!children.includes('\n')) {
                return <code className="quote">{children}</code>;
              }

              const { lang, highlightLines } = reversedLangs.pop() || {
                lang: 'javascript',
                highlightLines: [],
              };

              const dirtyHTML = highlighter.codeToHtml(children, {
                lang,
                theme: 'material-theme-ocean',
                transformers: [
                  {
                    line(node, line) {
                      node.properties['data-line'] = line;
                      if (highlightLines.includes(line))
                        this.addClassToHast(node, 'highlighted');
                    },
                  },
                ],
              });

              //cut off unnecessary wrappers, replace comment color
              const firstToSlice = dirtyHTML.indexOf('<span');
              const lastToSlice = dirtyHTML.lastIndexOf('</span>');
              const htmlCode = dirtyHTML
                .slice(firstToSlice, lastToSlice)
                .replace(/#464B5D/g, '#6c6e76');

              return (
                <code
                  className={`lang-${lang} shiki`}
                  dangerouslySetInnerHTML={{
                    __html: htmlCode,
                  }}
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
