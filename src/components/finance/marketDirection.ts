export const marketDirection = (value: number): 'up' | 'down' | 'flat' =>
  value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
