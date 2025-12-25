export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

export function calculateMode(values: number[]): number {
  if (values.length === 0) return 0;

  const frequency = new Map<number, number>();
  let maxFreq = 0;
  let mode = values[0];

  for (const val of values) {
    const freq = (frequency.get(val) || 0) + 1;
    frequency.set(val, freq);

    if (freq > maxFreq) {
      maxFreq = freq;
      mode = val;
    }
  }

  return mode;
}
