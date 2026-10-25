/** Converts a price string such as "$29.99" or "Item total: $29.99" to a number. */
export function parsePrice(text: string): number {
  const match = text.match(/\$?(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`Could not parse a price from "${text}"`);
  return Number(match[1]);
}

/** Rounds a number to two decimal places (currency). */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Product name -> data-test slug used by SauceDemo buttons, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack". */
export function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
