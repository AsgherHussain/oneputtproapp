//
//  FusionVector.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 22/11/23.
//

import Foundation


class FusionVector {
  var x: Double
  var y: Double
  var z: Double
  
  init(x: Double, y: Double, z: Double) {
    self.x = x
    self.y = y
    self.z = z
  }
  
  func crossProduct(vectorA: FusionVector, vectorB: FusionVector) -> FusionVector {
    let result = FusionVector(x: (vectorA.y * vectorB.z) - (vectorA.z * vectorB.y),
                              y: (vectorA.z * vectorB.x) - (vectorA.x * vectorB.z),
                              z: (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x))
    return result
  }
  
  func add(vectorA: FusionVector, vectorB: FusionVector) -> FusionVector {
    let result = FusionVector(x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y, z: vectorA.z + vectorB.z)
    return result
  }
  
  func multiplyScalar(vector: FusionVector, scalar: Double) -> FusionVector {
    let result = FusionVector(x: vector.x * scalar, y: vector.y * scalar, z: vector.z * scalar)
    return result
  }
  
  func isZero(vector: FusionVector) -> Bool {
    return (vector.x == 0.0) && (vector.y == 0.0) && (vector.z == 0.0)
  }
  
  func hadamardProduct(vectorA: FusionVector, vectorB: FusionVector) -> FusionVector {
    let result = FusionVector(x: vectorA.x * vectorB.x, y: vectorA.y * vectorB.y, z: vectorA.z * vectorB.z)
    return result
  }
  
  func magnitudeSquared(vector: FusionVector) -> Double {
    let hadamardProduct = hadamardProduct(vectorA: vector, vectorB: vector)
    return sum(vector: hadamardProduct)
  }
  
  func sum(vector: FusionVector) -> Double {
    return vector.x + vector.y + vector.z
  }
  
  func degreesToRadians(degrees: Double) -> Double {
    return degrees * (Double.pi / 180)
  }
  
  func radiansToDegrees(radians: Double) -> Double {
    return radians * (180 / Double.pi)
  }
  
  
  
  
  func fastInverseSqrt(_ d: Double) -> Double {
    var i = withUnsafeBytes(of: Float32(d).bitPattern) { $0.load(as: Int32.self) }
    i = 0x5F1F1412 - (i >> 1)
    var f = withUnsafeMutableBytes(of: &i) { $0.load(as: Float32.self) }
    let frg = d * Double(f) * Double(f)
    return Double(f) * (1.69000231 - 0.714158168 * frg)
  }
  
  
  func normalize(vector: FusionVector) -> FusionVector {
    let magnitudeReciprocal = fastInverseSqrt(magnitudeSquared(vector: vector))
    let normalizedVector = multiplyScalar(vector: vector, scalar: magnitudeReciprocal)
    return normalizedVector
  }
}




class FusionOffset {
  
  private var filterCoefficient: Double
  private var timeout: Double
  private var timer: Int
  private var gyroscopeOffset: FusionVector
  
  init(sampleRate: Double) {
    self.filterCoefficient = 2.0 * Double.pi * 0.02 * (5 / sampleRate)
    self.timeout = 5 * sampleRate
    self.timer = 0
    self.gyroscopeOffset = FusionVector(x: 0, y: 0, z: 0)
  }
  
  func update(gyroscope: FusionVector, threshold: Double) -> FusionVector {
    var gyroscope = FusionVector(x: gyroscope.x - gyroscopeOffset.x,
                                 y: gyroscope.y - gyroscopeOffset.y,
                                 z: gyroscope.z - gyroscopeOffset.z)
    
    if (abs(gyroscope.x) > threshold) || (abs(gyroscope.y) > threshold) || (abs(gyroscope.z) > threshold) {
      timer = 0
      return gyroscope
    }
    
    // Increment timer while gyroscope stationary
    if timer < Int(timeout) {
      timer += 1
      return gyroscope
    }
    
    // Adjust offset if the timer has elapsed
    gyroscopeOffset = gyroscopeOffset.add(vectorA: gyroscopeOffset,
                                          vectorB: gyroscope.multiplyScalar(vector: gyroscope, scalar: filterCoefficient))
    
    return gyroscope
  }
}

