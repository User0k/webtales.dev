import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';

export default function generateRibbonColors(tag: string) {
  tag = tag.toLowerCase();
  const backgroundColor =
    DARK_COLORS.includes(tag) || LIGHT_COLORS.includes(tag)
      ? `var(--color-${tag})`
      : `var(--color-javascript)`;

  const color = DARK_COLORS.includes(tag) ? 'var(--color-white)' : undefined;

  return { backgroundColor, color };
}
