import type { Middleware } from '../types';

const matchWidth = (): Middleware => ({
  name: 'matchWidth',
  fn(state) {
    return { data: { matchWidth: { width: state.reference.width } } };
  },
});

export default matchWidth;
