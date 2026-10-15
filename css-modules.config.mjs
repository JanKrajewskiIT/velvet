import { createHash } from 'node:crypto';
import { relative } from 'node:path';

export default {
  getJSON: (filename, classes) => {
    for (const [name, value] of Object.entries(classes)) {
      if (value.split(/\s+/u).includes('undefined')) {
        throw new Error(`Unresolved CSS composition for "${name}" in ${filename}`);
      }
    }
  },
  generateScopedName: (name, filename) => {
    const source = relative(import.meta.dirname, filename).replaceAll('\\', '/');
    const hash = createHash('sha256')
      .update(source + ':' + name)
      .digest('hex')
      .slice(0, 8);
    return `vui-${name}_${hash}`;
  },
};
