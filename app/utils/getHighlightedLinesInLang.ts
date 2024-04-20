import { CODE_BLOCK_HEADER_REGEX } from '../constants/regexps';

export default function getHighlightedLinesInLang(md: string) {
  const matches = md.matchAll(CODE_BLOCK_HEADER_REGEX);
  const indexesInLang = [];
  for (const match of matches) {
    indexesInLang.push({
      lang: match[1],
      highlightLines: lineIndexesFromRule(match[2]),
    });
  }

  return indexesInLang;
}

function lineIndexesFromRule(rule: string | undefined) {
  if (rule) {
    return rule.split(',').reduce((acc: number[], n: string) => {
      if (!n.includes('-')) {
        acc.push(+n - 1);
        return acc;
      }

      let [start, end] = n.split('-').map(Number);
      while (start <= end) {
        acc.push(start - 1);
        start++;
      }

      return acc;
    }, []);
  }

  return [];
}
