import times from 'lodash/times'

export default times(88).map(note => Math.pow(2, (note - 49) / 12) * 440);

