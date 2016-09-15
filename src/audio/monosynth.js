import notes from 'src/audio/notes';


const attack = 0.01;
const decay = 0.1;
const sustain = 0.6;
const release = 0.5;

const loudRange = 1 - sustain;

const defaultOptions = {
  destination: null,
  frequency: notes[8],
};

export function create(context, options = defaultOptions) {
  const {currentTime} = context;

  const osc = context.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = options.frequency;
  osc.start(currentTime);

  const gain = context.createGain();
  osc.connect(gain);

  const highPass = context.createBiquadFilter();
  highPass.frequency.value = 0;
  highPass.type = 'highpass';
  highPass.gain.value = 0.2;
  highPass.Q.value = 700;
  gain.connect(highPass);

  const highPassMod = context.createGain();
  highPassMod.gain.value = 100;
  highPassMod.connect(highPass.frequency);

  const lowPass = context.createBiquadFilter();
  lowPass.frequency.value = 0;
  lowPass.type = 'lowpass';
  lowPass.Q.value = 500;
  highPass.connect(lowPass);

  const lowPassMod = context.createGain();
  lowPassMod.gain.value = 100000;
  lowPassMod.connect(lowPass.frequency);

  // maybe shouldnt be a default option
  gain.connect(highPassMod);
  gain.connect(lowPassMod);

  if (options.destination) {
    lowPass.connect(options.destination);
  }

  return {
    context,
    osc,
    gain,
    highPass,
    lowPass,
    highPassMod,
    lowPassMod,

    connect(...args) {
      lowPass.connect(...args);
    },

    disconnect(...args) {
      lowPass.disconnect(...args);
    },
  };
}

export function destroy(synth) {
  const {gain, osc, context} = synth;
  const {currentTime} = context;

  gain.gain.cancelScheduledValues(currentTime);
  osc.stop(currentTime);
  synth.disconnect();
}

export function down(synth, velocity, frequency = null) {
  const {gain, context} = synth;
  const {currentTime} = context;

  gain.gain.cancelScheduledValues(currentTime);

  let time = currentTime + attack;
  gain.gain.exponentialRampToValueAtTime(1, time);

  time = time + decay;
  gain.gain.exponentialRampToValueAtTime(sustain + velocity * loudRange, time);

  return time;
}

export function adjust(synth, velocity, frequency = null) {
  const {gain, osc, context} = synth;
  const {currentTime} = context;

  let time = currentTime + 0.01;

  gain.gain.cancelScheduledValues(currentTime);
  gain.gain.exponentialRampToValueAtTime(sustain + velocity * loudRange, time);

  if (frequency !== null) {
    osc.frequency.cancelScheduledValues(currentTime);
    osc.frequency.linearRampToValueAtTime(frequency, time);
  }
}

export function up(synth, startTime) {
  const {gain, context} = synth;
  const {currentTime} = context;

  let time = startTime || currentTime;

  if (!startTime) {
    gain.gain.cancelScheduledValues(time);
  }

  time = time + release;
  gain.gain.linearRampToValueAtTime(0, time);

  return time;
}

