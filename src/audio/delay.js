import {createBlend} from './blend';

export function createDelay(ctx) {
  const blend = createBlend(ctx);
  const delay = ctx.createDelay(5.0);
  const feedback = ctx.createGain();

  feedback.gain.value = 0;

  blend.channel1.connect(delay);
  feedback.connect(delay);
  delay.connect(feedback);

  return {
    connect(node) {
      delay.connect(node);
      blend.channel2.connect(node);
    },

    receive(node) {
      node.connect(blend.channel1);
      node.connect(blend.channel2);
    },

    delayTime: delay.delayTime,
    feedback: feedback.gain,
    blend,
  };
}

