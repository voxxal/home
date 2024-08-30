export const slideInConf = {
  opacity: 0,
  yPercent: 125,
};

export const slideInConfTo = {
  duration: "random(0.6, 1.6, 0.1)",
  ease: "Power4.easeOut",
  opacity: 1,
  yPercent: 0,
};

export const slideInConfScroll = {
  duration: "random(0.6, 1.6, 0.1)",
  ease: "Power4.easeOut",
  opacity: 1,
  yPercent: 125,
};

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export const cantor = (a: number, b: number) => ((a + b) * (a + b + 1)) / 2 + a;