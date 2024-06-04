//
//  BridgeEventSwift.swift
//  OnePuttProApp
//
//  Created by PramodKumar on 27/11/23.
//

import Foundation
import React

@objc(BridgeEvent)
class BridgeEventSwift: RCTEventEmitter {

  override func supportedEvents() -> [String] {
    return ["onEvent"]
  }

  @objc func doMyAction() {
    sendEvent(withName: "onEvent", body: "")
  }

  // This is required to satisfy the RCTEventEmitter protocol
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