class FusionSettings {
  
  var gain: Double
  var accelerationRejection: Double
  var magneticRejection: Double
  var rejectionTimeout: Double
  
  init(w: Double, x: Double, y: Double, z: Double) {
    self.gain = w
    self.accelerationRejection = x
    self.magneticRejection = y
    self.rejectionTimeout = z
  }
}




class FusionAhrs {
  
  var settings: FusionSettings
  var initialising: Bool
  let INITIALISATION_PERIOD = 3
  let INITIAL_GAIN = 10
  let FUSION_VECTOR_ZERO = FusionVector(x: 0, y: 0, z: 0)
  let FUSION_IDENTITY_QUATERNION = FusionQuaternion(w: 1.0, x: 0.0, y: 0.0, z: 0.0)
  
  private var magneticRejectionTimer: Int
  private var magneticRejectionTimeout: Bool
  private var magnetometerIgnored: Bool
  private var accelerationRejectionTimeout: Bool
  private var accelerationRejectionTimer: Int
  private var accelerometerIgnored: Bool
  private var halfMagnetometerFeedback: FusionVector
  private var halfAccelerometerFeedback: FusionVector
  private var accelerometer: FusionVector
  private var quaternion: FusionQuaternion
  private var accelerationRejection: Double
  private var magneticRejection: Double
  private var rejectionTimeout: Double
  private var gain: Int
  private var rampedGainStep: Double
  private var rampedGain: Double
  
  
  
  
  
  init(w: Double, x: Double, y: Double, z: Double) {
    self.settings = FusionSettings(w: w, x: x, y: y, z: z)
    self.initialising = false
    self.magneticRejectionTimer = 0
    self.magneticRejectionTimeout = false
    self.magnetometerIgnored = false
    self.accelerationRejectionTimeout = false
    self.accelerationRejectionTimer = 0
    self.accelerometerIgnored = false
    self.halfMagnetometerFeedback = FusionVector(x: 0, y: 0, z: 0)
    self.halfAccelerometerFeedback = FusionVector(x: 0, y: 0, z: 0)
    self.accelerometer = FusionVector(x: 0, y: 0, z: 0)
    self.quaternion = FusionQuaternion(w: 0, x: 0, y: 0, z: 0)
    self.accelerationRejection = 0.0
    self.magneticRejection = 0.0
    self.rejectionTimeout = 0.0
    self.gain = 0
    self.rampedGainStep = 0.0
    self.rampedGain = 0.0
    self.FusionAhrsSetSettings(settings: settings)
    self.FusionAhrsReset()
  }
  
  func convert360(degrees: Double) -> Double {
    if degrees < 0 {
      return degrees + 360
    } else {
      return degrees
    }
  }
  
  func FusionDegreesToRadians(degrees: Double) -> Double {
    return degrees * (Double.pi / 180)
  }
  
  func FusionAhrsSetSettings(settings: FusionSettings) {
    if (settings.accelerationRejection == 0.0) || (settings.rejectionTimeout == 0) {
      self.accelerationRejection = Double.infinity
    } else {
      self.accelerationRejection = pow(0.5 * sin(FusionDegreesToRadians(degrees: settings.accelerationRejection)), 2)
    }
    
    if (settings.magneticRejection == 0.0) || (settings.rejectionTimeout == 0) {
      self.magneticRejection = Double.infinity
    } else {
      self.magneticRejection = pow(0.5 * sin(FusionDegreesToRadians(degrees: settings.magneticRejection)), 2)
      self.rejectionTimeout = settings.rejectionTimeout
    }
    
    if !self.initialising {
      self.rampedGain = Double(settings.gain)
    }
    
    self.rampedGainStep = (Double(self.INITIAL_GAIN) - Double(settings.gain)) / Double(self.INITIALISATION_PERIOD)
  }
  
