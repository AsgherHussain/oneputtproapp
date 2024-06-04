//
//  PredictClass.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

import Foundation
import TensorFlowLite


class PredictClass {
  
  private var h0: [[Float32]] = [Array(repeating: 0, count: 128)]
  private var c0: [[Float32]] = [Array(repeating: 0, count: 128)]
  
  
  convenience init(h0: [[Float32]], c0: [[Float32]]) {
    self.init()
    self.h0 = h0
    self.c0 = c0
  }
  
  public func predict(tfliteInterpreter: Interpreter, inputArray: [[[Float32]]]) throws -> Int {
    
    // 1. Allocate memory for the model's input `Tensor`s.
    try tfliteInterpreter.allocateTensors()
    
    // 2. input data preparation...
    
    let h0FlatArray = h0.flatMap { $0 }
    
    let c0FlatArray = c0.flatMap { $0 }
    
    var threeDArray: [[[Float32]]] = Array(repeating: Array(repeating: Array(repeating: 0, count: 9), count: 6), count: 1)
    threeDArray = inputArray
   // print("ThreeDArray :  \(threeDArray)")
    
    let flatFloatArray = threeDArray.flatMap { $0.flatMap { $0 } }
    
    //Data(buffer: UnsafeBufferPointer(start: h0FlatArray, count: h0FlatArray.count))
    let data = Data(copyingBufferOf: flatFloatArray) //Data(buffer: UnsafeBufferPointer(start: flatFloatArray, count: flatFloatArray.count))
    let dataC0 = Data(copyingBufferOf: c0FlatArray)
    let dataH0 = Data(copyingBufferOf: h0FlatArray)
    
    
    // Should be initialized
    
    
    //   print(" Data  :\(data)")
    // 3. Copy the input data to the input `Tensor`.
    
    if(PredictClassflag == false)
    {    PredictClassflag = true
      try tfliteInterpreter.copy(dataH0, toInputAt: 0)
      try tfliteInterpreter.copy(data, toInputAt: 1)
      try tfliteInterpreter.copy(dataC0, toInputAt: 2)
    }
    else
    {
    //  print("h0:\(h0Data!.data.toArray(type: Float32.self))")
     // print("h0:\(C0Data!.data.toArray(type: Float32.self))")
      try tfliteInterpreter.copy(h0Data!.data, toInputAt: 0)
      try tfliteInterpreter.copy(data, toInputAt: 1)
      try tfliteInterpreter.copy(C0Data!.data, toInputAt: 2)
    }
    
    
    
    // 4. Run inference by invoking the `Interpreter`.
    try tfliteInterpreter.invoke()
    
    // 5. Get the output `Tensor`
    let outputTensor = try tfliteInterpreter.output(at: 0)
    h0Data = try tfliteInterpreter.output(at: 1)
    C0Data = try tfliteInterpreter.output(at: 2)
  
    // 6. Copy output to `Data` to process the inference results.
    //  let outputSize = outputTensor.shape.dimensions.reduce(1, {x, y in x * y})
    let h0Data = h0Data!.data.toArray(type: Float32.self)
   // print("H0Out :\(h0Data)")
    let c0Data = C0Data!.data.toArray(type: Float32.self)
   // print("C0Out :\(c0Data)")
    let outputData = outputTensor.data.toArray(type: Float32.self)
  //  print("Output \(outputData)")
    //UnsafeMutableBufferPointer<Float32>.allocate(capacity: outputSize)
    // outputTensor.data.copyBytes(to: outputData)
    
    //print("c0 : \(self.c0)")
    // 7. Results in 1D float32 array
    let outputResults0 = Array(outputData)
    //print("OutputResult :\(outputResults0)")
    
    // 8. Get max value from results (7)
    guard let max = outputResults0.max() else {
      return 0
    }
    
    // 9. Find index of max value in result array (7)
    let index = outputResults0.firstIndex(of: max)
    
   // print("OutputIndex :\(index)")
    /*guard let index = outputResults0.firstIndex(of: max) else {
     return 0
     }*/
    
    return index ?? 10
  }
}


// MARK: - Data extension
extension Data {
  /// Creates a new buffer by copying the buffer pointer of the given array.
  ///
  /// - Warning: The given array's element type `T` must be trivial in that it can be copied bit
  ///     for bit with no indirection or reference-counting operations; otherwise, reinterpreting
  ///     data from the resulting buffer has undefined behavior.
  /// - Parameter array: An array with elements of type `T`.
  init<T>(copyingBufferOf array: [T]) {
    self = array.withUnsafeBufferPointer(Data.init)
  }

  /// Convert a Data instance to Array representation.
  func toArray<T>(type: T.Type) -> [T] where T: AdditiveArithmetic {
    var array = [T](repeating: T.zero, count: self.count / MemoryLayout<T>.stride)
    _ = array.withUnsafeMutableBytes { self.copyBytes(to: $0) }
    return array
  }
}

 
