export const firstOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

export const sameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
