import { createHash } from 'node:crypto';
import { relative } from 'node:path';

export default {
  generateScopedName: (name, filename) => {
    const source = relative(import.meta.dirname, filename).replaceAll('\\', '/');
    const hash = createHash('sha256')
      .update(source + ':' + name)
      .digest('hex')
      .slice(0, 8);
    return `vui-${name}_${hash}`;
  },
};
