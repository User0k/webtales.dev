import { DARK_COLORS } from '../../constants';

export default function getColorBasedOnBackground(bgColor: string) {
  if (DARK_COLORS.includes(bgColor)) {
    return 'var(--color-white)';
  }
}
