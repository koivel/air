const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: [
    {
      pattern: /(row|col)-span-(1|2|3|4|5|6|7|8|9|10|11|12|)/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'],
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
