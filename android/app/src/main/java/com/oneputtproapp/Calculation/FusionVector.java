package com.oneputtproapp.Calculation;

import java.util.HashMap;
import java.util.Map;

public class FusionVector {
    public double x;
    public double y;
    public double z;

    public FusionVector(double x, double y, double z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;

    }

    public FusionVector FusionVectorCrossProduct(FusionVector vectorA, FusionVector vectorB) {
        FusionVector result = new FusionVector(x = (vectorA.y * vectorB.z) - (vectorA.z * vectorB.y),
                y = (vectorA.z * vectorB.x) - (vectorA.x * vectorB.z),
                z = (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x));
        return result;
    }

    public FusionVector FusionVectorAdd(FusionVector vectorA, FusionVector vectorB) {
        FusionVector result = new FusionVector(vectorA.x + vectorB.x, vectorA.y + vectorB.y, vectorA.z + vectorB.z);
        return result;
    }

    public FusionVector multiplyScalar(FusionVector vector, double scalar) {
        FusionVector result = new FusionVector(vector.x * scalar, vector.y * scalar, vector.z * scalar);
        return result;
    }

    public boolean FusionVectorIsZero(FusionVector vector) {
        return (vector.x == 0.0) && (vector.y == 0.0) && (vector.z == 0.0);
    }

    public FusionVector FusionVectorHadamardProduct(FusionVector vectorA, FusionVector vectorB) {
        FusionVector result = new FusionVector(vectorA.x * vectorB.x, vectorA.y * vectorB.y, vectorA.z * vectorB.z);
        return result;
    }

    public double FusionVectorMagnitudeSquared(FusionVector vector) {
        FusionVector hadamardProduct = FusionVectorHadamardProduct(vector, vector);
        return FusionVectorSum(hadamardProduct);
    }

    public double FusionVectorSum(FusionVector hadamardProduct) {
        return hadamardProduct.x + hadamardProduct.y + hadamardProduct.z;
    }

    public double FusionDegreesToRadians(double degrees) {
        return degrees * (Math.PI / 180);

    }

    public double FusionRadiansToDegrees(double radians) {
        return radians * (180 / Math.PI);

    }

    public FusionVector FusionVectorMultiplyScalar(FusionVector vector, double scalar) {
        FusionVector result = new FusionVector(x = vector.x * scalar, y = vector.y * scalar, z = vector.z * scalar);
        return result;

    }

    public double FusionFastInverseSqrt(double d) {
        int i = Float.floatToIntBits((float) d);
        i = 0x5F1F1412 - (i >> 1);
        float f = Float.intBitsToFloat(i);

        return f * (1.69000231 - 0.714158168 * d * f * f);
    }

    public FusionVector FusionVectorNormalise(FusionVector vector) {
        double magnitudeReciprocal = FusionFastInverseSqrt(FusionVectorMagnitudeSquared(vector));
        vector = FusionVectorMultiplyScalar(vector, magnitudeReciprocal);
        return vector;
    }

}

class FusionOffset {

    private double filterCoefficient;
    private double timeout;
    private int timer;
    private FusionVector gyroscopeOffset;

    public FusionOffset(double sample_rate) {
        this.filterCoefficient = 2.0 * Math.PI * 0.02 * (5 / sample_rate);
        this.timeout = 5 * sample_rate;
        this.timer = 0;
        this.gyroscopeOffset = new FusionVector(0, 0, 0);
    }

    public FusionVector FusionOffsetUpdate(FusionVector gyroscope, double threshold) {
        gyroscope = new FusionVector(gyroscope.x - this.gyroscopeOffset.x, gyroscope.y - this.gyroscopeOffset.y,
                gyroscope.z - this.gyroscopeOffset.z);

        if ((Math.abs(gyroscope.x) > threshold) || (Math.abs(gyroscope.y) > threshold)
                || (Math.abs(gyroscope.z) > threshold)) {

            this.timer = 0;

            return gyroscope;

        }

        // Increment timer while gyroscope stationary
        if (this.timer < this.timeout) {

            this.timer += 1;

            return gyroscope;

        }

//	        // Adjust offset if timer has elapsed
        this.gyroscopeOffset = gyroscope.FusionVectorAdd(this.gyroscopeOffset,
                gyroscope.multiplyScalar(gyroscope, this.filterCoefficient));

        return gyroscope;
    }
}

