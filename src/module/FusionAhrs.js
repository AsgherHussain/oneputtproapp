
import {FusionQuaternion} from './FusionQuaternion';
import {FusionVector} from './FusionVector';
import { FusionSettings } from './Fusionsettings';
export class FusionAhrs {
  constructor(w, x, y, z) {
    this.settings = new FusionSettings(w, x, y, z);
    this.initialising = false;
    this.INITIALISATION_PERIOD = 3;
    this.INITIAL_GAIN = 10;
    this.FUSION_VECTOR_ZERO = new FusionVector(0.0, 0.0, 0.0);
    this.FUSION_IDENTITY_QUATERNION = new FusionQuaternion(1.0, 0.0, 0.0, 0.0);

    this.magneticRejectionTimer = 0;
    this.magneticRejectionTimeout = false;
    this.magnetometerIgnored = false;
    this.accelerationRejectionTimeout = false;
    this.accelerationRejectionTimer = 0;
    this.accelerometerIgnored = false;
    this.halfMagnetometerFeedback = new FusionVector(0, 0, 0);
    this.halfAccelerometerFeedback = new FusionVector(0, 0, 0);
    this.accelerometer = new FusionVector(0, 0, 0);
    this.quaternion = new FusionQuaternion(1.0, 0.0, 0.0, 0.0);
    this.accelerationRejection = 0;
    this.magneticRejection = 0;
    this.rejectionTimeout = 0;
    this.gain = 0;
    this.rampedGainStep = 0;
    this.rampedGain = 0;
    this.FusionQuaternionObj = new FusionQuaternion(
      this.accelerationRejection,
      this.accelerationRejection,
      this.accelerationRejection,
      this.accelerationRejection
    );
    this.FusionAhrsSetSettings(this.settings);
    this.FusionAhrsReset();
  }

  convert360(degrees) {
    if (degrees < 0) {
      return degrees + 360;
    } else {
      return degrees;
    }
  }

  FusionDegreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  FusionAhrsSetSettings(settings) {
    if (
      settings.accelerationRejection == 0.0 ||
      settings.rejectionTimeout == 0
    ) {
      this.accelerationRejection = Infinity;
    } else {
      this.accelerationRejection = Math.pow(
        0.5 *
          Math.sin(this.FusionDegreesToRadians(settings.accelerationRejection)),
        2,
      );
    }

    if (settings.magneticRejection == 0.0 || settings.rejectionTimeout == 0) {
      this.magneticRejection = Infinity;
    } else {
      this.magneticRejection = Math.pow(
        0.5 * Math.sin(this.FusionDegreesToRadians(settings.magneticRejection)),
        2,
      );
      this.rejectionTimeout = settings.rejectionTimeout;
    }

    if (!this.initialising) {
      this.rampedGain = settings.gain;
    }

    this.rampedGainStep =
      (this.INITIAL_GAIN - settings.gain) / this.INITIALISATION_PERIOD;
  }
  FusionAhrsReset() {
    this.quaternion = new FusionQuaternion(1.0, 0.0, 0.0, 0.0);
    this.accelerometer = new FusionVector(0, 0, 0);
    this.initialising = true;
    this.rampedGain = this.INITIAL_GAIN;
    this.halfAccelerometerFeedback = new FusionVector(0, 0, 0);
    this.halfMagnetometerFeedback = new FusionVector(0, 0, 0);
    this.accelerometerIgnored = false;
    this.accelerationRejectionTimer = 0;
    this.accelerationRejectionTimeout = false;
    this.magnetometerIgnored = false;
    this.magneticRejectionTimer = 0;
    this.magneticRejectionTimeout = false;
  }

  FusionAhrsUpdateNoMagnetometer(gyroscope, accelerometer, deltaTime) {
    this.FusionAhrsUpdate(
      gyroscope,
      accelerometer,
      this.FUSION_VECTOR_ZERO,
      deltaTime,
    );
    let accelerationRejectionTimeout = false;
    if (this.initialising && !accelerationRejectionTimeout) {
      this.FusionAhrsSetHeading(0.0);
    }
  }
  FusionAhrsUpdate(gyroscope, accelerometer, magnetometer, deltaTime) {
    let Q = this.quaternion;

    this.accelerometer = accelerometer;

    if (this.initialising === true) {
      this.rampedGain -= this.rampedGainStep * deltaTime;
    }

    if (this.rampedGain < this.settings.gain) {
      this.rampedGain = this.settings.gain;
      this.initialising = false;
      this.accelerationRejectionTimeout = false;
    }

    let halfGravity = new FusionVector(0.0, 0.0, 0.0);
    halfGravity.x = Q.x * Q.z - Q.w * Q.y;
    halfGravity.y = Q.y * Q.z + Q.w * Q.x;
    halfGravity.z = Q.w * Q.w - 0.5 + Q.z * Q.z;

    let FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);
     this.halfAccelerometerFeedback = FusionVectorObj.FusionVectorCrossProduct(
      FusionVectorObj.FusionVectorNormalise(accelerometer),
      halfGravity,
    );
    let accelerationRejectionTimer = 0;

    if (!FusionVectorObj.FusionVectorIsZero(accelerometer)) {
      if (accelerationRejectionTimer > this.settings.rejectionTimeout) {
        let quaternion = this.quaternion;
        this.FusionAhrsReset();
        this.quaternion = quaternion;
        accelerationRejectionTimer = 0;
        this.accelerationRejectionTimeout = true;
      }
    }

