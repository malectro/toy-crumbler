
export function linearAdjust(param, newValue, currentTime, glide = 0.01) {
  param.cancelScheduledValues(currentTime);
  param.linearRampToValueAtTime(newValue, currentTime + glide);
}

export function exponentialAdjust(param, newValue, currentTime, glide = 0.01) {
  param.cancelScheduledValues(currentTime);
  param.exponentialRampToValueAtTime(newValue, currentTime + glide);
}