class Fusionsettings {

    public double gain;
    public double accelerationRejection;
    public double magneticRejection;
    public double rejectionTimeout;

    public Fusionsettings(double w, double x, double y, double z) {
        this.gain = w;
        this.accelerationRejection = x;
        this.magneticRejection = y;
        this.rejectionTimeout = z;
    }
}

class FusionAhrs {
    public Fusionsettings settings;
    public Boolean initialising;
    int INITIALISATION_PERIOD = 3;
    int INITIAL_GAIN = 10;
    FusionVector FUSION_VECTOR_ZERO = new FusionVector(0, 0, 0);
    FusionQuaternion FUSION_IDENTITY_QUATERNION = new FusionQuaternion(1.0, 0.0, 0.0, 0.0);

    private int magneticRejectionTimer;
    private boolean magneticRejectionTimeout;
    private boolean magnetometerIgnored;
    private boolean accelerationRejectionTimeout;
    private int accelerationRejectionTimer;
    private boolean accelerometerIgnored;
    private FusionVector halfMagnetometerFeedback;
    private FusionVector halfAccelerometerFeedback;
    private FusionVector accelerometer;
    private FusionQuaternion quaternion;
    private double accelerationRejection;
    private double magneticRejection;
    private double rejectionTimeout;
    private int gain;
    private double rampedGainStep;
    private double rampedGain;
    FusionQuaternion FusionQuaternionObj = new FusionQuaternion(accelerationRejection, accelerationRejection,
            accelerationRejection, accelerationRejection);

    public FusionAhrs(double w, double x, double y, double z) {
        this.settings = new Fusionsettings(w, x, y, z);
        this.initialising = false;
        this.FusionAhrsSetSettings(settings);
        this.FusionAhrsReset();
    }

    public double convert360(double degrees) {
        if (degrees < 0) {
            return degrees + 360;
        } else {
            return degrees;
        }
    }

    public double FusionDegreesToRadians(double degrees) {
        return degrees * (Math.PI / 180);

    }

    public void FusionAhrsSetSettings(Fusionsettings settings) {

        if ((settings.accelerationRejection == 0.0) || (settings.rejectionTimeout == 0)) {
            this.accelerationRejection = Double.POSITIVE_INFINITY;
        } else {
            this.accelerationRejection = Math
                    .pow(0.5 * Math.sin(FusionDegreesToRadians(settings.accelerationRejection)), 2);
        }
        if ((settings.magneticRejection == 0.0) || (settings.rejectionTimeout == 0)) {
            this.magneticRejection = Double.POSITIVE_INFINITY;
        } else {
            this.magneticRejection = Math.pow(0.5 * Math.sin(FusionDegreesToRadians(settings.magneticRejection)), 2);
            this.rejectionTimeout = settings.rejectionTimeout;
        }
        if (this.initialising == false) {
            rampedGain = settings.gain;

        }

        this.rampedGainStep = ((INITIAL_GAIN - settings.gain) / INITIALISATION_PERIOD);
    }

    public void FusionAhrsReset() {
        quaternion = FUSION_IDENTITY_QUATERNION;
        accelerometer = FUSION_VECTOR_ZERO;
        initialising = true;
        rampedGain = INITIAL_GAIN;
        halfAccelerometerFeedback = FUSION_VECTOR_ZERO;
        halfMagnetometerFeedback = FUSION_VECTOR_ZERO;
        accelerometerIgnored = false;
        accelerationRejectionTimer = 0;
        accelerationRejectionTimeout = false;
        magnetometerIgnored = false;
        magneticRejectionTimer = 0;
        magneticRejectionTimeout = false;

    }

