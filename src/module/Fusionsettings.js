

export class FusionSettings {
  constructor(w, x, y, z) {
    this.gain = w;
    this.accelerationRejection = x;
    this.magneticRejection = y;
    this.rejectionTimeout = z;
  }
}