  func FusionAhrsReset() {
    self.quaternion = FUSION_IDENTITY_QUATERNION
    self.accelerometer = FUSION_VECTOR_ZERO
    self.initialising = true
    self.rampedGain = Double(self.INITIAL_GAIN)
    self.halfAccelerometerFeedback = FUSION_VECTOR_ZERO
    self.halfMagnetometerFeedback = FUSION_VECTOR_ZERO
    self.accelerometerIgnored = false
    self.accelerationRejectionTimer = 0
    self.accelerationRejectionTimeout = false
    self.magnetometerIgnored = false
    self.magneticRejectionTimer = 0
    self.magneticRejectionTimeout = false
  }
  
  func FusionAhrsUpdateNoMagnetometer(gyroscope: FusionVector, accelerometer: FusionVector, deltaTime: Double) {
    FusionAhrsUpdate(gyroscope: gyroscope, accelerometer: accelerometer, magnetometer: FUSION_VECTOR_ZERO, deltaTime: deltaTime)
    let accelerationREjectionTimeout = false
    if initialising && !accelerationREjectionTimeout {
      FusionAhrsSetHeading(heading: 0.0)
    }
  }
  
  func FusionAhrsUpdate(gyroscope: FusionVector, accelerometer: FusionVector, magnetometer: FusionVector, deltaTime: Double)  {
    var Q:FusionQuaternion = quaternion
    
    self.accelerometer = accelerometer
    
    // Ramp down gain during initialization
    if initialising {
      rampedGain -= rampedGainStep * deltaTime
    }
    
    if rampedGain < settings.gain {
      rampedGain = settings.gain
      initialising = false
      accelerationRejectionTimeout = false
    }
    
    var halfGravity:FusionVector = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    
    // Calculate direction of gravity indicated by algorithm
    halfGravity.x = Q.x * Q.z - Q.w * Q.y
    halfGravity.y = Q.y * Q.z + Q.w * Q.x
    halfGravity.z = Q.w * Q.w - 0.5 + Q.z * Q.z
    
    // Calculate accelerometer feedback
    let FusionVectorObj = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    halfAccelerometerFeedback = FusionVectorObj.crossProduct(vectorA: FusionVectorObj.normalize(vector: accelerometer), vectorB: halfGravity)
    accelerometerIgnored = true
    
    // Enter acceleration recovery state if acceleration rejection times out
    if !FusionVectorObj.isZero(vector: accelerometer) {
      if accelerationRejectionTimer > Int(settings.rejectionTimeout) {
        let quat = self.quaternion
        FusionAhrsReset()
        self.quaternion = quat
        accelerationRejectionTimer = 0
        accelerationRejectionTimeout = true
      }
    }
    
    // Calculate accelerometer feedback scaled by 0.5
    halfAccelerometerFeedback = FusionVectorObj.crossProduct(vectorA: FusionVectorObj.normalize(vector: accelerometer), vectorB: halfGravity)
    let halfAccel = halfAccelerometerFeedback
    
    // Ignore accelerometer if acceleration distortion detected
    if initialising || FusionVectorObj.magnitudeSquared(vector: halfAccelerometerFeedback) < settings.accelerationRejection {
      self.halfAccelerometerFeedback = halfAccel
      accelerometerIgnored = false
      
      if accelerationRejectionTimer >= 10 {
        accelerationRejectionTimer -= 10
      } else {
        accelerationRejectionTimer -= 0
      }
    } else {
      accelerationRejectionTimer += 1
    }
    
    var halfMagnetometerFeedback = FusionVector(x: 0, y: 0, z: 0)
    magnetometerIgnored = true
    
    if !FusionVectorObj.isZero(vector: magnetometer) {
      // Set to compass heading if magnetic rejection times out
      magneticRejectionTimeout = false
    }
    
    if magneticRejectionTimer > Int(settings.rejectionTimeout) {
      FusionAhrsSetHeading(heading: FusionCompassCalculateHeading(accelerometer: halfGravity, magnetometer: magnetometer))
      magneticRejectionTimer = 0
      magneticRejectionTimeout = true
    }
    
    // Compute direction of west indicated by algorithm
    var halfWest = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    halfWest.x = Q.x * Q.y + Q.w * Q.z
    halfWest.y = Q.w * Q.w - 0.5 + Q.y * Q.y
    halfWest.z = Q.y * Q.z - Q.w * Q.x
    
    halfMagnetometerFeedback = FusionVectorObj.crossProduct(vectorA: FusionVectorObj.normalize(vector: FusionVectorObj.crossProduct(vectorA: halfGravity, vectorB: magnetometer)), vectorB: halfWest)
    
    // Ignore magnetometer if magnetic distortion detected
    if initialising || FusionVectorObj.magnitudeSquared(vector: halfMagnetometerFeedback) < settings.magneticRejection {
      self.halfMagnetometerFeedback = halfMagnetometerFeedback
      magnetometerIgnored = false
      
      if magneticRejectionTimer >= 10 {
        magneticRejectionTimer -= 10
      } else {
        magneticRejectionTimer -= 0
      }
    } else {
      magneticRejectionTimer += 1
    }
    
    // Convert gyroscope to radians per second scaled by 0.5
    var halfGyroscope = FusionVectorObj.multiplyScalar(vector: gyroscope, scalar: FusionDegreesToRadians(degrees: 0.5))
    
    // Apply feedback to gyroscope
    var adjustedHalfGyroscope = FusionVectorObj.add(vectorA: halfGyroscope, vectorB: FusionVectorObj.multiplyScalar(vector: FusionVectorObj.add(vectorA: halfAccelerometerFeedback, vectorB: halfMagnetometerFeedback), scalar:  rampedGain))
    
    
    // Integrate rate of change of quaternion
    
    let FusionQuaternionObj = FusionQuaternion(w: accelerationRejection, x: accelerationRejection, y: accelerationRejection, z: accelerationRejection)
    
    quaternion = FusionQuaternionObj.FusionQuaternionAdd(quaternionA: quaternion, quaternionB: FusionQuaternionObj.FusionQuaternionMultiplyVector(quaternion: quaternion, vector:  FusionVectorObj.multiplyScalar(vector: adjustedHalfGyroscope, scalar: deltaTime)))
    
    let test:FusionVector = FusionVectorObj.multiplyScalar(vector: adjustedHalfGyroscope, scalar: deltaTime)
    
    // Normalize quaternion
    quaternion = FusionQuaternionNormalise(quaternion:quaternion)
  }
  
  
  // (remaining code)
  