    public void FusionAhrsUpdateNoMagnetometer(FusionVector gyroscope, FusionVector accelerometer, double deltaTime) {

        FusionAhrsUpdate(gyroscope, accelerometer, FUSION_VECTOR_ZERO, deltaTime);
        boolean accelerationREjectionTimeout = false;
        if (initialising && !accelerationREjectionTimeout) {
            FusionAhrsSetHeading(0.0f);
        }

    }

    private void FusionAhrsUpdate(FusionVector gyroscope, FusionVector accelerometer, FusionVector magnetometer,
                                  double deltaTime) {

//        # Store accelerometer
        FusionQuaternion Q = this.quaternion;

        this.accelerometer = accelerometer;
//        # Ramp down gain during initialisation
        if (initialising == true) {
            this.rampedGain -= this.rampedGainStep * deltaTime;
//			System.out.println(rampedGain);
        }
        if (rampedGain < settings.gain) {
            rampedGain = settings.gain;
            initialising = false;
            accelerationRejectionTimeout = false;
//			}
        }
        FusionVector halfGravity = new FusionVector(0.0, 0.0, 0.0);

//        # Calculate direction of gravity indicated by algorithm
        halfGravity.x = Q.x * Q.z - Q.w * Q.y;
        halfGravity.y = Q.y * Q.z + Q.w * Q.x;
        halfGravity.z = Q.w * Q.w - 0.5 + Q.z * Q.z;

//		  # Calculate accelerometer feedback
        FusionVector FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);
        halfAccelerometerFeedback = FusionVectorObj;
        accelerometerIgnored = true;
//         # Enter acceleration recovery state if acceleration rejection times out
        if (FusionVectorObj.FusionVectorIsZero(accelerometer) == false) {
            if (accelerationRejectionTimer > settings.rejectionTimeout) {

                quaternion = this.quaternion;
                FusionAhrsReset();
                this.quaternion = quaternion;
                accelerationRejectionTimer = 0;
                accelerationRejectionTimeout = true;
            }
        }
//		 # Calculate accelerometer feedback scaled by 0.5

        halfAccelerometerFeedback = FusionVectorObj
                .FusionVectorCrossProduct(FusionVectorObj.FusionVectorNormalise(accelerometer), halfGravity);

//        # Ignore accelerometer if acceleration distortion detected
        if ((initialising == true) || (FusionVectorObj
                .FusionVectorMagnitudeSquared(halfAccelerometerFeedback) < settings.accelerationRejection)) {

            halfAccelerometerFeedback = halfAccelerometerFeedback;
            accelerometerIgnored = false;
            if (accelerationRejectionTimer >= 10) {
                accelerationRejectionTimer -= 10;
            } else {
                accelerationRejectionTimer -= 0;
            }

        } else {

            accelerationRejectionTimer += 1;
        }
        halfMagnetometerFeedback = new FusionVector(0, 0, 0);
        magnetometerIgnored = true;

        if (!FusionVectorObj.FusionVectorIsZero(magnetometer)) {
//    # Set to compass heading if magnetic rejection times out
            magneticRejectionTimeout = false;
        }
        if (magneticRejectionTimer > settings.rejectionTimeout) {
            FusionAhrsSetHeading(FusionCompassCalculateHeading(halfGravity, magnetometer));
            magneticRejectionTimer = 0;
            magneticRejectionTimeout = true;
        }
//		 # Compute direction of west indicated by algorithm
        FusionVector halfWest = new FusionVector(0.0, 0.0, 0.0);
        halfWest.x = Q.x * Q.y + Q.w * Q.z;
        halfWest.y = Q.w * Q.w - 0.5 + Q.y * Q.y;
        halfWest.z = Q.y * Q.z - Q.w * Q.x;

