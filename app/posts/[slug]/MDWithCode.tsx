import MDToJSX from 'markdown-to-jsx';
import highlightCode from '@/utils/highlightCode';
import getHighlightedLinesInLang from '@/utils/getHighlightedLinesInLang';

export default async function Markdown({ content }: { content: string }) {
  const reversedLangs = getHighlightedLinesInLang(content).reverse();

  return (
    <MDToJSX
      options={{
        overrides: {
          code: {
            component: ({ children }) => {
              if (!children.includes('\n')) {
                return <code className="quote">{children}</code>;
              }

              const { lang, highlightLines } = reversedLangs.pop() || {
                lang: 'javascript',
                highlightLines: [],
              };

              const htmlCode = highlightCode(lang, children)
                .split('\n')
                .map((line, i) =>
                  highlightLines.includes(i)
                    ? `<span class="line highlighted">${line}</span>`
                    : `<span class="line">${line}</span>`,
                )
                .join('\n');

              return (
                <code
                  className={`lang-${lang}`}
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
