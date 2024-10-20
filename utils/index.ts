export const getEnd = (scores: (string | number)[]): number => {
  return scores.reduce((acc: number, curr) => {
    const c = curr === "M" ? 0 : curr === "10X" ? 10 : curr;
    return Number(acc) + Number(c);
  }, 0 as number);
};