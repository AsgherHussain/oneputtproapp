//
//  CSVReaderMainMethod.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 22/11/23.
//


import Foundation
import Numerics
import Accelerate

struct CSVReaderMainMethod
{
  func calculation(file: [[Double]], threshold: Int, scoreData: [String]) -> [String: Any] {
    var multiValues = [String: Any]()
    var data = [String]()
    var gyroscope = [[String]]()
    var timestamp = [String]()
    var accelerometer = [[String]]()
    let delimiter = ","
    var lines = [[String]]()
    
    var Threshold = Double(threshold)
    var backstroke: Any?
    var frontStroke: Any?
    var ratioBackFront: Any?
    var elevationImpact: Any?
    var centreFront: Any?
    var velocityAbs: Any?
    var diffYaw: Any?
    var rollStart: Any?
    var rollImpact: Any?
    var posYImpact: Any?
    var pitchImpact: Any?
    var frontImpactTime: Any?
    var backstrokeTime: Any?
    var loftAngle: Any?
    var accelerationImpact: Any?
    var avgScore: Any?
    
    var sharedInt = 0
    
    do {
      for i in 0..<file.count {
        let array1 = file[i]
        timestamp.append(String(array1[0]))
        var gyroscopeArray = [String]()
        for j in 1..<4 {
          gyroscopeArray.append(String(array1[j]))
        }
        gyroscope.append(gyroscopeArray)
        
        var accelerometerArray = [String]()
        for a in 4..<7 {
          accelerometerArray.append(String(array1[a]))
        }
        accelerometer.append(accelerometerArray)
      }
      
      //timestamp.removeFirst()
      //gyroscope.removeFirst()
     // accelerometer.removeFirst()
      
      let sampleRate = 100
      var thresholdValue = 1.5
      let AHRS = FusionAhrs(w: 0.5, x: 10, y: 0, z: Double(sampleRate))
      var acceleration = Array(repeating: Array(repeating: 0.0, count: 3), count: timestamp.count)
      var deltaTime = [Double](repeating: 0.0, count: timestamp.count)
      _ = Array(repeating: Array(repeating: 0.0, count: 3), count: timestamp.count)
      
      for i in 0..<timestamp.count {
        if i == 0 {
          deltaTime[i] = Double(timestamp[i])! - Double(timestamp[i])!
        }
        for j in (i + 1)..<timestamp.count {
          deltaTime[j] = Double(timestamp[j])! - Double(timestamp[i])!
          break
        }
      }
      
      let fusionOffset = FusionOffset(sampleRate: Double(sampleRate))
      var euler1: [String: Any] = [:]
      
      var eulerTime = Array(repeating: Array(repeating: 0.0, count: 4), count: timestamp.count)
      
      for index in 0..<accelerometer.count {
        let fusionVector = FusionVector(x: Double(gyroscope[index][0])!,
                                        y: Double(gyroscope[index][1])!,
                                        z: Double(gyroscope[index][2])!)
        let gyroscopeVec = fusionOffset.update(gyroscope: fusionVector, threshold: thresholdValue)
        let accelerometerVec = FusionVector(x: Double(accelerometer[index][0])!,
                                            y: Double(accelerometer[index][1])!,
                                            z: Double(accelerometer[index][2])!)
        
        AHRS.FusionAhrsUpdateNoMagnetometer(gyroscope: gyroscopeVec,
                                            accelerometer: accelerometerVec,
                                            deltaTime: deltaTime[index])
        var accelerationVec = FusionVector(x: 0, y: 0, z: 0)
        euler1 = AHRS.QuaternionToEuler()
        eulerTime[index][0] = Double(timestamp[index])!
        eulerTime[index][1] = euler1["roll"] as! Double
        eulerTime[index][2] = euler1["pitch"] as! Double
        eulerTime[index][3] = euler1["yaw"] as! Double
        accelerationVec = AHRS.FusionGetEarthAcceleration()
        acceleration[index][0] = accelerationVec.x * 9.80665
        acceleration[index][1] = accelerationVec.y * 9.80665
        acceleration[index][2] = accelerationVec.z * 9.80665
      }
      
      if(gyroscope.count == 0) {return [:]}
      var boolArr = Array(repeating: Array(repeating: false, count: gyroscope[0].count), count: gyroscope.count)
      for i in 0..<gyroscope.count {
        for j in 0..<gyroscope[i].count {
          boolArr[i][j] = (Double(gyroscope[i][j])! > -3 && Double(gyroscope[i][j])! < 3)
        }
      }
      
      // Create a new 2-dimensional double array with zero gyro values
      var zeroGyro = Array(repeating: Array(repeating: 0.0, count: gyroscope[0].count), count: gyroscope.count)
      
      for i in 0..<gyroscope.count {
        for j in 0..<gyroscope[i].count {
          if boolArr[i][j] {
            zeroGyro[i][j] = 0
          } else {
            zeroGyro[i][j] = Double(gyroscope[i][j])!
          }
        }
      }
      
      // Create a new 2-dimensional double array called newGyroscope
      var newGyroscope = Array(repeating: Array(repeating: 0.0, count: 4), count: gyroscope.count)
      
      // Set the first column of the new array to the timestamp value
      for i in 0..<gyroscope.count {
        newGyroscope[i][0] = Double(timestamp[i])!
      }
      
      // Copy contents of zeroGyro to the remaining three columns of the new array
      for i in 0..<gyroscope.count {
        newGyroscope[i][1...3] = zeroGyro[i][0...2]
      }
      
      
      
      var idx = Array(repeating: 0, count: newGyroscope.count)
      var count = 0
      
      for i in 0..<newGyroscope.count {
        if newGyroscope[i][1] != 0 || newGyroscope[i][2] != 0 || newGyroscope[i][3] != 0 {
          idx[count] = i
          count += 1
        }
      }
      
      idx = Array(idx[0..<count])
      if(idx.count <= 0){return ([:])}
      let motionStopped = newGyroscope[idx[idx.count - 1]][0]
      
      var newAcceleration = Array(repeating: Array(repeating: 0.0, count: 4), count: acceleration.count)
      
      
      for i in 0..<acceleration.count {
        newAcceleration[i][0] = Double(timestamp[i]) ?? 0.0
      }
      
      for i in 0..<acceleration.count {
        newAcceleration[i][1...3] = acceleration[i][0...2]
      }
      
      var idx1 = -1
      
      for i in 0..<newAcceleration.count {
        if newAcceleration[i][0] == motionStopped {
          idx1 = i
          break
        }
      }
      
      if idx1 < 0 {
        idx1 = -idx1 - 2
      }
      
      for i in idx1 + 1..<newAcceleration.count {
        for j in 1..<newAcceleration[i].count {
          newAcceleration[i][j] = 0
        }
      }
      
      for i in 0..<newAcceleration.count {
        acceleration[i] = Array(newAcceleration[i][1...])
      }
      
      
      
      var isMoving = Array(repeating: false, count: timestamp.count)
      
      for index in 0..<timestamp.count {
        let accelerationMagnitude = sqrt(pow(acceleration[index][0], 2) + pow(acceleration[index][1], 2) + pow(acceleration[index][2], 2))
        
        switch thresholdValue {
        case 3:
          thresholdValue = 1.5 // m/s
        case 6:
          thresholdValue = 2.5 // m/s
        case 9:
          thresholdValue = 3 // m/s
        case 12:
          thresholdValue = 3.5 // m/s
        default:
          // Handle cases where Threshold doesn't match any values
          break
        }
        ///Note : Harcoded value
        isMoving[index] = accelerationMagnitude > thresholdValue // Hard code value 1.8
      }
      
      let margin = Int(0.1 * Double(sampleRate)) // 100 ms
      if(timestamp.count <= margin) {return [:]}
      for index1 in 0..<(timestamp.count - margin) {
        var moving = false
        for i in index1..<(index1 + margin) {
          moving = moving || isMoving[i]
        }
        isMoving[index1] = moving
      }
      
      for index2 in stride(from: (timestamp.count - 1), to: margin, by: -1) {
        var anyMoving = false
        for i in (index2 - margin)..<index2 {
          if isMoving[i] {
            anyMoving = true
            break
          }
        }
        isMoving[index2] = anyMoving
      }
      
      var velocity = Array(repeating: Array(repeating: 0.0, count: 3), count: timestamp.count)
      for index in 1..<timestamp.count {
        if isMoving[index] {
          for axis in 0..<3 {
            velocity[index][axis] = velocity[index - 1][axis] + deltaTime[index] * acceleration[index][axis]
          }
        }
      }
      
      var isMoving1 = Array(repeating: 0.0, count: timestamp.count)
      for index in 0..<isMoving.count {
        isMoving1[index] = isMoving[index] ? 1.0 : 0.0
      }
      
      // Find start and stop indices of each moving period
      var isMovingDiff = Array(repeating: 0.0, count: timestamp.count)
      for index in 0..<(timestamp.count - 1) {
        isMovingDiff[index] = isMoving1[index + 1] - isMoving1[index]
      }
      
      
      class IsMovingPeriod {
        var startIndex = -1
        var stopIndex = -1
      }
      
      var isMovingPeriods = [IsMovingPeriod]()
      var isMovingPeriod = IsMovingPeriod()
      
      for index in 0..<timestamp.count {
        guard index < isMovingDiff.count else {
          // Handle the case where isMovingDiff is smaller than timestamp
          break
        }
        
        if isMovingPeriod.startIndex == -1 {
          if isMovingDiff[index] == 1 {
            isMovingPeriod.startIndex = index
          }
        } else if isMovingPeriod.stopIndex == -1 {
          if isMovingDiff[index] == -1 {
            isMovingPeriod.stopIndex = index
            isMovingPeriods.append(isMovingPeriod)
            isMovingPeriod = IsMovingPeriod()
          }
        }
      }
      
      
      var timestamp1 = [Double]()
      timestamp1.reserveCapacity(timestamp.count)
      
      for i in 0..<timestamp.count {
        let value = Double(timestamp[i])!
        timestamp1.append(value)
      }
      
      var velocityDrift = Array(repeating: Array(repeating: 0.0, count: 3), count: timestamp.count)
      
      for isMovingPeriod in isMovingPeriods {
        let startIndex = isMovingPeriod.startIndex
        let stopIndex = isMovingPeriod.stopIndex
        
        let t = [timestamp1[startIndex], timestamp1[stopIndex]]
        let x = [velocity[startIndex][0], velocity[stopIndex][0]]
        let y = [velocity[startIndex][1], velocity[stopIndex][1]]
        let z = [velocity[startIndex][2], velocity[stopIndex][2]]
        let tNew = Array(timestamp1[startIndex...stopIndex])
        
        // let interpolator = linearInterpolation(xValues: t, yValues: x, xInterpolate: tNew[0]);
        velocityDrift[startIndex][0] = linearInterpolation(xValues: t, yValues: x, xInterpolate: tNew[0])
        velocityDrift[startIndex][1] = linearInterpolation(xValues: t, yValues: y, xInterpolate: tNew[0])
        velocityDrift[startIndex][2] = linearInterpolation(xValues: t, yValues: z, xInterpolate: tNew[0])
        
        for i in 1..<tNew.count {
          velocityDrift[startIndex + i][0] = linearInterpolation(xValues: t, yValues: x, xInterpolate: tNew[i])
          velocityDrift[startIndex + i][1] = linearInterpolation(xValues: t, yValues: y, xInterpolate: tNew[i])
          velocityDrift[startIndex + i][2] = linearInterpolation(xValues: t, yValues: z, xInterpolate: tNew[i])
        }
      }
      
      for i in 0..<velocity.count {
        velocity[i][0] -= velocityDrift[i][0]
        velocity[i][1] -= velocityDrift[i][1]
        velocity[i][2] -= velocityDrift[i][2]
        
        if i > idx1 {
          velocity[i][0] = 0
          velocity[i][1] = 0
          velocity[i][2] = 0
        }
      }
      
      let sr = 100
      
      if(timestamp.count < sr) {return [:]}
      var position = Array(repeating: Array(repeating: 0.0, count: 3), count: timestamp.count - sr)
      velocity = Array(velocity[sr...])
      eulerTime = Array(eulerTime[sr...])
      acceleration = Array(acceleration[sr...])
      
      var centripetalVelocity = 0.0
      
      for i in 0..<velocity.count {
        centripetalVelocity = pow(velocity[i][2], 2.0) / 0.8
        velocity[i][2] = velocity[i][2] - centripetalVelocity
      }
      
      timestamp.removeFirst(sr)
      deltaTime.removeFirst(sr)
      if(timestamp.count <= 0) {return [:]}
      for index in 1..<timestamp.count {
        let previousPosition = position[index - 1]
        let deltaTime = deltaTime[index]
        let currentVelocity = velocity[index]
        for i in 0..<3 {
          position[index][i] = previousPosition[i] + deltaTime * currentVelocity[i]
        }
      }
      
      
      var newPosition = Array(repeating: Array(repeating: 0.0, count: 4), count: position.count)
      
      for i in 0..<position.count {
        newPosition[i][0] = Double(timestamp[i]) ?? 0.0
        newPosition[i][1] = position[i][0]
        newPosition[i][2] = position[i][1]
        newPosition[i][3] = position[i][2]
      }
      
      multiValues =  frontBackSplit(pos: newPosition, velocity: velocity, eulerTime: eulerTime, acceleration: acceleration, scoreData: scoreData)
      
      return multiValues
    } catch {
      print("Exception: \(error)")
    }
    
    multiValues["centre_front"] = centreFront
    multiValues["backstroke"] = backstroke
    multiValues["front_stroke"] = frontStroke
    multiValues["ratio_back_front"] = ratioBackFront
    multiValues["elevation_impact"] = elevationImpact
    multiValues["front_impact_time"] = frontImpactTime
    multiValues["backstroke_time"] = backstrokeTime
    multiValues["velocity_abs"] = velocityAbs
    multiValues["splitIndex"] = sharedInt
    multiValues["roll_start"] = rollStart
    multiValues["roll_impact"] = rollImpact
    multiValues["pos_y_impact"] = posYImpact
    multiValues["pitch_impact"] = pitchImpact
    multiValues["diff_yaw"] = diffYaw
    multiValues["loft_angle"] = loftAngle
    multiValues["accelerationImpact"] = accelerationImpact
    multiValues["avgScore"] = avgScore
    
    return multiValues
  }
  
  
  func linearInterpolation(xValues: [Double], yValues: [Double], xInterpolate: Double) -> Double {
    let n = xValues.count
    
    for i in 1..<n {
      if xValues[i] > xInterpolate {
        let x0 = xValues[i - 1]
        let x1 = xValues[i]
        let y0 = yValues[i - 1]
        let y1 = yValues[i]
        
        return y0 + ((xInterpolate - x0) * (y1 - y0)) / (x1 - x0)
      }
    }
    
    return yValues[n - 1] // Fallback: return the last value if xInterpolate is beyond the data
  }
  