        halfMagnetometerFeedback = FusionVectorObj.FusionVectorCrossProduct(FusionVectorObj
                .FusionVectorNormalise(FusionVectorObj.FusionVectorCrossProduct(halfGravity, magnetometer)), halfWest);
//	        # Ignore magnetometer if magnetic distortion detected
//
        if (initialising || FusionVectorObj
                .FusionVectorMagnitudeSquared(halfMagnetometerFeedback) < settings.magneticRejection) {

            halfMagnetometerFeedback = halfMagnetometerFeedback;
            magnetometerIgnored = false;

            if (magneticRejectionTimer >= 10) {
                magneticRejectionTimer -= 10;
            } else {
                magneticRejectionTimer -= 0;
            }
        } else {
            magneticRejectionTimer += 1;
        }

//	        # Convert gyroscope to radians per second scaled by 0.5
        FusionVector halfGyroscope = FusionVectorObj.FusionVectorMultiplyScalar(gyroscope, FusionDegreesToRadians(0.5));

//	        # Apply feedback to gyroscope
        FusionVector adjustedHalfGyroscope = FusionVectorObj.FusionVectorAdd(halfGyroscope,
                FusionVectorObj.FusionVectorMultiplyScalar(
                        FusionVectorObj.FusionVectorAdd(halfAccelerometerFeedback, halfMagnetometerFeedback),
                        rampedGain));

//	        # Integrate rate of change of quaternion
        this.quaternion = FusionQuaternionObj.FusionQuaternionAdd(this.quaternion,
                FusionQuaternionObj.FusionQuaternionMultiplyVector(this.quaternion,
                        FusionVectorObj.FusionVectorMultiplyScalar(adjustedHalfGyroscope, deltaTime)));
        FusionVector test = FusionVectorObj.FusionVectorMultiplyScalar(adjustedHalfGyroscope, deltaTime);

//	        # Normalise quaternion
        this.quaternion = FusionQuaternionNormalise(this.quaternion);

    }

    public FusionQuaternion FusionQuaternionNormalise(FusionQuaternion quaternion) {
        FusionVector FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

        FusionQuaternion q = quaternion;
        double magnitude_reciprocal = FusionVectorObj
                .FusionFastInverseSqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);

        FusionQuaternion result = new FusionQuaternion(q.w * magnitude_reciprocal, q.x * magnitude_reciprocal,
                q.y * magnitude_reciprocal, q.z * magnitude_reciprocal);

        return result;
    }

    private double FusionCompassCalculateHeading(FusionVector accelerometer, FusionVector magnetometer) {
        FusionVector FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);
//		 # Compute direction of magnetic west (Earth's y axis)
        FusionVector magnetic_west = FusionVectorObj
                .FusionVectorNormalise(FusionVectorObj.FusionVectorCrossProduct(accelerometer, magnetometer));
//			     # Compute direction of magnetic north (Earth's x axis)
        FusionVector magnetic_north = FusionVectorObj
                .FusionVectorNormalise(FusionVectorObj.FusionVectorCrossProduct(magnetic_west, accelerometer));
