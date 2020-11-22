export const roundTo2DecimalCases = num => Math.round((num + Number.EPSILON) * 100) / 100;
