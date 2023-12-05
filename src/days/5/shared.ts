export function getLocationForSeed(location: number, conversionMaps: Map<string, readonly ConversionMap[]>) {
  let current = location;
  for (const maps of conversionMaps.values()) {
    current = getNextNumber(current, maps);
  }

  return current;
}

export type ConversionMap = {
  destRangeStart: number;
  srcRangeStart: number;
  rangeLength: number;
};

function getNextNumber(num: number, mapList: readonly ConversionMap[]): number {
  for (const map of mapList) {
    const isInRange = num >= map.srcRangeStart && num <= map.srcRangeStart + (map.rangeLength - 1);
    if (!isInRange) {
      continue;
    }

    const offset = num - map.srcRangeStart;

    return map.destRangeStart + offset;
  }

  return num;
}