  func frontBackSplit(pos: [[Double]], velocity: [[Double]], eulerTime: [[Double]], acceleration: [[Double]], scoreData: [String]) -> [String: Any] {
    do{
      var multiValuesReturn: [String: Any] = [:]
      
      var zeroRows: [Int] = []
      let columnIndex = 1
      
      for i in 0..<pos.count {
        if pos[i][columnIndex] == 0 {
          zeroRows.append(i)
        }
      }
      
      var posTime: [[Double]] = Array(repeating: Array(repeating: 0.0, count: pos[0].count), count: pos.count - zeroRows.count)
      var posTimeIndex = 0
      
      for i in 0..<pos.count {
        if !zeroRows.contains(i) {
          posTime[posTimeIndex] = pos[i]
          posTimeIndex += 1
        }
      }
      
     
      var mask = [Bool](repeating: false, count: posTime.count)
      if(mask.count <= 0) {return [:]}
      mask[0] = false
      
      for i in 1..<posTime.count {
        mask[i] = posTime[i] != posTime[i - 1]
      }
      
      for i in 0..<posTime.count {
        if !mask[i] {
          posTime[i] = Array(repeating: 0, count: posTime[i].count)
          // posTime[i].replaceAll { _ in 0.0 }
        }
      }
      
      var numNonZeroRows = 0
      
      for i in 0..<posTime.count {
        var isZeroRow = true
        
        for j in 0..<posTime[0].count {
          if posTime[i][j] != 0.0 {
            isZeroRow = false
            break
          }
        }
        
        if !isZeroRow {
          if i != numNonZeroRows {
            posTime[numNonZeroRows] = posTime[i]
          }
          
          numNonZeroRows += 1
        }
      }
      
      posTime = Array(posTime.prefix(numNonZeroRows))
      
      var posTimeX = [Double](repeating: 0.0, count: posTime.count)
      
      for m in 0..<posTime.count {
        posTimeX[m] = posTime[m][1]
      }
      
      var lowestNeg = Double.greatestFiniteMagnitude
      var cutoffIndex = -1
      
      for i in 0..<posTimeX.count {
        if posTimeX[i] < 0 && posTimeX[i] < lowestNeg {
          lowestNeg = posTimeX[i]
          cutoffIndex = i
        }
      }
      
      if(cutoffIndex == -1) {return [:]}
      
      var backstroke = Array(posTime[..<cutoffIndex])
      var frontStroke = Array(posTime[cutoffIndex...])
      
      var frontStrokeX = [Double](repeating: 0.0, count: frontStroke.count)
      
      for i in 0..<frontStroke.count {
        frontStrokeX[i] = frontStroke[i][1]
      }
      
      var arrayX: [Double] = []
      
      for i in 0..<frontStrokeX.count {
        let x = frontStrokeX[i] > 0 ? 0 + frontStrokeX[i] : 0 - frontStrokeX[i]
        arrayX.append(x)
      }
      
      var arrayXArr = [Double](repeating: 0.0, count: arrayX.count)
      
      for i in 0..<arrayX.count {
        arrayXArr[i] = arrayX[i]
      }
      
      var splitIndex = 0
      for i in 0..<arrayXArr.count {
          if arrayXArr[i] < arrayXArr[splitIndex] {
              splitIndex = i
          }
      }
      
      var arr1 = Array(posTime[..<splitIndex])
      var centreFront = Array(posTime[splitIndex...])
      
      print("Testtrtrt \(centreFront)")
      if(backstroke.count < 2) { return([:])}
      if( backstroke[1].count == 0 ) { return([:])}
      let backstrokeTime = backstroke[backstroke.count - 1][0] - backstroke[1][0]
      let frontImpactTime = centreFront[centreFront.count - 1][0] - backstroke[backstroke.count - 2][0]
      
      let num1 = frontImpactTime / backstrokeTime
      if num1.isInfinite {
          print("dividepointsbyrest is infinite")
        return([:])
      }
      let ratioBackFront = String(format: "%.2f", num1)
      
      let elevationImpact = centreFront[0][3] * 100
      let posYImpact = posTime[0][2] - centreFront[0][2]
      let loftAngle = (1.1 - elevationImpact / 2.1)
      
      var velocityAbs = [Double](repeating: 0.0, count: velocity.count)
      
      for i in 0..<velocity.count {
        velocityAbs[i] = sqrt(pow(velocity[i][0], 2) + pow(velocity[i][1], 2) + pow(velocity[i][2], 2))
      }
      
      let startTime = posTime[0][0]
      var indexStart = -1
      
      for i in 0..<eulerTime.count {
        if eulerTime[i][0] == startTime {
          indexStart = i
          break
        }
      }
      
      var yawStart = 0.0
      var rollStart = 0.0
      
      if indexStart != -1 {
        rollStart = eulerTime[indexStart][1]
        rollStart += 90
        yawStart = eulerTime[indexStart][3]
      }
      
      let impactTime = centreFront[0][0]
      var indexImpact = -1
      var rollImpact = 0.0
      
      for i in 0..<eulerTime.count {
        if eulerTime[i][0] == impactTime {
          indexImpact = i
          break
        }
      }
      
      if indexImpact != -1 {
        rollImpact = eulerTime[indexImpact][1]
        rollImpact += 90
      }
      
      var diffYaw = 0.0
      
      if indexImpact != -1 {
        let yawImpact = eulerTime[indexImpact][3]
        diffYaw = yawStart - yawImpact
        backstroke[0][1] = 0
        backstroke[0][2] = 0
        backstroke[0][3] = 0
      }
      
      var pitchImpact = 0.0
      
      if indexImpact != -1 {
        pitchImpact = eulerTime[indexImpact][2]
      }
      
      var accelerationImpact = -acceleration[indexImpact][0]
      var accelerationImpact1 = 0.0
      
      var accelX = [Double](repeating: 0.0, count: acceleration.count)
      
      for i in 0..<acceleration.count {
        accelX[i] = acceleration[i][0]
      }
      
      var max = accelX[0]
      
      for i in 1..<accelX.count {
        if accelX[i] > max {
          max = accelX[i]
        }
      }
      
      accelerationImpact1 = max
      
      var score = [Double](repeating: 0.0, count: 9)
      var avg = 0.0
      
      for i in 0..<scoreData.count {
        _ = Double(scoreData[1])
      }
      
      score[0] = scoringFunction(target: 1, value: num1, deviation: 0.5)
      score[1] = scoringFunction(target: 0, value: elevationImpact, deviation: 0)
      score[2] = scoringFunction(target: Double(scoreData[5]) ?? 0.0, value: loftAngle, deviation: Double(scoreData[4]) ?? 0.0)
      score[3] = scoringFunction(target: 0, value: posYImpact, deviation: 0)
      score[4] = scoringFunction(target: Double(scoreData[1]) ?? 0.0, value: rollStart, deviation: Double(scoreData[0]) ?? 0.0)
      score[5] = scoringFunction(target: Double(scoreData[3]) ?? 0.0, value: rollImpact, deviation: Double(scoreData[2]) ?? 0.0)
      score[6] = scoringFunction(target: 0, value: diffYaw, deviation: 2)
      score[7] = scoringFunction(target: Double(scoreData[7]) ?? 0.0, value: accelerationImpact1, deviation: Double(scoreData[6]) ?? 0.0)
      
      avg = (score.reduce(0, +) / Double(score.count))
      score[8] = Double(Int(avg))
      let avgScore = Int(avg)
      
      print("accelerationImpact \(accelerationImpact1)")
      print("score \(score)")
      print("avg_score \(avgScore)")
      
      print("centre_front \(centreFront)")
      print("backstroke \(backstroke)")
      print("front_stroke \(frontStroke)")
      print("ratio_back_front \(ratioBackFront)")
      print("elevation_impact \(elevationImpact)")
      print("velocity_abs \(velocityAbs)")
      print("splitIndex: \(splitIndex)")
      print("diff_yaw: \(diffYaw)")
      print("roll_start: \(rollStart)")
      print("roll_impact: \(rollImpact)")
      print("pos_y_impact: \(posYImpact)")
      print("pitch_impact: \(pitchImpact)")
      print("Loft angle: \(loftAngle)")
      print("front_impact_time: \(frontImpactTime)")
      print("backstroke_time : \(backstrokeTime)")
      
      multiValuesReturn["centre_front"] = centreFront
      multiValuesReturn["backstroke"] = backstroke
      multiValuesReturn["front_stroke"] = frontStroke
      multiValuesReturn["ratio_back_front"] = ratioBackFront
      multiValuesReturn["elevation_impact"] = elevationImpact
      multiValuesReturn["front_impact_time"] = frontImpactTime
      multiValuesReturn["backstroke_time"] = backstrokeTime
      multiValuesReturn["velocity_abs"] = velocityAbs
      multiValuesReturn["splitIndex"] = splitIndex
      multiValuesReturn["roll_start"] = rollStart
      multiValuesReturn["roll_impact"] = rollImpact
      multiValuesReturn["pos_y_impact"] = posYImpact
      multiValuesReturn["pitch_impact"] = pitchImpact
      multiValuesReturn["diff_yaw"] = diffYaw
      multiValuesReturn["loft_angle"] = loftAngle
      multiValuesReturn["accelerationImpact"] = accelerationImpact
      multiValuesReturn["avgScore"] = avgScore
      
      return multiValuesReturn
    }
    catch{
      print("Catch Invoked")
    }
  }
  
  
  func scoringFunction(target: Double, value: Double, deviation: Double) -> Double {
    let m1 = abs(target - value)
    
    if m1 <= deviation {
        return 10.0
    } else {
        if target < value {
            return (1.0 / (abs((target + deviation) - value) + 1.0)) * 10.0
        } else {
            return (1.0 / (abs((target - deviation) - value) + 1.0)) * 10.0
        }
    }
}

  
}