  func FusionQuaternionNormalise(quaternion: FusionQuaternion) -> FusionQuaternion {
    let FusionVectorObj = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    let q = quaternion
    let magnitudeReciprocal = FusionVectorObj.fastInverseSqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z)
    let result = FusionQuaternion(w: q.w * magnitudeReciprocal, x: q.x * magnitudeReciprocal, y: q.y * magnitudeReciprocal, z: q.z * magnitudeReciprocal)
    return result
  }
  
  private func FusionCompassCalculateHeading(accelerometer: FusionVector, magnetometer: FusionVector) -> Double {
    let FusionVectorObj = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    let magneticWest = FusionVectorObj.normalize(vector: FusionVectorObj.crossProduct(vectorA: accelerometer, vectorB: magnetometer))
    let magneticNorth = FusionVectorObj.normalize(vector: FusionVectorObj.crossProduct(vectorA: magneticWest, vectorB: accelerometer))
    let heading = atan2(magneticWest.x, magneticNorth.x)
    let headingDegrees = FusionDegreesToRadians(degrees: heading)
    return headingDegrees
  }
  
  private func FusionAhrsSetHeading(heading: Double) {
    let heading = 0
    let Q = FUSION_IDENTITY_QUATERNION
    let yaw = atan2(Q.w * Q.z + Q.x * Q.y, 0.5 - Q.y * Q.y - Q.z * Q.z)
    let halfYawMinusHeading = 0.5 * (yaw - FusionDegreesToRadians(degrees: Double(heading)))
    let _ = FusionQuaternion(w: cos(halfYawMinusHeading), x: 0.0, y: 0.0, z: -1.0 * sin(halfYawMinusHeading))
  }
  
  func FusionGetEarthAcceleration() -> FusionVector {
    let Q = self.quaternion
    let A = self.accelerometer
    let qwqw = Q.w * Q.w
    let qwqx = Q.w * Q.x
    let qwqy = Q.w * Q.y
    let qwqz = Q.w * Q.z
    let qxqy = Q.x * Q.y
    let qxqz = Q.x * Q.z
    let qyqz = Q.y * Q.z
    
    return FusionVector(
      x: 2.0 * ((qwqw - 0.5 + Q.x * Q.x) * A.x + (qxqy - qwqz) * A.y + (qxqz + qwqy) * A.z),
      y: 2.0 * ((qxqy + qwqz) * A.x + (qwqw - 0.5 + Q.y * Q.y) * A.y + (qyqz - qwqx) * A.z),
      z: 2.0 * ((qxqz - qwqy) * A.x + (qyqz + qwqx) * A.y + (qwqw - 0.5 + Q.z * Q.z) * A.z) - 1.0
    )
  }
  
  func QuaternionToEuler() -> [String: Double] {
    let FusionVectorObj = FusionVector(x: 0.0, y: 0.0, z: 0.0)
    
    let halfMinusQySquared = 0.5 - self.quaternion.y * self.quaternion.y
    let roll = FusionVectorObj.radiansToDegrees(radians: atan2(self.quaternion.w * self.quaternion.x + self.quaternion.y * self.quaternion.z, halfMinusQySquared - self.quaternion.x * self.quaternion.x))
    let pitch = FusionVectorObj.radiansToDegrees(radians: asin(2.0 * (self.quaternion.w * self.quaternion.y - self.quaternion.z * self.quaternion.x)))
    let yaw = FusionVectorObj.radiansToDegrees(radians: atan2(self.quaternion.w * self.quaternion.z + self.quaternion.x * self.quaternion.y, halfMinusQySquared - self.quaternion.z * self.quaternion.z))
    
    return ["roll": roll, "pitch": pitch, "yaw": yaw]
  }
}




