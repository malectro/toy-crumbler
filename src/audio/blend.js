export function createBlend(ctx) {

  const channel1 = ctx.createGain();
  const channel2 = ctx.createGain();

  return {
    channel1,
    channel2,

    set value(newValue) {
      channel1.gain.value = newValue;
      channel2.gain.value = 1 - newValue;
    },

    get value() {
      return channel1.gain.value;
    },
  };
}

