

import {FusionVector} from './FusionVector';
export class FusionOffset {
  constructor(sampleRate) {
    this.filterCoefficient = 2.0 * Math.PI * 0.02 * (5 / sampleRate);
    this.timeout = 5 * sampleRate;
    this.timer = 0;
    this.gyroscopeOffset = new FusionVector(0, 0, 0);
  }

  FusionOffsetUpdate( gyroscope, threshold) {
    gyroscope = new FusionVector(
      gyroscope.x - this.gyroscopeOffset.x,
      gyroscope.y - this.gyroscopeOffset.y,
      gyroscope.z - this.gyroscopeOffset.z
    );

    if (
      Math.abs(gyroscope.x) > threshold ||
      Math.abs(gyroscope.y) > threshold ||
      Math.abs(gyroscope.z) > threshold
    ) {
      this.timer = 0;
      return gyroscope;
    }

    // Increment timer while gyroscope stationary
    if (this.timer < this.timeout) {
      this.timer += 1;
      return gyroscope;
    }

    // Adjust offset if timer has elapsed
    this.gyroscopeOffset = this.gyroscopeOffset.FusionVectorAdd(
      this.gyroscopeOffset,
      gyroscope.FusionVectorMultiplyScalar(this.filterCoefficient)
    );

    return gyroscope;
  }
}

