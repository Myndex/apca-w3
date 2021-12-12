export const apcaGridFontSizes = [
  10, 11, 12, 14, 16, 18, 21, 24, 32, 42, 56, 72, 96, 128,
];

export const apcaGridFontWeights = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export const apcaGrid = [
  ["min", "min", "min", 60, 60, 60, 60, "min", "min"],
  ["min", "min", "min", 60, 60, 60, 60, "min", "min"],
  ["min", "min", 75, 90, 75, 75, 75, "min", "min"],
  ["min", "min", 75, 90, 85, 80, 75, "min", "min"],
  ["min", 75, 75, 75, 70, 65, 60, 55, "min"],
  ["min", 75, 90, 70, 65, 60, 55, 50, 45],
  ["min", 75, 85, 65, 60, 55, 50, 45, 40],
  ["min", 90, 75, 60, 55, 50, 45, 40, 35],
  ["min", 85, 70, 55, 50, 45, 40, 35, 30],
  [90, 75, 60, 50, 45, 40, 35, 30, "max"],
  [85, 70, 55, 45, 40, 35, 30, "max", "max"],
  [75, 60, 50, 40, 35, 30, "max", "max", "max"],
  [70, 55, 45, 35, 30, "max", "max", "max", "max"],
  [60, 45, 40, 30, "max", "max", "max", "max", "max"],
];

/**
90 • Preferred level for fluent text. Also a suggested minimum for extremely thin fonts. 90 is a suggested maximum for very large and bold fonts (greater than 36px bold), and large areas of color.
75 • Minimum level for columns of body text. Also, can be used for any text where readability is important.
60 • The minimum level recommended for readable content text, that is, text you want people to read. "Sort of" like the old 4.5:1 in WCAG2.
45 • The minimum level for larger text such as headlines, and large text that should be readably fluently. "Sort of" like the old 3:1 in WCAG2.
30 • The absolute minimum for any text, including text for spot reading. Large non-text content can be below this however.
15 • The absolute minimum for any non-text that needs to be discernible such as buttons, but does not include fine details. Designers should treat anything below this level as invisible, as it will not be visible for many users.
 */
export const apcaLevelThresholds = [90, 75, 60, 45, 30];

/**
 * @param {Number} lc contrast between 2 colors from APCA contrast function
 * @returns {Number} APCA compliance level, 0-5 (5 is best, 0 is failing)
 */
export function apcaLevel(lc) {
  const index = apcaLevelThresholds.findIndex((minLc) => Math.abs(lc) > minLc);
  const level = index > -1 ? apcaLevelThresholds.length - index : 0;
  return level;
}
