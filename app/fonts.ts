/*
To avoid build issues in Next.js, it's recommended to move fonts to a separate file
instead of exporting them from the layout.
Exporting the Merriweather font allows easy inclusion as a CSS variable for further use.
 */

import { Inter, Merriweather } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: '300',
  style: 'italic',
});