    // Calculate accelerometer feedback scaled by 0.5


// Ignore accelerometer if acceleration distortion detected
    if (this.initialising || FusionVectorObj.FusionVectorMagnitudeSquared(this.halfAccelerometerFeedback) < settings.accelerationRejection) {
      thishalfAccelerometerFeedback = this.halfAccelerometerFeedback;
      accelerometerIgnored = false;
      if (accelerationRejectionTimer >= 10) {
        accelerationRejectionTimer -= 10;
      } else {
        accelerationRejectionTimer -= 0;
      }
    } else {
      accelerationRejectionTimer += 1;
    }

        // Convert gyroscope to radians per second scaled by 0.5
        let halfGyroscope = FusionVectorObj.FusionVectorMultiplyScalar(gyroscope, this.FusionDegreesToRadians(0.5));

        // Apply feedback to gyroscope
        let adjustedHalfGyroscope = FusionVectorObj.FusionVectorAdd(halfGyroscope,
        FusionVectorObj.FusionVectorMultiplyScalar(
          FusionVectorObj.FusionVectorAdd(this.halfAccelerometerFeedback, this.halfMagnetometerFeedback),
          this.rampedGain
        )
        );

        // Integrate rate of change of quaternion
        this.quaternion = this.FusionQuaternionObj.FusionQuaternionAdd(this.quaternion,
        this.FusionQuaternionObj.FusionQuaternionMultiplyVector(this.quaternion,
          FusionVectorObj.FusionVectorMultiplyScalar(adjustedHalfGyroscope, deltaTime)
        )
        );
        let test = FusionVectorObj.FusionVectorMultiplyScalar(adjustedHalfGyroscope, deltaTime);

        //Normalise quaternion
        this.quaternion = this.FusionQuaternionNormalise(this.quaternion);
  }

  FusionQuaternionNormalise(quaternion) {
    let FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

    let q = quaternion;
    let magnitude_reciprocal = FusionVectorObj.FusionFastInverseSqrt(
      q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z,
    );

    let result = new FusionQuaternion(
      q.w * magnitude_reciprocal,
      q.x * magnitude_reciprocal,
      q.y * magnitude_reciprocal,
      q.z * magnitude_reciprocal,
    );

    return result;
  }

  FusionCompassCalculateHeading(accelerometer, magnetometer) {
    let FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

    let magnetic_west = FusionVectorObj.FusionVectorNormalise(
      FusionVectorObj.FusionVectorCrossProduct(accelerometer, magnetometer),
    );
    let magnetic_north = FusionVectorObj.FusionVectorNormalise(
      FusionVectorObj.FusionVectorCrossProduct(magnetic_west, accelerometer),
    );
    let heading = Math.atan2(magnetic_west.x, magnetic_north.x);
    let heading_degrees = this.FusionDegreesToRadians(heading);

    return heading_degrees;
  }

  FusionAhrsSetHeading(d) {
    let heading = 0;
    let Q = this.FUSION_IDENTITY_QUATERNION;
    let yaw = Math.atan2(Q.w * Q.z + Q.x * Q.y, 0.5 - Q.y * Q.y - Q.z * Q.z);
    let halfYawMinusHeading = 0.5 * (yaw - this.FusionDegreesToRadians(heading));
    let rotation = new FusionQuaternion(
      Math.cos(halfYawMinusHeading),
      0.0,
      0.0,
      -1.0 * Math.sin(halfYawMinusHeading),
    );
  }

  FusionGetEarthAcceleration() {
    let Q = this.quaternion;
    let A = this.accelerometer;
    let qwqw = Q.w * Q.w;
    let qwqx = Q.w * Q.x;
    let qwqy = Q.w * Q.y;
    let qwqz = Q.w * Q.z;
    let qxqy = Q.x * Q.y;
    let qxqz = Q.x * Q.z;
    let qyqz = Q.y * Q.z;
    return new FusionVector(
      2.0 *
        ((qwqw - 0.5 + Q.x * Q.x) * A.x +
          (qxqy - qwqz) * A.y +
          (qxqz + qwqy) * A.z),
      2.0 *
        ((qxqy + qwqz) * A.x +
          (qwqw - 0.5 + Q.y * Q.y) * A.y +
          (qyqz - qwqx) * A.z),
      2.0 *
        ((qxqz - qwqy) * A.x +
          (qyqz + qwqx) * A.y +
          (qwqw - 0.5 + Q.z * Q.z) * A.z) -
        1.0,
    );
  }

  QuaternionToEuler() {
    let FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

    let halfMinusQySquared = 0.5 - this.quaternion.y * this.quaternion.y;

    let roll = FusionVectorObj.FusionRadiansToDegrees(
      Math.atan2(
        this.quaternion.w * this.quaternion.x + this.quaternion.y * this.quaternion.z,
        halfMinusQySquared - this.quaternion.x * this.quaternion.x,
      ),
    );
    let test = Math.atan2(
      this.quaternion.w * this.quaternion.x + this.quaternion.y * this.quaternion.z,
      halfMinusQySquared - this.quaternion.x * this.quaternion.x,
    );
    let pitch = FusionVectorObj.FusionRadiansToDegrees(
      Math.asin(
        2.0 * (this.quaternion.w * this.quaternion.y - this.quaternion.z * this.quaternion.x),
      ),
    );
    let yaw = FusionVectorObj.FusionRadiansToDegrees(
      Math.atan2(
        this.quaternion.w * this.quaternion.z + this.quaternion.x * this.quaternion.y,
        halfMinusQySquared - this.quaternion.z * this.quaternion.z,
      ),
    );

    let multiValues = {};
    multiValues['roll'] = roll;
    multiValues['pitch'] = pitch;
    multiValues['yaw'] = yaw;
    return multiValues;
  }
}
