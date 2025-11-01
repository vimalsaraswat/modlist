export const parseYear = (ym: string) => Number(ym.slice(0, 4));

export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