class FusionQuaternion {
  
  var w: Double
  var x: Double
  var y: Double
  var z: Double
  
  init(w: Double, x: Double, y: Double, z: Double) {
    self.w = w
    self.x = x
    self.y = y
    self.z = z
  }
  
  func FusionQuaternionAdd(quaternionA: FusionQuaternion, quaternionB: FusionQuaternion) -> FusionQuaternion {
    let result = FusionQuaternion(w: quaternionA.w + quaternionB.w, x: quaternionA.x + quaternionB.x,
                                  y: quaternionA.y + quaternionB.y, z: quaternionA.z + quaternionB.z)
    return result
  }
  
  func FusionQuaternionMultiplyVector(quaternion: FusionQuaternion, vector: FusionVector) -> FusionQuaternion {
    let q = quaternion
    let v = vector
    let result = FusionQuaternion(w: -q.x * v.x - q.y * v.y - q.z * v.z,
                                  x: q.w * v.x + q.y * v.z - q.z * v.y,
                                  y: q.w * v.y - q.x * v.z + q.z * v.x,
                                  z: q.w * v.z + q.x * v.y - q.y * v.x)
    return result
  }
  
  let FusionVectorObj = FusionVector(x: 0.0, y: 0.0, z: 0.0)
  
  func FusionQuaternionMultiply(quaternionA: FusionQuaternion, quaternionB: FusionQuaternion) -> FusionQuaternion {
    let result = FusionQuaternion(
      w: quaternionA.w * quaternionB.w - quaternionA.x * quaternionB.x - quaternionA.y * quaternionB.y - quaternionA.z * quaternionB.z,
      x: quaternionA.w * quaternionB.x + quaternionA.x * quaternionB.w + quaternionA.y * quaternionB.z - quaternionA.z * quaternionB.y,
      y: quaternionA.w * quaternionB.y - quaternionA.x * quaternionB.z + quaternionA.y * quaternionB.w + quaternionA.z * quaternionB.x,
      z: quaternionA.w * quaternionB.z + quaternionA.x * quaternionB.y - quaternionA.y * quaternionB.x + quaternionA.z * quaternionB.w
    )
    return result
  }
}
