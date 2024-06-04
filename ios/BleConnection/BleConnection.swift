//
//  BleConnection.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 24/11/23.
//

import Foundation
import CoreBluetooth

class BLEManager: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
  // Singleton instance
  
 // static let shared = BLEManager()
  private static var privateShared : BLEManager?

      class func shared() -> BLEManager { // change class to final to prevent override
          guard let uwShared = privateShared else {
              privateShared = BLEManager()
              return privateShared!
          }
          return uwShared
      }
  
  class func destroy() {
          privateShared = nil
      }

  
  // Properties
  private var centralManager: CBCentralManager!
  private var peripheral: CBPeripheral?
  
  // BLE service and characteristic UUIDs

  
  
  var characteristicData: [CBCharacteristic] = []
  // Callbacks
  var didDiscoverPeripheral: ((CBPeripheral) -> Void)?
  var didConnectPeripheral: ((CBPeripheral) -> Void)?
  var didUpdateValueForCharacteristic: ((CBCharacteristic) -> Void)?
  var OtherParameterValue = ""
  var isConnected : Bool = false
  
  
  // Initialization
  private override init() {
    super.init()
    centralManager = CBCentralManager(delegate: self, queue: nil)
  }
  
  // MARK: - CBCentralManagerDelegate
  
  //MARK: - DELEGATE METHODS
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    if central.state == .poweredOn{
      central.scanForPeripherals(withServices:nil)
    }
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    guard peripheral.name != nil else { return }
    print(peripheral)
    didDiscoverPeripheral?(peripheral)
    print(peripheral)
    if peripheral.identifier == UUID(uuidString:getMacAddress()){
      
      self.centralManager.stopScan()
      self.centralManager.connect(peripheral, options: nil)
      self.peripheral = peripheral
      isConnected = true
      print("EXPECTED_PERIPHERALS = \(self.peripheral!)")
    }
  }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    self.peripheral?.discoverServices(nil) //can provide array of specific services
    self.peripheral?.delegate = self
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
    if let services = peripheral.services{
      for service in services{
        peripheral.discoverCharacteristics(nil, for: service)
      }
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    for charac in service.characteristics!{
      
      characteristicData.append(charac)
        peripheral.setNotifyValue(true, for: charac)
        peripheral.readValue(for: charac)
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
    
    guard let data = characteristic.value else {
      return
    }
    
    didUpdateValueForCharacteristic?(characteristic)
    
  }
  
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    if let peripheral = peripheral as CBPeripheral?{
      peripheral.delegate = nil
      centralManager.cancelPeripheralConnection(peripheral)
    }
  }
  
  
  // MARK: - Public Methods
  
  func connect(to peripheral: CBPeripheral) {
    centralManager.connect(peripheral, options: nil)
  }
  
  func stopScan()
  {
    centralManager?.stopScan()
  }
  func disconnect() {
    if let peripheral = peripheral {
      centralManager.cancelPeripheralConnection(peripheral)
      isConnected = false
    }
  }
  
  
  
  // MARK: - Private Methods
  
  private func scanForPeripherals() {
    centralManager.scanForPeripherals(withServices: nil, options: nil)
  }
  ///Old connection code
  /*  func centralManagerDidUpdateState(_ central: CBCentralManager) {
   switch central.state {
   case .poweredOn:
   scanForPeripherals()
   default:
   print("Bluetooth is not available.")
   }
   }
   
   func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral,
   advertisementData: [String: Any], rssi RSSI: NSNumber) {
   didDiscoverPeripheral?(peripheral)
   }
   
   func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
   peripheral.delegate = self
   peripheral.discoverServices([serviceUUID])
   didConnectPeripheral?(peripheral)
   }
   
   // MARK: - CBPeripheralDelegate
   
   func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
   
   if let services = peripheral.services{
   for service in services{
   peripheral.discoverCharacteristics(nil, for: service)
   }
   }
   }
   
   func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
   for charac in service.characteristics!{
   
   characteristicData.append(charac)
   if charac.uuid == BATTERY_LEVEL_CHARACTERISTIC{
   peripheral.setNotifyValue(true, for: charac)
   peripheral.readValue(for: charac)
   }
   else if charac.uuid == Other_LEVEL_CHARACTERISTIC{
   peripheral.setNotifyValue(true, for: charac)
   peripheral.readValue(for: charac)
   }
   }
   
   }
   
   func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
   if let error = error {
   print("Error updating characteristic value: \(error.localizedDescription)")
   return
   }
   didUpdateValueForCharacteristic?(characteristic)
   }
   */
  
}