//					        		# Calculate angular heading relative to magnetic north
        double heading = Math.atan2(magnetic_west.x, magnetic_north.x);
        double heading_degrees = FusionDegreesToRadians(heading);

        return heading_degrees;

    }

    private void FusionAhrsSetHeading(double d) {
        int heading = 0;
        FusionQuaternion Q = FUSION_IDENTITY_QUATERNION;
        double yaw = Math.atan2(Q.w * Q.z + Q.x * Q.y, 0.5 - Q.y * Q.y - Q.z * Q.z);
        double halfYawMinusHeading = 0.5 * (yaw - FusionDegreesToRadians(heading));
        FusionQuaternion rotation = new FusionQuaternion(Math.cos(halfYawMinusHeading), 0.0, 0.0,
                -1.0 * Math.sin(halfYawMinusHeading));
    }

    public FusionVector FusionGetEarthAcceleration() {

        FusionQuaternion Q = this.quaternion;

        FusionVector A = accelerometer;
        double qwqw = Q.w * Q.w;
        double qwqx = Q.w * Q.x;
        double qwqy = Q.w * Q.y;
        double qwqz = Q.w * Q.z;
        double qxqy = Q.x * Q.y;
        double qxqz = Q.x * Q.z;
        double qyqz = Q.y * Q.z;
        return new FusionVector(2.0 * ((qwqw - 0.5 + Q.x * Q.x) * A.x + (qxqy - qwqz) * A.y + (qxqz + qwqy) * A.z),
                2.0 * ((qxqy + qwqz) * A.x + (qwqw - 0.5 + Q.y * Q.y) * A.y + (qyqz - qwqx) * A.z),
                2.0 * ((qxqz - qwqy) * A.x + (qyqz + qwqx) * A.y + (qwqw - 0.5 + Q.z * Q.z) * A.z) - 1.0);
    }

    public Map QuaternionToEuler() {

        FusionVector FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

        double halfMinusQySquared = 0.5 - quaternion.y * quaternion.y;

        double roll = (FusionVectorObj
                .FusionRadiansToDegrees(Math.atan2((quaternion.w * quaternion.x) + (quaternion.y * quaternion.z),
                        halfMinusQySquared - (quaternion.x * quaternion.x))));
        double test = (Math.atan2((quaternion.w * quaternion.x) + (quaternion.y * quaternion.z),
                halfMinusQySquared - (quaternion.x * quaternion.x)));
//		System.out.println(test);
        double pitch = (FusionVectorObj.FusionRadiansToDegrees(
                Math.asin(2.0 * ((quaternion.w * quaternion.y) - (quaternion.z * quaternion.x)))));
        double yaw = (FusionVectorObj
                .FusionRadiansToDegrees(Math.atan2((quaternion.w * quaternion.z) + (quaternion.x * quaternion.y),
                        halfMinusQySquared - (quaternion.z * quaternion.z))));


        Map<String, Double> multiValues = new HashMap<String, Double>();
        multiValues.put("roll", roll);
        multiValues.put("pitch", pitch);
        multiValues.put("yaw", yaw);
        return multiValues;
    }
}

class FusionQuaternion {
    public double w;
    public double x;
    public double y;
    public double z;

    public FusionQuaternion(double w, double x, double y, double z) {

        super();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;

    }

    public FusionQuaternion FusionQuaternionAdd(FusionQuaternion quaternionA, FusionQuaternion quaternionB) {
        FusionQuaternion result = new FusionQuaternion(quaternionA.w + quaternionB.w, quaternionA.x + quaternionB.x,
                quaternionA.y + quaternionB.y, quaternionA.z + quaternionB.z);

        return result;
    }

    public FusionQuaternion FusionQuaternionMultiplyVector(FusionQuaternion quaternion, FusionVector vector) {

        FusionQuaternion q = quaternion;
        FusionVector v = vector;
        FusionQuaternion result = new FusionQuaternion((-q.x * v.x) - (q.y * v.y) - (q.z * v.z),
                (q.w * v.x) + (q.y * v.z) - (q.z * v.y), (q.w * v.y) - (q.x * v.z) + (q.z * v.x),
                (q.w * v.z) + (q.x * v.y) - (q.y * v.x));

        return result;
    }

    FusionVector FusionVectorObj = new FusionVector(0.0, 0.0, 0.0);

    public FusionQuaternion FusionQuaternionMultiply(FusionQuaternion quaternionA, FusionQuaternion quaternionB) {
        FusionQuaternion result = new FusionQuaternion(
                (quaternionA.w * quaternionB.w) - (quaternionA.x * quaternionB.x) - (quaternionA.y * quaternionB.y)
                        - (quaternionA.z * quaternionB.z),
                (quaternionA.w * quaternionB.x) + (quaternionA.x * quaternionB.w) + (quaternionA.y * quaternionB.z)
                        - (quaternionA.z * quaternionB.y),
                (quaternionA.w * quaternionB.y) - (quaternionA.x * quaternionB.z) + (quaternionA.y * quaternionB.w)
                        + (quaternionA.z * quaternionB.x),
                (quaternionA.w * quaternionB.z) + (quaternionA.x * quaternionB.y) - (quaternionA.y * quaternionB.x)
                        + (quaternionA.z * quaternionB.w));
        return result;
    }

}