//
//  FragmentStartPractice.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 23/11/23.
//

import Foundation
import CoreBluetooth
import UIKit
import SwiftUI
import TensorFlowLite

class FragmentStartPractice: UIViewController{
 
    //MARK: - OUTLETS
  
  @IBOutlet weak var dropView: UIView!
   
  

    //MARK: - GLOBAL VARIABLES

    var batteryLevelValue = 0
    var OtherParameterValue = ""
    
  
    //MARK: - UI VIEW CONTROLLER LIFE CYCLES
    override func viewDidLoad() {
        super.viewDidLoad()
         addSwiftUIView()
         getdata()
        // blfe()
      
       
    }
  
  func getdata()
  {
     getScoredata()
  }
  
  func addSwiftUIView() {
      let swiftUIView = PracticeView(dismiss: self.dismissVC)

      let hostingController = UIHostingController(rootView: swiftUIView)

      /// Add as a child of the current view controller.
      addChild(hostingController)

      /// Add the SwiftUI view to the view controller view hierarchy.
      dropView.addSubview(hostingController.view)

      /// Setup the constraints to update the SwiftUI view boundaries.
      hostingController.view.translatesAutoresizingMaskIntoConstraints = false
      let constraints = [
          hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
          hostingController.view.leftAnchor.constraint(equalTo: view.leftAnchor),
          view.bottomAnchor.constraint(equalTo: hostingController.view.bottomAnchor),
          view.rightAnchor.constraint(equalTo: hostingController.view.rightAnchor)
      ]

      NSLayoutConstraint.activate(constraints)

      /// Notify the hosting controller that it has been moved to the current view controller.
      hostingController.didMove(toParent: self)
  }
  
    
    @IBAction func onClickMoreCharac(_ sender: UIButton) {
     
     // let csv = CSVReaderMainMethod()
      //print(csv.calculation(file: DummyTestingdata, threshold: 3, scoreData: scoreData))
    }
  

  func blfe()
  {
    
    
    /* bleManager.didDiscoverPeripheral = { peripheral in
     print("Discovered peripheral: \(peripheral)")
     
     if peripheral.identifier == self.UUIDdevice{
     // bleManager.centralManager.stopScan()
     bleManager.connect(to: peripheral)
     self.peripheral = peripheral
     if let deviceName = self.peripheral?.name{
     // self.lblDeviceName.text = "Device Name : \(deviceName)"
     }
     print("EXPECTED_PERIPHERALS = \(self.peripheral!)")
     }
     
     }
     
     bleManager.didConnectPeripheral = { peripheral in
     print("Connected to peripheral: \(peripheral)")
     bleManager.stopScan()
     }*/
    
    /* let bleManager = BLEManager.shared
     bleManager.didUpdateValueForCharacteristic = { characteristic in
     print("Updated value for characteristic: \(characteristic)")
     
     guard let data = characteristic.value else {
     return
     }
     
     
     self.OtherParameterValue = String(data: data, encoding: .utf8) ?? ""
     print(String(data: data, encoding: .utf8) ?? "")
     let accelx = self.splitSensorReading(self.OtherParameterValue)
     
     print("\(accelx["ax"])")
     print("\(accelx["ay"])")
     print("\(accelx["az"])")
     print("\(accelx["gx"])")
     print("\(accelx["gy"])")
     print("\(accelx["gz"])")
     print("\(accelx["bat"])")
     
     bleManager.disconnect()*/
  

  }
    
    
    func splitSensorReading(_ sensorReading: String) -> [String: Double] {
        var sensorData = [String: Double]()

        let components = sensorReading.components(separatedBy: ",")

        for component in components {
            let keyValue = component.components(separatedBy: ":")
            if keyValue.count == 2, let key = keyValue.first, let value = Double(keyValue[1]) {
                sensorData[key] = value
            }
        }

        return sensorData
    }
    
   func dismissVC()
  {
    DispatchQueue.global().async {
      DispatchQueue.main.async {
        self.dismiss(animated: true, completion: nil)
      }}
  }
}


