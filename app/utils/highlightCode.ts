import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

const languages = new Map([
  [['css'], css],
  [['js', 'javascript', 'jsx'], javascript],
  [['ts', 'typescript', 'tsx'], typescript],
  [['html', 'xml'], xml],
]);

export default function highlightCode(lang: string, children: string) {
  for (const [keys, value] of languages) {
    if (keys.includes(lang)) {
      hljs.registerLanguage(lang, value);
      return hljs.highlight(children, {
        language: lang,
      }).value;
    }
  }

  hljs.registerLanguage('javascript', javascript);
  return hljs.highlight(children, {
    language: 'javascript',
  }).value;
}
