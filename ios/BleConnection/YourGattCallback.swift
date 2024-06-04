//
//  YourGattCallback.swift
//  OnePuttProApp
//
//  Created by Mithilesh Bandiwdekar on 11/12/23.
//

import Foundation

//
//protocol BLEDataListener: AnyObject {
//    func onBLEDataReceived(accelX: Double, accelY: Double, accelZ: Double, gyroX: Double, gyroY: Double, gyroZ: Double, batPercentage: Int)
//}
//
//class YourGattCallback: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
//
//    private static let TAG = "YourGattCallback"
//    private static let SERVICE_UUID = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
//    private static let CHARACTERISTIC_UUID = CBUUID(string: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E")
//
//    weak var bleDataListener: BLEDataListener?
//    private var centralManager: CBCentralManager?
//    private var peripheral: CBPeripheral?
//
//    override init() {
//        super.init()
//        centralManager = CBCentralManager(delegate: self, queue: nil)
//    }
//
//    func setBLEDataListener(listener: BLEDataListener) {
//        self.bleDataListener = listener
//    }
//
//    func centralManagerDidUpdateState(_ central: CBCentralManager) {
//        if central.state == .poweredOn {
//            centralManager?.scanForPeripherals(withServices: nil, options: nil)
//        }
//    }
//
//    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi: NSNumber) {
//        self.peripheral = peripheral
//        centralManager?.connect(peripheral, options: nil)
//    }
//
//    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
//        peripheral.delegate = self
//        peripheral.discoverServices([YourGattCallback.SERVICE_UUID])
//    }
//
//    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
//        if let services = peripheral.services, let service = services.first(where: { $0.uuid == YourGattCallback.SERVICE_UUID }) {
//            peripheral.discoverCharacteristics([YourGattCallback.CHARACTERISTIC_UUID], for: service)
//        }
//    }
//
//    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
//        if let characteristics = service.characteristics,
//           let characteristic = characteristics.first(where: { $0.uuid == YourGattCallback.CHARACTERISTIC_UUID }) {
//            peripheral.setNotifyValue(true, for: characteristic)
//        }
//    }
//
//    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
//        if let data = characteristic.value,
//           let receivedData = String(data: data, encoding: .utf8) {
//            let accelX = extractValue(sensorReading: receivedData, key: "ax")
//            let accelY = extractValue(sensorReading: receivedData, key: "ay")
//            let accelZ = extractValue(sensorReading: receivedData, key: "az")
//            let gyroX = extractValue(sensorReading: receivedData, key: "gx")
//            let gyroY = extractValue(sensorReading: receivedData, key: "gy")
//            let gyroZ = extractValue(sensorReading: receivedData, key: "gz")
//            let batPercentage = Int(extractValue(sensorReading: receivedData, key: "bat"))
//
//            bleDataListener?.onBLEDataReceived(accelX: accelX, accelY: accelY, accelZ: accelZ, gyroX: gyroX, gyroY: gyroY, gyroZ: gyroZ, batPercentage: batPercentage ?? 0)
//        }
//    }
//
//    // Helper method to extract values from the received data
//    private func extractValue(sensorReading: String, key: String) -> Double {
//        guard let startIndex = sensorReading.range(of: "\(key):")?.upperBound else { return 0.0 }
//        let endIndex = sensorReading.index(startIndex, offsetBy: key.count)
//        let valueString = sensorReading[startIndex..<endIndex].trimmingCharacters(in: .whitespacesAndNewlines)
//        return Double(valueString) ?? 0.0
//    }
//}
//
