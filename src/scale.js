
const logs = {
  2: Math.log2,
  10: Math.log10,
  e: Math.log,
};
export function log(base) {
  const func = logs[base];
  if (func) {
    return func;
  }

  return x => _log(base, x);
}

function _log(base, x) {
  return Math.log(x) / Math.log(base);
}

export function exp(base, [floor, ceiling]) {
  const factor = log(base)(ceiling - floor + 1);
  return x => Math.pow(base, x * factor) + floor - 1;
}

