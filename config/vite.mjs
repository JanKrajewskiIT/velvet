export const solidMarkdownOptimizeDeps = {
  exclude: ['solid-markdown'],
  include: [
    'remark-gfm',
    'solid-markdown > extend',
    'solid-markdown > style-to-object',
    'solid-markdown > inline-style-parser',
    'solid-markdown > debug',
    'solid-markdown > ms',
  ],
  extensions: ['.jsx'],
};
